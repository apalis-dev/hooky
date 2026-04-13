
export interface Log {
  id: number;
  level: string;
  timestamp: string;
  message: string;
}

export interface Webhook {
  id: number;
  name: string;
  url: string;
  status: string;
  created_at: string;
}

export interface CreateWebhook {
  name: string;
  url: string;
}

export interface UpdateWebhook {
  name?: string;
  url?: string;
  status?: string;
}

export interface Delivery {
  id: number;
  event: string;
  status: number;
  duration: string;
  timestamp: string;
  success: boolean;
}

export interface CreateDelivery {
  event: string;
  status: number;
  duration: string;
  success: boolean;
}

export interface Event {
  id: number;
  event: string;
  status: string;
  timestamp: string;
  duration: string;
  endpoint: string;
  attempts: number;
}

export interface CreateEvent {
  event: string;
  status: string;
  duration: string;
  endpoint: string;
  attempts: number;
}

export interface Settings {
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
