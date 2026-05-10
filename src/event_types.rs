use axum::{Json, extract::State};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::{app::AppState, helpers::generate_id};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, ToSchema)]
pub struct EventType {
    pub(crate) id: String,
    pub(crate) webhook_id: String,
    pub(crate) name: String,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct CreateEventType {
    webhook_id: String,
    name: String,
}

#[utoipa::path(
    get,
    path = "/api/v1/event-types",
    responses(
        (status = 200, description = "All event types", body = Vec<EventType>)
    ),
    tag = "event-types"
)]
pub async fn get_event_types(
    State(state): State<AppState>,
) -> Result<Json<Vec<EventType>>, StatusCode> {
    let event_types = sqlx::query_as::<_, EventType>("SELECT * FROM event_types ORDER BY name ASC")
        .fetch_all(&state.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(event_types))
}

#[utoipa::path(
    post,
    path = "/api/v1/event-types",
    request_body = CreateEventType,
    responses(
        (status = 201, description = "Event type created", body = EventType),
        (status = 409, description = "Event type already exists for this webhook")
    ),
    tag = "event-types"
)]
pub async fn create_event_type(
    State(state): State<AppState>,
    Json(payload): Json<CreateEventType>,
) -> Result<(StatusCode, Json<EventType>), StatusCode> {
    let event_type_id = generate_id("ET");
    sqlx::query("INSERT INTO event_types (id, webhook_id, name) VALUES (?, ?, ?)")
        .bind(&event_type_id)
        .bind(&payload.webhook_id)
        .bind(&payload.name)
        .execute(&state.pool)
        .await
        .map_err(|e| {
            if e.to_string().contains("UNIQUE") {
                StatusCode::CONFLICT
            } else {
                StatusCode::INTERNAL_SERVER_ERROR
            }
        })?;

    Ok((
        StatusCode::CREATED,
        Json(EventType {
            id: event_type_id,
            webhook_id: payload.webhook_id,
            name: payload.name,
        }),
    ))
}
