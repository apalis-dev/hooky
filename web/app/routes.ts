import {
	type RouteConfig,
	layout,
	route,
	index,
} from "@react-router/dev/routes";

export default [
	layout("routes/dashboard-layout.tsx", [
		index("routes/overview.tsx"),
		route("webhooks", "routes/webhooks.tsx"),
		route("webhooks/new", "routes/create-webhook.tsx"),
		route("webhooks/:id/edit", "routes/edit-webhook.tsx"),
		route("webhooks/:id", "routes/webhook-detail.tsx"),
		route("webhooks/:webhookId/settings/:eventTypeId", "routes/event-settings.tsx"),
		route("deliveries", "routes/deliveries.tsx"),
		route("deliveries/:id", "routes/delivery-detail.tsx"),
		route("events/:id", "routes/event-detail.tsx"),
		route("logs", "routes/logs.tsx"),
		route("settings", "routes/settings.tsx"),
	]),
] satisfies RouteConfig;
