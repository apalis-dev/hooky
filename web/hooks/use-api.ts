import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { apiClient } from "../lib/api";
import type {
  Log,
  Webhook,
  CreateWebhook,
  UpdateWebhook,
  Delivery,
  CreateDelivery,
  Event,
  CreateEvent,
  Settings,
  HealthResponse,
  PaginationParams,
  ApiError,
} from "../lib/api";

export const queryKeys = {
  health: ["health"] as const,
  logs: (params?: PaginationParams) => ["logs", params] as const,
  webhooks: (params?: PaginationParams) => ["webhooks", params] as const,
  webhook: (id: number) => ["webhooks", id] as const,
  deliveries: (params?: PaginationParams) => ["deliveries", params] as const,
  delivery: (id: number) => ["deliveries", id] as const,
  events: (params?: PaginationParams) => ["events", params] as const,
  event: (id: number) => ["events", id] as const,
  eventTypes: ["event-types"] as const,
  settings: ["settings"] as const,
};

export const useHealth = (
  options?: UseQueryOptions<HealthResponse, ApiError>
) => {
  return useQuery<HealthResponse, ApiError>({
    queryKey: queryKeys.health,
    queryFn: () => apiClient.getHealth(),
    ...options,
  });
};

export const useLogs = (
  params?: PaginationParams,
  options?: UseQueryOptions<Log[], ApiError>
) => {
  return useQuery<Log[], ApiError>({
    queryKey: queryKeys.logs(params),
    queryFn: () => apiClient.getLogs(params),
    ...options,
  });
};

export const useCreateLog = (
  options?: UseMutationOptions<
    void,
    ApiError,
    { level: string; message: string }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, { level: string; message: string }>({
    mutationFn: (data) => apiClient.createLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
    ...options,
  });
};

export const useWebhooks = (
  params?: PaginationParams,
  options?: UseQueryOptions<Webhook[], ApiError>
) => {
  return useQuery<Webhook[], ApiError>({
    queryKey: queryKeys.webhooks(params),
    queryFn: () => apiClient.getWebhooks(params),
    ...options,
  });
};

export const useWebhook = (
  id: number,
  options?: UseQueryOptions<Webhook, ApiError>
) => {
  return useQuery<Webhook, ApiError>({
    queryKey: queryKeys.webhook(id),
    queryFn: () => apiClient.getWebhook(id),
    ...options,
  });
};

export const useCreateWebhook = (
  options?: UseMutationOptions<Webhook, ApiError, CreateWebhook>
) => {
  const queryClient = useQueryClient();

  return useMutation<Webhook, ApiError, CreateWebhook>({
    mutationFn: (data) => apiClient.createWebhook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
    ...options,
  });
};

export const useUpdateWebhook = (
  options?: UseMutationOptions<
    Webhook,
    ApiError,
    { id: number; data: UpdateWebhook }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<Webhook, ApiError, { id: number; data: UpdateWebhook }>({
    mutationFn: ({ id, data }) => apiClient.updateWebhook(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.webhook(variables.id),
      });
    },
    ...options,
  });
};

export const useDeleteWebhook = (
  options?: UseMutationOptions<void, ApiError, number>
) => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: (id) => apiClient.deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
    ...options,
  });
};

export const useDeliveries = (
  params?: PaginationParams,
  options?: UseQueryOptions<Delivery[], ApiError>
) => {
  return useQuery<Delivery[], ApiError>({
    queryKey: queryKeys.deliveries(params),
    queryFn: () => apiClient.getDeliveries(params),
    ...options,
  });
};

export const useDelivery = (
  id: number,
  options?: UseQueryOptions<Delivery, ApiError>
) => {
  return useQuery<Delivery, ApiError>({
    queryKey: queryKeys.delivery(id),
    queryFn: () => apiClient.getDelivery(id),
    ...options,
  });
};

export const useCreateDelivery = (
  options?: UseMutationOptions<Delivery, ApiError, CreateDelivery>
) => {
  const queryClient = useQueryClient();

  return useMutation<Delivery, ApiError, CreateDelivery>({
    mutationFn: (data) => apiClient.createDelivery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
    ...options,
  });
};

export const useEvents = (
  params?: PaginationParams,
  options?: UseQueryOptions<Event[], ApiError>
) => {
  return useQuery<Event[], ApiError>({
    queryKey: queryKeys.events(params),
    queryFn: () => apiClient.getEvents(params),
    ...options,
  });
};

export const useEvent = (
  id: number,
  options?: UseQueryOptions<Event, ApiError>
) => {
  return useQuery<Event, ApiError>({
    queryKey: queryKeys.event(id),
    queryFn: () => apiClient.getEvent(id),
    ...options,
  });
};

export const useCreateEvent = (
  options?: UseMutationOptions<Event, ApiError, CreateEvent>
) => {
  const queryClient = useQueryClient();

  return useMutation<Event, ApiError, CreateEvent>({
    mutationFn: (data) => apiClient.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    ...options,
  });
};

export const useEventTypes = (
  options?: UseQueryOptions<string[], ApiError>
) => {
  return useQuery<string[], ApiError>({
    queryKey: queryKeys.eventTypes,
    queryFn: () => apiClient.getEventTypes(),
    ...options,
  });
};

export const useSettings = (options?: UseQueryOptions<Settings, ApiError>) => {
  return useQuery<Settings, ApiError>({
    queryKey: queryKeys.settings,
    queryFn: () => apiClient.getSettings(),
    ...options,
  });
};

export const useUpdateSettings = (
  options?: UseMutationOptions<Settings, ApiError, Settings>
) => {
  const queryClient = useQueryClient();

  return useMutation<Settings, ApiError, Settings>({
    mutationFn: (data) => apiClient.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
    ...options,
  });
};
