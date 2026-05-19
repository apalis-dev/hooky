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
pub struct Delivery {
    id: String,
    event_id: String,
    webhook_id: String,
    status_code: i32,
    success: bool,
    duration_ms: i64,
    timestamp: String,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct CreateDelivery {
    event_id: String,
    webhook_id: String,
    status_code: i32,
    success: bool,
    duration_ms: i64,
}

#[utoipa::path(
    get,
    path = "/api/v1/deliveries",
    params(PaginationParams),
    responses(
        (status = 200, description = "List of deliveries", body = Vec<Delivery>)
    ),
    tag = "deliveries"
)]
pub async fn get_deliveries(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<Vec<Delivery>>, StatusCode> {
    let (limit, offset) = params.limit_offset();
    let deliveries = sqlx::query_as::<_, Delivery>(
        "SELECT * FROM deliveries ORDER BY timestamp DESC LIMIT ? OFFSET ?",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(deliveries))
}

#[utoipa::path(
    get,
    path = "/api/v1/webhooks/{id}/deliveries",
    params(
        ("id" = String, Path, description = "Webhook ID"),
        PaginationParams,
    ),
    responses(
        (status = 200, description = "Deliveries for webhook", body = Vec<Delivery>),
        (status = 404, description = "Webhook not found")
    ),
    tag = "deliveries"
)]
pub async fn get_webhook_deliveries(
    State(state): State<AppState>,
    Path(webhook_id): Path<String>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<Vec<Delivery>>, StatusCode> {
    let (limit, offset) = params.limit_offset();
    let deliveries = sqlx::query_as::<_, Delivery>(
        "SELECT * FROM deliveries WHERE webhook_id = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?",
    )
    .bind(webhook_id)
    .bind(limit)
    .bind(offset)
    .fetch_all(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(deliveries))
}

#[utoipa::path(
    get,
    path = "/api/v1/deliveries/{id}",
    params(("id" = String, Path, description = "Delivery ID")),
    responses(
        (status = 200, description = "Delivery", body = Delivery),
        (status = 404, description = "Not found")
    ),
    tag = "deliveries"
)]
pub async fn get_delivery(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Delivery>, StatusCode> {
    let delivery = sqlx::query_as::<_, Delivery>("SELECT * FROM deliveries WHERE id = ?")
        .bind(id)
        .fetch_one(&state.pool)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;
    Ok(Json(delivery))
}

#[utoipa::path(
    post,
    path = "/api/v1/deliveries",
    request_body = CreateDelivery,
    responses(
        (status = 200, description = "Delivery created", body = Delivery)
    ),
    tag = "deliveries"
)]
pub async fn create_delivery(
    State(state): State<AppState>,
    Json(payload): Json<CreateDelivery>,
) -> Result<Json<Delivery>, StatusCode> {
    let delivery_id = generate_id("DE");
    let timestamp = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();
    sqlx::query(
        "INSERT INTO deliveries (id, event_id, webhook_id, status_code, success, duration_ms, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&delivery_id)
    .bind(&payload.event_id)
    .bind(&payload.webhook_id)
    .bind(payload.status_code)
    .bind(payload.success)
    .bind(payload.duration_ms)
    .bind(&timestamp)
    .execute(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(Delivery {
        id: delivery_id,
        event_id: payload.event_id,
        webhook_id: payload.webhook_id,
        status_code: payload.status_code,
        success: payload.success,
        duration_ms: payload.duration_ms,
        timestamp,
    }))
}
