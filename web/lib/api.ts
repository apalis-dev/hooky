import { Log } from "../lib/types";
import { Webhook } from "../lib/types";
import { UpdateWebhook } from "../lib/types";
import { CreateDelivery } from "../lib/types";
import { CreateEvent } from "../lib/types";
import { Settings } from "../lib/types";
import { Delivery } from "../lib/types";
import { CreateWebhook } from "../lib/types";
import { PaginationParams } from "../lib/types";
import { HealthResponse } from "../lib/types";
import { ApiError } from "../lib/types";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:3000/api/v1") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw {
          message: `HTTP error! status: ${response.status}`,
          status: response.status,
        } as ApiError;
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: "Network error",
        status: 0,
      } as ApiError;
    }
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }

  async getLogs(params?: PaginationParams): Promise<Log[]> {
    const query = new URLSearchParams();
    if (params?.page !== undefined)
      query.append("page", params.page.toString());
    if (params?.limit !== undefined)
      query.append("limit", params.limit.toString());

    const queryString = query.toString();
    return this.request<Log[]>(`/logs${queryString ? `?${queryString}` : ""}`);
  }

  async createLog(data: { level: string; message: string }): Promise<void> {
    await this.request<void>("/logs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getWebhooks(params?: PaginationParams): Promise<Webhook[]> {
    const query = new URLSearchParams();
    if (params?.page !== undefined)
      query.append("page", params.page.toString());
    if (params?.limit !== undefined)
      query.append("limit", params.limit.toString());

    const queryString = query.toString();
    return this.request<Webhook[]>(
      `/webhooks${queryString ? `?${queryString}` : ""}`
    );
  }

  async getWebhook(id: number): Promise<Webhook> {
    return this.request<Webhook>(`/webhooks/${id}`);
  }

  async createWebhook(data: CreateWebhook): Promise<Webhook> {
    return this.request<Webhook>("/webhooks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateWebhook(id: number, data: UpdateWebhook): Promise<Webhook> {
    return this.request<Webhook>(`/webhooks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteWebhook(id: number): Promise<void> {
    await this.request<void>(`/webhooks/${id}`, {
      method: "DELETE",
    });
  }

  async getDeliveries(params?: PaginationParams): Promise<Delivery[]> {
    const query = new URLSearchParams();
    if (params?.page !== undefined)
      query.append("page", params.page.toString());
    if (params?.limit !== undefined)
      query.append("limit", params.limit.toString());

    const queryString = query.toString();
    return this.request<Delivery[]>(
      `/deliveries${queryString ? `?${queryString}` : ""}`
    );
  }

  async getDelivery(id: number): Promise<Delivery> {
    return this.request<Delivery>(`/deliveries/${id}`);
  }

  async createDelivery(data: CreateDelivery): Promise<Delivery> {
    return this.request<Delivery>("/deliveries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getEvents(params?: PaginationParams): Promise<Event[]> {
    const query = new URLSearchParams();
    if (params?.page !== undefined)
      query.append("page", params.page.toString());
    if (params?.limit !== undefined)
      query.append("limit", params.limit.toString());

    const queryString = query.toString();
    return this.request<Event[]>(
      `/events${queryString ? `?${queryString}` : ""}`
    );
  }

  async getEvent(id: number): Promise<Event> {
    return this.request<Event>(`/events/${id}`);
  }

  async createEvent(data: CreateEvent): Promise<Event> {
    return this.request<Event>("/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getEventTypes(): Promise<string[]> {
    return this.request<string[]>("/event-types");
  }

  async getSettings(): Promise<Settings> {
    return this.request<Settings>("/settings");
  }

  async updateSettings(data: Settings): Promise<Settings> {
    return this.request<Settings>("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
export { ApiClient };
