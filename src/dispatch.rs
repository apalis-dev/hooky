use apalis::prelude::{TaskBuilder, TaskId, TaskSink};
use axum::{Json, extract::State};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use ulid::Ulid;
use utoipa::ToSchema;

use crate::{app::AppState, event_types::EventType, helpers::generate_id, webhooks::Webhook};

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct DispatchRequest {
    webhook_name: String,
    event_type: String,
    payload: Value,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct DispatchResponse {
    event_id: String,
    task_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DispatchTask {
    pub event_id: String,
    pub event_type_id: String,
    pub payload: Value,
}

#[utoipa::path(
    post,
    path = "/api/v1/dispatch",
    request_body = DispatchRequest,
    responses(
        (status = 200, description = "Dispatched successfully", body = DispatchResponse),
        (status = 404, description = "Webhook or event type not found"),
        (status = 422, description = "Webhook is not active")
    ),
    tag = "dispatch"
)]
pub async fn dispatch(
    State(mut state): State<AppState>,
    Json(request): Json<DispatchRequest>,
) -> Result<Json<DispatchResponse>, StatusCode> {
    let webhook = sqlx::query_as::<_, Webhook>("SELECT * FROM webhooks WHERE name = ?")
        .bind(&request.webhook_name)
        .fetch_one(&state.pool)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    if webhook.status != "active" {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }

    let event_type = sqlx::query_as::<_, EventType>(
        "SELECT et.* FROM event_types et 
                    INNER JOIN webhooks wh ON et.webhook_id = wh.id 
                    WHERE et.name = ? AND wh.name = ?",
    )
    .bind(&request.event_type)
    .bind(&request.webhook_name)
    .fetch_one(&state.pool)
    .await
    .map_err(|_| StatusCode::NOT_FOUND)?;

    let timestamp = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();

    let event_id = generate_id("EV");
    sqlx::query(
        "INSERT INTO events (id, webhook_id, event_type_id, status, timestamp, duration_ms, attempts)
         VALUES (?, ?, ?, 'sending', ?, 0, 1)",
    )
    .bind(&event_id)
    .bind(&webhook.id)
    .bind(&event_type.id)
    .bind(&timestamp)
    .execute(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let task_id = TaskId::new(Ulid::new());

    let task = TaskBuilder::new(DispatchTask {
        event_id: event_id.clone(),
        event_type_id: event_type.id,
        payload: request.payload,
    })
    .with_task_id(task_id)
    .build();

    state
        .storage
        .push_task(task)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(DispatchResponse {
        event_id,
        task_id: task_id.inner().to_string(),
    }))
}
