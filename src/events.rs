use axum::{
    Json,
    extract::{Path, Query, State},
};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::{
    app::{AppState, PaginationParams},
    helpers::generate_id,
};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, ToSchema)]
pub struct Event {
    id: String,
    webhook_id: String,
    event_type_id: String,
    status: String,
    timestamp: String,
    duration_ms: i64,
    attempts: i32,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct CreateEvent {
    webhook_id: String,
    event_type_id: String,
    status: Option<String>,
    duration_ms: i64,
    attempts: Option<i32>,
}

#[utoipa::path(
    get,
    path = "/api/v1/events",
    params(PaginationParams),
    responses(
        (status = 200, description = "List of events", body = Vec<Event>)
    ),
    tag = "events"
)]
pub async fn get_events(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<Vec<Event>>, StatusCode> {
    let (limit, offset) = params.limit_offset();
    let events =
        sqlx::query_as::<_, Event>("SELECT * FROM events ORDER BY timestamp DESC LIMIT ? OFFSET ?")
            .bind(limit)
            .bind(offset)
            .fetch_all(&state.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(events))
}

#[utoipa::path(
    get,
    path = "/api/v1/webhooks/{id}/events",
    params(
        ("id" = String, Path, description = "Webhook UUID"),
        PaginationParams,
    ),
    responses(
        (status = 200, description = "Events for webhook", body = Vec<Event>),
        (status = 404, description = "Webhook not found")
    ),
    tag = "events"
)]
pub async fn get_webhook_events(
    State(state): State<AppState>,
    Path(webhook_id): Path<String>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<Vec<Event>>, StatusCode> {
    let (limit, offset) = params.limit_offset();
    let events = sqlx::query_as::<_, Event>(
        "SELECT * FROM events WHERE webhook_id = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?",
    )
    .bind(webhook_id)
    .bind(limit)
    .bind(offset)
    .fetch_all(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(events))
}

#[utoipa::path(
    get,
    path = "/api/v1/events/{id}",
    params(("id" = i64, Path, description = "Event ID")),
    responses(
        (status = 200, description = "Event", body = Event),
        (status = 404, description = "Not found")
    ),
    tag = "events"
)]
pub async fn get_event(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Event>, StatusCode> {
    let event = sqlx::query_as::<_, Event>("SELECT * FROM events WHERE id = ?")
        .bind(id)
        .fetch_one(&state.pool)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;
    Ok(Json(event))
}

#[utoipa::path(
    post,
    path = "/api/v1/events",
    request_body = CreateEvent,
    responses(
        (status = 200, description = "Event created", body = Event)
    ),
    tag = "events"
)]
pub async fn create_event(
    State(state): State<AppState>,
    Json(payload): Json<CreateEvent>,
) -> Result<Json<Event>, StatusCode> {
    let event_id = generate_id("EV");
    let timestamp = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();
    let status = payload.status.unwrap_or_else(|| "sending".to_string());
    let attempts = payload.attempts.unwrap_or(1);
    sqlx::query(
        "INSERT INTO events (id, webhook_id, event_type_id, status, timestamp, duration_ms, attempts)
         VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&event_id)
    .bind(&payload.webhook_id)
    .bind(&payload.event_type_id)
    .bind(&status)
    .bind(&timestamp)
    .bind(payload.duration_ms)
    .bind(attempts)
    .execute(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(Event {
        id: event_id,
        webhook_id: payload.webhook_id,
        event_type_id: payload.event_type_id,
        status,
        timestamp,
        duration_ms: payload.duration_ms,
        attempts,
    }))
}
