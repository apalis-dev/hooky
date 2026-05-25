use std::convert::Infallible;

use anyhow::Context;
use apalis::prelude::*;
use apalis_codec::json::JsonCodec;
use apalis_sqlite::{HookCallbackListener, SqliteContext, SqliteStorage};
use tracing::{info, instrument};
use ulid::Ulid;

use crate::app::AppState;
use crate::dispatch::DispatchTask;
use crate::helpers::generate_id;
use crate::settings::Settings;
use crate::webhooks::Webhook;

pub type TaskStorage = SqliteStorage<DispatchTask, JsonCodec<Vec<u8>>, HookCallbackListener>;

impl<T: Sync> FromRequest<Task<T, SqliteContext, Ulid>> for AppState {
    type Error = Infallible;
    async fn from_request(req: &Task<T, SqliteContext, Ulid>) -> Result<Self, Self::Error> {
        Ok(req.parts.data.get_checked::<AppState>().unwrap().clone())
    }
}

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

#[instrument(skip_all, fields(webhook_id, event_id = %dispatch.event_id))]
async fn dispatch_service(dispatch: DispatchTask, state: AppState) -> anyhow::Result<()> {
    let webhook = sqlx::query_as::<_, Webhook>(
        "SELECT wh.* FROM webhooks wh INNER JOIN events ev ON wh.id = ev.webhook_id WHERE ev.id = ?",
    )
    .bind(&dispatch.event_id)
    .fetch_one(&state.pool)
    .await
    .map_err(|e| {
        tracing::error!(error = %e, event_id = %dispatch.event_id, "Failed to fetch webhook");
        e
    })?;

    tracing::Span::current().record("webhook_id", &webhook.id);
    tracing::info!(url = %webhook.url, event_id = %dispatch.event_id, "Dispatching event");

    let settings = sqlx::query_as::<_, Settings>("SELECT * FROM settings WHERE event_type_id = ?")
        .bind(&dispatch.event_type_id)
        .fetch_optional(&state.pool)
        .await
        .map_err(|e| {
            tracing::warn!(error = %e, event_type_id = %dispatch.event_type_id, "Failed to fetch settings, using defaults");
            e
        })?;

    let timeout_seconds = settings
        .as_ref()
        .map(|s| s.timeout_seconds as u64)
        .unwrap_or(30);

    tracing::debug!(timeout_seconds, "Resolved dispatch settings");

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
            let status = if ok { "success" } else { "fail" };
            if ok {
                tracing::info!(status_code = code, duration_ms, "Delivery succeeded");
            } else {
                tracing::warn!(
                    status_code = code,
                    duration_ms,
                    "Delivery failed — endpoint returned error status"
                );
            }
            (code, ok, status)
        }
        Err(ref e) if e.is_timeout() => {
            tracing::error!(duration_ms, timeout_seconds, "Delivery timed out");
            (0, false, "fail")
        }
        Err(ref e) if e.is_connect() => {
            tracing::error!(error = %e, url = %webhook.url, "Failed to connect to endpoint");
            (0, false, "fail")
        }
        Err(ref e) => {
            tracing::error!(error = %e, "Delivery failed — unexpected error");
            (0, false, "fail")
        }
    };

    sqlx::query("UPDATE events SET status = ?, duration_ms = ? WHERE id = ?")
        .bind(final_status)
        .bind(duration_ms)
        .bind(&dispatch.event_id)
        .execute(&state.pool)
        .await
        .map_err(|e| {
            tracing::error!(error = %e, event_id = %dispatch.event_id, "Failed to update event status");
            e
        })?;

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
    .await
    .map_err(|e| {
        tracing::error!(error = %e, delivery_id = %delivery_id, "Failed to insert delivery record");
        e
    })?;

    tracing::info!(delivery_id = %delivery_id, success, duration_ms, "Dispatch complete");

    Ok(())
}
