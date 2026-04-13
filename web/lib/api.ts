import type {
  Log,
  Webhook,
  UpdateWebhook,
  CreateDelivery,
  CreateEvent,
  Settings,
  Delivery,
  CreateWebhook,
  PaginationParams,
  HealthResponse,
  Event,
} from "./types";

const BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

// ── Error ────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ── Internals ────────────────────────────────────────────────────────

function buildQuery(params?: PaginationParams): string {
  if (!params) return "";
  const q = new URLSearchParams();
  if (params.page != null) q.set("page", String(params.page));
  if (params.limit != null) q.set("limit", String(params.limit));
  const s = q.toString();
  return s ? `?${s}` : "";
}

async function request<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}: ${res.statusText}`, res.status);
  }

  const contentType = res.headers.get("content-type");
  if (res.status === 204 || !contentType?.includes("application/json")) {
    return undefined as T;
  }

  return res.json();
}

function get<T>(endpoint: string) {
  return request<T>(endpoint);
}

function post<T>(endpoint: string, body: unknown) {
  return request<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function put<T>(endpoint: string, body: unknown) {
  return request<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

function del<T = void>(endpoint: string) {
  return request<T>(endpoint, { method: "DELETE" });
}

// ── Public API ───────────────────────────────────────────────────────

export const getHealth = () => get<HealthResponse>("/health");

// Webhooks
export const getWebhooks = (params?: PaginationParams) =>
  get<Webhook[]>(`/webhooks${buildQuery(params)}`);
export const getWebhook = (id: number) => get<Webhook>(`/webhooks/${id}`);
export const createWebhook = (data: CreateWebhook) =>
  post<Webhook>("/webhooks", data);
export const updateWebhook = (id: number, data: UpdateWebhook) =>
  put<Webhook>(`/webhooks/${id}`, data);
export const deleteWebhook = (id: number) => del(`/webhooks/${id}`);

// Deliveries
export const getDeliveries = (params?: PaginationParams) =>
  get<Delivery[]>(`/deliveries${buildQuery(params)}`);
export const getDelivery = (id: number) =>
  get<Delivery>(`/deliveries/${id}`);
export const createDelivery = (data: CreateDelivery) =>
  post<Delivery>("/deliveries", data);

// Events
export const getEvents = (params?: PaginationParams) =>
  get<Event[]>(`/events${buildQuery(params)}`);
export const getEvent = (id: number) => get<Event>(`/events/${id}`);
export const createEvent = (data: CreateEvent) =>
  post<Event>("/events", data);
export const getEventTypes = () => get<string[]>("/event-types");

// Logs
export const getLogs = (params?: PaginationParams) =>
  get<Log[]>(`/logs${buildQuery(params)}`);
export const createLog = (data: { level: string; message: string }) =>
  post<void>("/logs", data);

// Settings
export const getSettings = () => get<Settings>("/settings");
export const updateSettings = (data: Settings) =>
  put<Settings>("/settings", data);
