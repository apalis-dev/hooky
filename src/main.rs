use std::time::Duration;

use apalis::prelude::{BackoffConfig, IntervalStrategy, StrategyBuilder};
use apalis_sqlite::{Config, SqliteStorage};
use tracing_subscriber::{
    EnvFilter, Layer, filter::filter_fn, layer::SubscriberExt, util::SubscriberInitExt,
};

use crate::{
    app::{AppState, http},
    subscriber::DbLogLayer,
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
mod subscriber;
mod webhooks;
mod worker;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let database_url =
        std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:hooky.db".to_string());

    let lazy_strategy = StrategyBuilder::new()
        .apply(IntervalStrategy::new(Duration::from_secs(1)).with_backoff(BackoffConfig::default()))
        .build();

    let config = Config::new("dispatch").with_poll_interval(lazy_strategy);

    let storage = SqliteStorage::new_with_callback(&database_url, &config);

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::fmt::layer().with_filter(
                EnvFilter::try_from_default_env()
                    .or_else(|_| {
                        EnvFilter::try_new(format!(
                            "{}=debug,tower_http=info,axum=info,apalis=debug",
                            env!("CARGO_CRATE_NAME")
                        ))
                    })
                    .unwrap(),
            ),
        )
        .with(
            DbLogLayer::new(storage.pool().clone()).with_filter(filter_fn(|metadata| {
                let target = metadata.target();
                target.starts_with(env!("CARGO_CRATE_NAME"))
                    || target.starts_with("reqwest")
                    || target.starts_with("hyper")
            })),
        )
        .init();

    helpers::migrator().run(storage.pool()).await?;

    let state = AppState {
        pool: storage.pool().clone(),
        storage,
        http: reqwest::Client::new(),
    };

    tokio::try_join!(http(state.clone()), worker(state))?;

    Ok(())
}
