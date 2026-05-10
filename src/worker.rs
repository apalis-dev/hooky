use anyhow::Context;
use apalis::prelude::*;
use apalis_codec::json::JsonCodec;
use apalis_sqlite::{HookCallbackListener, SqliteStorage};
use tracing::info;

use crate::app::AppState;
use crate::dispatch::DispatchTask;
use crate::helpers::generate_id;
use crate::settings::Settings;
use crate::webhooks::Webhook;

pub type TaskStorage = SqliteStorage<DispatchTask, JsonCodec<Vec<u8>>, HookCallbackListener>;

pub async fn worker(state: AppState) -> anyhow::Result<()> {
    WorkerBuilder::new("dispatch-worker")
        .backend(state.storage.clone())
        .catch_panic()
        .enable_tracing()
        // .layer(TraceLayer::new().make_span_with(ContextualTaskSpan::new()))
        .data(state.clone())
        .on_event(|ctx, ev| {
            info!("Received {} event from {} Worker", ev, ctx.name());
        })
        .build(dispatch_service) // Always restart a worker
        .run_until(tokio::signal::ctrl_c())
        .await
        .context("Worker failed")?;
    Ok(())
}

async fn dispatch_service(dispatch: DispatchTask, state: Data<AppState>) -> anyhow::Result<()> {
    let webhook = sqlx::query_as::<_, Webhook>(
        "SELECT wh.* FROM webhooks wh INNER JOIN events ev ON wh.id = ev.webhook_id WHERE ev.id = ?",
    )
    .bind(&dispatch.event_id)
    .fetch_one(&state.pool)
    .await?;

    let settings = sqlx::query_as::<_, Settings>("SELECT * FROM settings WHERE event_type_id = ?")
        .bind(&dispatch.event_type_id)
        .fetch_optional(&state.pool)
        .await?;

    let timeout_seconds = settings
        .as_ref()
        .map(|s| s.timeout_seconds as u64)
        .unwrap_or(30);
    let start = std::time::Instant::now();

    let response = state
        .http
        .post(&webhook.url)
        .timeout(std::time::Duration::from_secs(timeout_seconds))
        .json(&dispatch.payload)
        .send()
        .await;

    let duration_ms = start.elapsed().as_millis() as i64;

    let (status_code, success, final_status) = match response {
        Ok(r) => {
            let code = r.status().as_u16() as i32;
            let ok = r.status().is_success();
            (code, ok, if ok { "success" } else { "fail" })
        }
        Err(_) => (0, false, "fail"),
    };

    sqlx::query("UPDATE events SET status = ?, duration_ms = ? WHERE id = ?")
        .bind(final_status)
        .bind(duration_ms)
        .bind(&dispatch.event_id)
        .execute(&state.pool)
        .await?;

    let delivery_timestamp = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();

    let delivery_id = generate_id("DE");
    sqlx::query(
        "INSERT INTO deliveries (id, event_id, webhook_id, status_code, success, duration_ms, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&delivery_id)
    .bind(&dispatch.event_id)
    .bind(&webhook.id)
    .bind(status_code)
    .bind(success)
    .bind(duration_ms)
    .bind(&delivery_timestamp)
    .execute(&state.pool)
    .await?;
    Ok(())
}
