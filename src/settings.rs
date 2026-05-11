use axum::{
    Json,
    extract::{Path, State},
};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::{app::AppState, helpers::generate_id};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, ToSchema)]
pub struct Settings {
    pub(crate) id: String,
    pub(crate) event_type_id: String,
    pub(crate) retry_attempts: i32,
    pub(crate) timeout_seconds: i32,
    pub(crate) enabled: bool,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct UpsertSettings {
    retry_attempts: i32,
    timeout_seconds: i32,
    enabled: bool,
}

#[utoipa::path(
    get,
    path = "/api/v1/event-types/{id}/settings",
    params(("id" = i64, Path, description = "Event type ID")),
    responses(
        (status = 200, description = "Settings for event type", body = Settings),
        (status = 404, description = "No settings found for event type")
    ),
    tag = "settings"
)]
pub async fn get_event_type_settings(
    State(state): State<AppState>,
    Path(event_type_id): Path<i64>,
) -> Result<Json<Settings>, StatusCode> {
    let settings = sqlx::query_as::<_, Settings>("SELECT * FROM settings WHERE event_type_id = ?")
        .bind(event_type_id)
        .fetch_one(&state.pool)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;
    Ok(Json(settings))
}

#[utoipa::path(
    put,
    path = "/api/v1/event-types/{id}/settings",
    params(("id" = i64, Path, description = "Event type ID")),
    request_body = UpsertSettings,
    responses(
        (status = 200, description = "Upserted settings", body = Settings)
    ),
    tag = "settings"
)]
pub async fn upsert_event_type_settings(
    State(state): State<AppState>,
    Path(event_type_id): Path<i64>,
    Json(payload): Json<UpsertSettings>,
) -> Result<Json<Settings>, StatusCode> {
    let setting_id = generate_id("ST");
    let settings = sqlx::query_as::<_, Settings>(
        "INSERT INTO settings (id, event_type_id, retry_attempts, timeout_seconds, enabled)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT (event_type_id)
         DO UPDATE SET
             retry_attempts  = excluded.retry_attempts,
             timeout_seconds = excluded.timeout_seconds,
             enabled         = excluded.enabled
         RETURNING *",
    )
    .bind(setting_id)
    .bind(event_type_id)
    .bind(payload.retry_attempts)
    .bind(payload.timeout_seconds)
    .bind(payload.enabled)
    .fetch_one(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(settings))
}
