use axum::{Json, Router, extract::State, response::IntoResponse};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use utoipa::{IntoParams, OpenApi, ToSchema};
use utoipa_axum::{router::OpenApiRouter, routes};
use utoipa_swagger_ui::SwaggerUi;

use crate::{
    deliveries::*, dispatch::*, event_types::*, events::*, helpers::shutdown_signal, logs::*,
    settings::*, webhooks::*, worker::TaskStorage,
};

#[derive(Debug, Serialize, Deserialize, ToSchema)]
struct HealthResponse {
    status: String,
    database: String,
}

#[derive(Debug, Deserialize, ToSchema, IntoParams)]
pub struct PaginationParams {
    page: Option<i64>,
    limit: Option<i64>,
}

impl PaginationParams {
    pub fn limit_offset(&self) -> (i64, i64) {
        let limit = self.limit.unwrap_or(50).clamp(1, 200);
        let offset = self.page.unwrap_or(0) * limit;
        (limit, offset)
    }
}

#[derive(Clone, Debug)]
pub struct AppState {
    pub pool: SqlitePool,
    pub http: reqwest::Client,
    pub storage: TaskStorage,
}

#[derive(OpenApi)]
#[openapi(
    info(
        title = "Hooky",
        version = "1.0.0",
        description = "Webhook delivery and management API"
    ),
    components(schemas(
        Log,
        CreateLog,
        Webhook,
        CreateWebhook,
        UpdateWebhook,
        Delivery,
        CreateDelivery,
        Event,
        CreateEvent,
        EventType,
        Settings,
        UpsertSettings,
        DispatchRequest,
        DispatchResponse,
        HealthResponse,
        PaginationParams,
    ))
)]
struct ApiDoc;

#[utoipa::path(
    get,
    path = "/api/v1/health",
    responses(
        (status = 200, description = "Service health", body = HealthResponse)
    ),
    tag = "health"
)]
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

pub fn router(state: AppState) -> Router {
    let (router, api) = OpenApiRouter::with_openapi(ApiDoc::openapi())
        .routes(routes!(health_check))
        .routes(routes!(get_logs, create_log))
        .routes(routes!(get_webhooks, create_webhook))
        .routes(routes!(get_webhook, update_webhook, delete_webhook))
        .routes(routes!(get_webhook_logs))
        .routes(routes!(get_webhook_events))
        .routes(routes!(get_webhook_deliveries))
        .routes(routes!(get_webhook_event_types))
        .routes(routes!(get_events, create_event))
        .routes(routes!(get_event))
        .routes(routes!(get_deliveries, create_delivery))
        .routes(routes!(get_delivery))
        .routes(routes!(get_event_types, create_event_type))
        .routes(routes!(get_event_type_settings, upsert_event_type_settings))
        .routes(routes!(dispatch))
        .with_state(state)
        .layer(TraceLayer::new_for_http())
        .split_for_parts();

    router
        .merge(SwaggerUi::new("/api/v1/swagger-ui").url("/api/v1/openapi.json", api))
        .layer(CorsLayer::permissive())
}

pub async fn http(state: AppState) -> anyhow::Result<()> {
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await?;
    tracing::info!("Server running on http://0.0.0.0:8080");
    tracing::info!("OpenAPI docs at http://0.0.0.0:8080/api/v1/swagger-ui");
    axum::serve(listener, router(state.clone()))
        .with_graceful_shutdown(shutdown_signal())
        .await?;
    Ok(())
}
