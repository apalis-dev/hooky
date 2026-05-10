use axum::{
    Json,
    extract::{Path, Query, State},
};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::{
    app::{AppState, PaginationParams}, event_types::EventType, helpers::generate_id, logs::Log
};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, ToSchema)]
pub struct Webhook {
    pub(crate) id: String,
    pub(crate) name: String,
    pub(crate) url: String,
    pub(crate) status: String,
    pub(crate) created_at: String,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct CreateWebhook {
    name: String,
    url: String,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct UpdateWebhook {
    name: Option<String>,
    url: Option<String>,
    status: Option<String>,
}

#[utoipa::path(
    get,
    path = "/api/v1/webhooks/{id}/logs",
    params(
        ("id" = String, Path, description = "Webhook UUID"),
        PaginationParams,
    ),
    responses(
        (status = 200, description = "Logs for webhook", body = Vec<Log>),
        (status = 404, description = "Webhook not found")
    ),
    tag = "logs"
)]
pub async fn get_webhook_logs(
    State(state): State<AppState>,
    Path(webhook_id): Path<String>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<Vec<Log>>, StatusCode> {
    let (limit, offset) = params.limit_offset();
    let logs = sqlx::query_as::<_, Log>(
        "SELECT * FROM logs WHERE webhook_id = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?",
    )
    .bind(webhook_id)
    .bind(limit)
    .bind(offset)
    .fetch_all(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(logs))
}

#[utoipa::path(
    get,
    path = "/api/v1/webhooks",
    params(PaginationParams),
    responses(
        (status = 200, description = "List of webhooks", body = Vec<Webhook>)
    ),
    tag = "webhooks"
)]
pub async fn get_webhooks(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<Vec<Webhook>>, StatusCode> {
    let (limit, offset) = params.limit_offset();
    let webhooks = sqlx::query_as::<_, Webhook>(
        "SELECT * FROM webhooks ORDER BY created_at DESC LIMIT ? OFFSET ?",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(webhooks))
}

#[utoipa::path(
    post,
    path = "/api/v1/webhooks",
    request_body = CreateWebhook,
    responses(
        (status = 200, description = "Webhook created", body = Webhook),
        (status = 409, description = "URL already exists")
    ),
    tag = "webhooks"
)]
pub async fn create_webhook(
    State(state): State<AppState>,
    Json(payload): Json<CreateWebhook>,
) -> Result<Json<Webhook>, StatusCode> {
    let id = generate_id("WH");
    let created_at = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();
    sqlx::query(
        "INSERT INTO webhooks (id, name, url, status, created_at) VALUES (?, ?, ?, 'active', ?)",
    )
    .bind(&id)
    .bind(&payload.name)
    .bind(&payload.url)
    .bind(&created_at)
    .execute(&state.pool)
    .await
    .map_err(|e| {
        if e.to_string().contains("UNIQUE") {
            StatusCode::CONFLICT
        } else {
            StatusCode::INTERNAL_SERVER_ERROR
        }
    })?;
    Ok(Json(Webhook {
        id,
        name: payload.name,
        url: payload.url,
        status: "active".to_string(),
        created_at,
    }))
}

#[utoipa::path(
    get,
    path = "/api/v1/webhooks/{id}",
    params(("id" = String, Path, description = "Webhook UUID")),
    responses(
        (status = 200, description = "Webhook", body = Webhook),
        (status = 404, description = "Not found")
    ),
    tag = "webhooks"
)]
pub async fn get_webhook(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Webhook>, StatusCode> {
    let webhook = sqlx::query_as::<_, Webhook>("SELECT * FROM webhooks WHERE id = ?")
        .bind(id)
        .fetch_one(&state.pool)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;
    Ok(Json(webhook))
}

#[utoipa::path(
    put,
    path = "/api/v1/webhooks/{id}",
    params(("id" = String, Path, description = "Webhook UUID")),
    request_body = UpdateWebhook,
    responses(
        (status = 200, description = "Updated webhook", body = Webhook),
        (status = 404, description = "Not found"),
        (status = 409, description = "URL already exists")
    ),
    tag = "webhooks"
)]
pub async fn update_webhook(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateWebhook>,
) -> Result<Json<Webhook>, StatusCode> {
    let mut sets: Vec<&str> = Vec::new();
    if payload.name.is_some() {
        sets.push("name = ?");
    }
    if payload.url.is_some() {
        sets.push("url = ?");
    }
    if payload.status.is_some() {
        sets.push("status = ?");
    }

    if sets.is_empty() {
        let webhook = sqlx::query_as::<_, Webhook>("SELECT * FROM webhooks WHERE id = ?")
            .bind(id)
            .fetch_one(&state.pool)
            .await
            .map_err(|_| StatusCode::NOT_FOUND)?;
        return Ok(Json(webhook));
    }

    let sql = format!("UPDATE webhooks SET {} WHERE id = ?", sets.join(", "));
    let mut q = sqlx::query(&sql);
    if let Some(ref v) = payload.name {
        q = q.bind(v);
    }
    if let Some(ref v) = payload.url {
        q = q.bind(v);
    }
    if let Some(ref v) = payload.status {
        q = q.bind(v);
    }
    q = q.bind(&id);
    q.execute(&state.pool).await.map_err(|e| {
        if e.to_string().contains("UNIQUE") {
            StatusCode::CONFLICT
        } else {
            StatusCode::INTERNAL_SERVER_ERROR
        }
    })?;

    let webhook = sqlx::query_as::<_, Webhook>("SELECT * FROM webhooks WHERE id = ?")
        .bind(id)
        .fetch_one(&state.pool)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;
    Ok(Json(webhook))
}

#[utoipa::path(
    delete,
    path = "/api/v1/webhooks/{id}",
    params(("id" = String, Path, description = "Webhook UUID")),
    responses(
        (status = 204, description = "Deleted"),
        (status = 404, description = "Not found")
    ),
    tag = "webhooks"
)]
pub async fn delete_webhook(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query("DELETE FROM webhooks WHERE id = ?")
        .bind(id)
        .execute(&state.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    if result.rows_affected() == 0 {
        return Err(StatusCode::NOT_FOUND);
    }
    Ok(StatusCode::NO_CONTENT)
}

#[utoipa::path(
    get,
    path = "/api/v1/webhooks/{id}/event-types",
    params(("id" = String, Path, description = "Webhook UUID")),
    responses(
        (status = 200, description = "Event types for webhook", body = Vec<EventType>),
        (status = 404, description = "Webhook not found")
    ),
    tag = "event-types"
)]
pub async fn get_webhook_event_types(
    State(state): State<AppState>,
    Path(webhook_id): Path<String>,
) -> Result<Json<Vec<EventType>>, StatusCode> {
    let event_types = sqlx::query_as::<_, EventType>(
        "SELECT * FROM event_types WHERE webhook_id = ? ORDER BY name ASC",
    )
    .bind(webhook_id)
    .fetch_all(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(event_types))
}
