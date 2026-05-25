use sqlx::SqlitePool;
use std::collections::HashMap;
use tokio::sync::mpsc;
use tracing::field::{Field, Visit};
use tracing::{Event, Subscriber};
use tracing_subscriber::layer::{Context, Layer};
use tracing_subscriber::registry::LookupSpan;

use crate::{helpers::generate_id, logs::CreateLog};

// Visits fields on a tracing event to extract message and webhook_id from span scope
struct LogVisitor {
    message: String,
    fields: HashMap<String, String>,
}

impl LogVisitor {
    fn new() -> Self {
        Self {
            message: String::new(),
            fields: HashMap::new(),
        }
    }
}

impl Visit for LogVisitor {
    fn record_str(&mut self, field: &Field, value: &str) {
        if field.name() == "message" {
            self.message = value.to_string();
        } else {
            self.fields
                .insert(field.name().to_string(), value.to_string());
        }
    }

    fn record_debug(&mut self, field: &Field, value: &dyn std::fmt::Debug) {
        let s = format!("{:?}", value);
        if field.name() == "message" {
            self.message = s;
        } else {
            self.fields.insert(field.name().to_string(), s);
        }
    }
}

pub struct DbLogLayer {
    sender: mpsc::UnboundedSender<CreateLog>,
}

impl DbLogLayer {
    pub fn new(pool: SqlitePool) -> Self {
        let (sender, mut receiver) = mpsc::unbounded_channel::<CreateLog>();
        tokio::spawn(async move {
            while let Some(entry) = receiver.recv().await {
                let log_id = generate_id("LG");
                let timestamp = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();

                sqlx::query(
                    "INSERT INTO logs (id, webhook_id, level, message, target, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
                )
                .bind(log_id)
                .bind(&entry.webhook_id)
                .bind(&entry.level)
                .bind(&entry.message)
                .bind(&entry.target)
                .bind(&timestamp)
                .execute(&pool)
                .await.unwrap();
            }
        });

        Self { sender }
    }
}

impl<S: Subscriber + for<'a> LookupSpan<'a>> Layer<S> for DbLogLayer {
    fn on_event(&self, event: &Event<'_>, ctx: Context<'_, S>) {
        // Walk up the span scope to find a webhook_id recorded field
        let webhook_id = ctx.lookup_current().and_then(|span| {
            let scope = span.scope();
            for s in scope {
                let exts = s.extensions();
                if let Some(fields) = exts.get::<RecordedFields>()
                    && let Some(id) = fields.0.get("webhook_id")
                {
                    return Some(id.clone());
                }
            }
            None
        });

        let Some(webhook_id) = webhook_id else {
            return; // Not inside a dispatch_service span, skip
        };

        let level = event.metadata().level().to_string().to_lowercase();
        let target = event.metadata().target().to_owned();

        let mut visitor = LogVisitor::new();
        event.record(&mut visitor);

        let message = if visitor.message.is_empty() {
            visitor
                .fields
                .iter()
                .map(|(k, v)| format!("{k}={v}"))
                .collect::<Vec<_>>()
                .join(" ")
        } else {
            visitor.message
        };

        let _ = self.sender.send(CreateLog {
            webhook_id: Some(webhook_id),
            level,
            message,
            target,
        });
    }

    fn on_record(
        &self,
        id: &tracing::span::Id,
        values: &tracing::span::Record<'_>,
        ctx: Context<'_, S>,
    ) {
        let Some(span) = ctx.span(id) else { return };
        let mut exts = span.extensions_mut();
        let fields = exts.get_mut::<RecordedFields>();

        let mut visitor = LogVisitor::new();
        values.record(&mut visitor);

        if let Some(fields) = fields {
            fields.0.extend(visitor.fields);
        } else {
            exts.insert(RecordedFields(visitor.fields));
        }
    }

    fn on_new_span(
        &self,
        attrs: &tracing::span::Attributes<'_>,
        id: &tracing::span::Id,
        ctx: Context<'_, S>,
    ) {
        let Some(span) = ctx.span(id) else { return };
        let mut exts = span.extensions_mut();

        let mut visitor = LogVisitor::new();
        attrs.record(&mut visitor);

        exts.insert(RecordedFields(visitor.fields));
    }
}

// Stores recorded span fields in span extensions
struct RecordedFields(HashMap<String, String>);
