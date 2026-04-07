use axum::{
    Json, Router,
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    routing::get,
};
use serde::{Deserialize, Serialize};
use sqlx::sqlite::SqlitePool;
use tower_http::cors::CorsLayer;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
struct Log {
    id: i64,
    level: String,
    timestamp: String,
    message: String,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
struct Webhook {
    id: i64,
    name: String,
    url: String,
    status: String,
    created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateWebhook {
    name: String,
    url: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct UpdateWebhook {
    name: Option<String>,
    url: Option<String>,
    status: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
struct Delivery {
    id: i64,
    event: String,
    status: i32,
    duration: String,
    timestamp: String,
    success: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateDelivery {
    event: String,
    status: i32,
    duration: String,
    success: bool,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
struct Event {
    id: i64,
    event: String,
    status: String,
    timestamp: String,
    duration: String,
    endpoint: String,
    attempts: i32,
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateEvent {
    event: String,
    status: String,
    duration: String,
    endpoint: String,
    attempts: i32,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
struct EventType {
    id: i64,
    name: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Settings {
    retry_attempts: i32,
    timeout_seconds: i32,
    enabled: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct HealthResponse {
    status: String,
    database: String,
}

#[derive(Debug, Deserialize)]
struct PaginationParams {
    page: Option<i64>,
    limit: Option<i64>,
}

#[derive(Clone)]
struct AppState {
    pool: SqlitePool,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let database_url =
        std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:hooky.db".to_string());

    let pool = SqlitePool::connect(&database_url)
        .await
        .expect("Failed to connect to database");

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    let state = AppState { pool };

    let app = Router::new()
        .route("/api/v1/health", get(health_check))
        .route(
            "/api/v1/deliveries",
            get(get_deliveries).post(create_delivery),
        )
        .route("/api/v1/deliveries/:id", get(get_delivery))
        .route("/api/v1/logs", get(get_logs).post(create_log))
        .route("/api/v1/events", get(get_events).post(create_event))
        .route("/api/v1/events/:id", get(get_event))
        .route("/api/v1/event-types", get(get_event_types))
        .route("/api/v1/settings", get(get_settings).put(update_settings))
        .route("/api/v1/webhooks", get(get_webhooks).post(create_webhook))
        .route(
            "/api/v1/webhooks/:id",
            get(get_webhook).put(update_webhook).delete(delete_webhook),
        )
        .layer(CorsLayer::permissive())
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();

    tracing::info!("Server running on http://0.0.0.0:8080");

    axum::serve(listener, app).await.unwrap();
}

async fn health_check(State(state): State<AppState>) -> impl IntoResponse {
    let db_status = match sqlx::query("SELECT 1").fetch_one(&state.pool).await {
        Ok(_) => "connected",
        Err(_) => "disconnected",
    };

    Json(HealthResponse {
        status: "ok".to_string(),
        database: db_status.to_string(),
    })
}

async fn get_deliveries(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<Vec<Delivery>>, StatusCode> {
    let limit = params.limit.unwrap_or(50);
    let offset = params.page.unwrap_or(0) * limit;

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

async fn get_delivery(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Delivery>, StatusCode> {
    let delivery = sqlx::query_as::<_, Delivery>("SELECT * FROM deliveries WHERE id = ?")
        .bind(id)
        .fetch_one(&state.pool)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(delivery))
}

async fn create_delivery(
    State(state): State<AppState>,
    Json(payload): Json<CreateDelivery>,
) -> Result<Json<Delivery>, StatusCode> {
    let timestamp = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();

    let result = sqlx::query(
        "INSERT INTO deliveries (event, status, duration, timestamp, success) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(&payload.event)
    .bind(payload.status)
    .bind(&payload.duration)
    .bind(&timestamp)
    .bind(payload.success)
    .execute(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let delivery = Delivery {
        id: result.last_insert_rowid(),
        event: payload.event,
        status: payload.status,
        duration: payload.duration,
        timestamp,
        success: payload.success,
    };

    Ok(Json(delivery))
}

async fn get_logs(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<Vec<Log>>, StatusCode> {
    let limit = params.limit.unwrap_or(50);
    let offset = params.page.unwrap_or(0) * limit;

    let logs =
        sqlx::query_as::<_, Log>("SELECT * FROM logs ORDER BY timestamp DESC LIMIT ? OFFSET ?")
            .bind(limit)
            .bind(offset)
            .fetch_all(&state.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(logs))
}

async fn create_log(
    State(state): State<AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Result<StatusCode, StatusCode> {
    let level = payload["level"].as_str().unwrap_or("info");
    let message = payload["message"].as_str().unwrap_or("");
    let timestamp = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();

    sqlx::query("INSERT INTO logs (level, timestamp, message) VALUES (?, ?, ?)")
        .bind(level)
        .bind(&timestamp)
        .bind(message)
        .execute(&state.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::CREATED)
}

async fn get_events(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<Vec<Event>>, StatusCode> {
    let limit = params.limit.unwrap_or(50);
    let offset = params.page.unwrap_or(0) * limit;

    let events =
        sqlx::query_as::<_, Event>("SELECT * FROM events ORDER BY timestamp DESC LIMIT ? OFFSET ?")
            .bind(limit)
            .bind(offset)
            .fetch_all(&state.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(events))
}

async fn get_event(
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

async fn create_event(
    State(state): State<AppState>,
    Json(payload): Json<CreateEvent>,
) -> Result<Json<Event>, StatusCode> {
    let timestamp = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();

    let result = sqlx::query(
        "INSERT INTO events (event, status, timestamp, duration, endpoint, attempts) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(&payload.event)
    .bind(&payload.status)
    .bind(&timestamp)
    .bind(&payload.duration)
    .bind(&payload.endpoint)
    .bind(payload.attempts)
    .execute(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let event = Event {
        id: result.last_insert_rowid(),
        event: payload.event,
        status: payload.status,
        timestamp,
        duration: payload.duration,
        endpoint: payload.endpoint,
        attempts: payload.attempts,
    };

    Ok(Json(event))
}

async fn get_event_types(State(state): State<AppState>) -> Result<Json<Vec<String>>, StatusCode> {
    let event_types = sqlx::query_as::<_, EventType>("SELECT * FROM event_types")
        .fetch_all(&state.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let names: Vec<String> = event_types.into_iter().map(|et| et.name).collect();
    Ok(Json(names))
}

async fn get_settings(State(state): State<AppState>) -> Result<Json<Settings>, StatusCode> {
    let settings = sqlx::query_as::<_, (i32, i32, bool)>(
        "SELECT retry_attempts, timeout_seconds, enabled FROM settings WHERE id = 1",
    )
    .fetch_one(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(Settings {
        retry_attempts: settings.0,
        timeout_seconds: settings.1,
        enabled: settings.2,
    }))
}

async fn update_settings(
    State(state): State<AppState>,
    Json(payload): Json<Settings>,
) -> Result<Json<Settings>, StatusCode> {
    sqlx::query(
        "UPDATE settings SET retry_attempts = ?, timeout_seconds = ?, enabled = ? WHERE id = 1",
    )
    .bind(payload.retry_attempts)
    .bind(payload.timeout_seconds)
    .bind(payload.enabled)
    .execute(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(payload))
}

async fn get_webhooks(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<Vec<Webhook>>, StatusCode> {
    let limit = params.limit.unwrap_or(50);
    let offset = params.page.unwrap_or(0) * limit;

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

async fn get_webhook(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Webhook>, StatusCode> {
    let webhook = sqlx::query_as::<_, Webhook>("SELECT * FROM webhooks WHERE id = ?")
        .bind(id)
        .fetch_one(&state.pool)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(webhook))
}

async fn create_webhook(
    State(state): State<AppState>,
    Json(payload): Json<CreateWebhook>,
) -> Result<Json<Webhook>, StatusCode> {
    let created_at = chrono::Utc::now().format("%Y-%m-%d").to_string();

    let result =
        sqlx::query("INSERT INTO webhooks (name, url, status, created_at) VALUES (?, ?, ?, ?)")
            .bind(&payload.name)
            .bind(&payload.url)
            .bind("active")
            .bind(&created_at)
            .execute(&state.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let webhook = Webhook {
        id: result.last_insert_rowid(),
        name: payload.name,
        url: payload.url,
        status: "active".to_string(),
        created_at,
    };

    Ok(Json(webhook))
}

async fn update_webhook(
    State(state): State<AppState>,
    Path(id): Path<i64>,
    Json(payload): Json<UpdateWebhook>,
) -> Result<Json<Webhook>, StatusCode> {
    if let Some(name) = &payload.name {
        sqlx::query("UPDATE webhooks SET name = ? WHERE id = ?")
            .bind(name)
            .bind(id)
            .execute(&state.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    }

    if let Some(url) = &payload.url {
        sqlx::query("UPDATE webhooks SET url = ? WHERE id = ?")
            .bind(url)
            .bind(id)
            .execute(&state.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    }

    if let Some(status) = &payload.status {
        sqlx::query("UPDATE webhooks SET status = ? WHERE id = ?")
            .bind(status)
            .bind(id)
            .execute(&state.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    }

    let webhook = sqlx::query_as::<_, Webhook>("SELECT * FROM webhooks WHERE id = ?")
        .bind(id)
        .fetch_one(&state.pool)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(webhook))
}

async fn delete_webhook(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<StatusCode, StatusCode> {
    sqlx::query("DELETE FROM webhooks WHERE id = ?")
        .bind(id)
        .execute(&state.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}
