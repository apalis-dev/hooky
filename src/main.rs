use std::time::Duration;

use apalis::prelude::{BackoffConfig, IntervalStrategy, StrategyBuilder};
use apalis_sqlite::{Config, SqliteStorage};
use tracing_subscriber::EnvFilter;

use crate::{
    app::{AppState, http},
    worker::worker,
};

mod app;
mod deliveries;
mod dispatch;
mod event_types;
mod events;
mod helpers;
mod logs;
mod settings;
mod webhooks;
mod worker;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .or_else(|_| {
                    EnvFilter::try_new(format!(
                        "{}=debug,tower_http=debug,axum=trace,apalis=debug",
                        env!("CARGO_CRATE_NAME")
                    ))
                })
                .unwrap(),
        )
        .init();

    let database_url =
        std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:hooky.db".to_string());

    let lazy_strategy = StrategyBuilder::new()
        .apply(IntervalStrategy::new(Duration::from_secs(1)).with_backoff(BackoffConfig::default()))
        .build();

    let config = Config::new("dispatch").with_poll_interval(lazy_strategy);

    let storage = SqliteStorage::new_with_callback(&database_url, &config);

    helpers::migrator().run(storage.pool()).await?;

    let state = AppState {
        pool: storage.pool().clone(),
        storage,
        http: reqwest::Client::new(),
    };

    tokio::try_join!(http(state.clone()), worker(state))?;

    Ok(())
}
