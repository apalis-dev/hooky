use std::borrow::Cow;

use apalis_sqlite::SqliteStorage;
use nanoid::nanoid;
use sqlx::migrate::{Migration, Migrator};
use tokio::signal;

pub fn generate_id(prefix: &str) -> String {
    format!("{prefix}_{}", nanoid!(17, &nanoid::alphabet::SAFE))
}

pub fn migrator() -> Migrator {
    let app_migrations = sqlx::migrate!("./migrations");
    let worker_migrations = SqliteStorage::migrations();

    let mut migrations: Vec<Migration> = app_migrations
        .iter()
        .cloned()
        .chain(worker_migrations.iter().cloned())
        .collect();

    migrations.sort_by_key(|m| m.version);

    Migrator {
        migrations: Cow::Owned(migrations),
        ignore_missing: false,
        locking: true,
        no_tx: false,
    }
}

pub async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}
