import { data, redirect, useParams } from "react-router";
import { z } from "zod";
import {
	ApiError,
	getWebhook,
	getWebhookEventTypes,
	getSettings,
	updateSettings,
} from "@/lib/api";
import {
	EventSettingsPage,
	type EventSettingsValues,
} from "@/components/pages/event-settings";
import { RouteErrorBoundary } from "@/components/route-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const settingsSchema = z.object({
	retry_attempts: z.coerce.number().int().min(0).max(10),
	timeout_seconds: z.coerce.number().int().min(1).max(300),
	enabled: z.boolean(),
});

function defaultSettings(eventTypeId: string): EventSettingsValues {
	return {
		event_type_id: eventTypeId,
		retry_attempts: 3,
		timeout_seconds: 30,
		enabled: true,
		persisted: false,
	};
}

async function loadSettings(eventTypeId: string): Promise<EventSettingsValues> {
	try {
		const settings = await getSettings(eventTypeId);
		return {
			event_type_id: settings.event_type_id,
			retry_attempts: settings.retry_attempts,
			timeout_seconds: settings.timeout_seconds,
			enabled: settings.enabled,
			persisted: true,
		};
	} catch (error) {
		if (error instanceof ApiError && error.status === 404) {
			return defaultSettings(eventTypeId);
		}

		throw error;
	}
}

export async function clientLoader({ params }: { params: { webhookId: string; eventTypeId: string } }) {
	const [webhook, eventTypes] = await Promise.all([
		getWebhook(params.webhookId),
		getWebhookEventTypes(params.webhookId),
	]);

	if (!eventTypes.some((eventType) => eventType.id === params.eventTypeId)) {
		throw data("Event type not found.", { status: 404 });
	}

	const settings = await loadSettings(params.eventTypeId);
	return { webhook, settings };
}

export async function clientAction({ request, params }: { request: Request; params: { webhookId: string; eventTypeId: string } }) {
	const formData = await request.formData();
	const result = settingsSchema.safeParse({
		retry_attempts: formData.get("retry_attempts"),
		timeout_seconds: formData.get("timeout_seconds"),
		enabled: formData.getAll("enabled").includes("true"),
	});

	if (!result.success) {
		return { ok: false, error: result.error.issues[0]?.message };
	}

	try {
		await updateSettings(params.eventTypeId, result.data);
	} catch (error) {
		if (error instanceof ApiError && error.status === 404) {
			throw data("Event type not found.", { status: 404 });
		}

		throw error;
	}

	return redirect(`/webhooks/${params.webhookId}`);
}

export function ErrorBoundary() {
	const params = useParams();

	return (
		<RouteErrorBoundary
			backLabel="Back to webhook"
			backTo={params.webhookId ? `/webhooks/${params.webhookId}` : "/webhooks"}
			notFoundMessage="That event type does not exist for this webhook."
			notFoundTitle="Event type not found"
		/>
	);
}

export function HydrateFallback() {
	return (
		<div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
			<div className="flex items-start gap-4">
				<Skeleton className="h-10 w-10" />
				<div className="space-y-1">
					<Skeleton className="h-9 w-48" />
					<Skeleton className="h-5 w-32" />
				</div>
			</div>
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-48" />
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-10 w-full" />
					</div>
					<Skeleton className="h-10 w-24" />
				</CardContent>
			</Card>
		</div>
	);
}

export default function EventSettings({
	loaderData,
}: {
	loaderData: { webhook: { id: string; name: string }; settings: EventSettingsValues };
}) {
	return <EventSettingsPage webhook={loaderData.webhook} settings={loaderData.settings} />;
}
