export interface Log {
  id: number;
  webhook_id: string | undefined;
  level: string;
  timestamp: string;
  message: string;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  status: string;
  created_at: string;
}

export interface CreateWebhook {
  name: string;
  url: string;
}

export interface EventType {
  id: string;
  webhook_id: string;
  name: string;
}

export interface UpdateWebhook {
  name?: string;
  url?: string;
  status?: string;
}

export interface Delivery {
  id: string;
  event_id: string;
  webhook_id: string;
  status_code: number;
  success: boolean;
  duration_ms: number;
  timestamp: string;
}

export interface CreateDelivery {
  event_id: string;
  webhook_id: string;
  status_code: number;
  success: boolean;
  duration_ms: number;
}

export interface Event {
  attempts: number;
  duration_ms: number;
  event_type_id: string;
  id: string;
  status: string;
  timestamp: string;
  webhook_id: string;
}

export interface CreateEvent {
  webhook_id: string;
  event_type_id: string;
  status?: string;
  duration_ms: number;
  attempts?: number;
}

export interface Settings {
  id: string;
  event_type_id: string;
  retry_attempts: number;
  timeout_seconds: number;
  enabled: boolean;
}

export interface HealthResponse {
  status: string;
  database: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
