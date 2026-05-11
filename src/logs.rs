use axum::{Json, extract::{Query, State}};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use crate::{app::PaginationParams, helpers::generate_id};

use crate::app::AppState;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, ToSchema)]
pub struct Log {
    id: i64,
    webhook_id: Option<String>,
    level: String,
    message: String,
    timestamp: String,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct CreateLog {
    webhook_id: Option<String>,
    level: String,
    message: String,
}

#[utoipa::path(
    get,
    path = "/api/v1/logs",
    params(PaginationParams),
    responses(
        (status = 200, description = "List of logs", body = Vec<Log>)
    ),
    tag = "logs"
)]
pub async fn get_logs(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<Vec<Log>>, StatusCode> {
    let (limit, offset) = params.limit_offset();
    let logs =
        sqlx::query_as::<_, Log>("SELECT * FROM logs ORDER BY timestamp DESC LIMIT ? OFFSET ?")
            .bind(limit)
            .bind(offset)
            .fetch_all(&state.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(logs))
}



#[utoipa::path(
    post,
    path = "/api/v1/logs",
    request_body = CreateLog,
    responses(
        (status = 201, description = "Log created")
    ),
    tag = "logs"
)]
pub async fn create_log(
    State(state): State<AppState>,
    Json(payload): Json<CreateLog>,
) -> Result<StatusCode, StatusCode> {
    let log_id = generate_id("LG");
    let timestamp = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();
    sqlx::query("INSERT INTO logs (id, webhook_id, level, message, timestamp) VALUES (?, ?, ?, ?, ?)")
        .bind(log_id)
        .bind(&payload.webhook_id)
        .bind(&payload.level)
        .bind(&payload.message)
        .bind(&timestamp)
        .execute(&state.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(StatusCode::CREATED)
}
