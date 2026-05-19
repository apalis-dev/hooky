import { z } from "zod";
import { getEventTypes, getSettings, updateSettings } from "@/lib/api";
import type { Settings, EventType } from "@/lib/types";
import { SettingsPage } from "@/components/pages/settings";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface SettingsFormValues {
	retry_attempts: number;
	timeout_seconds: number;
	enabled: boolean;
	persisted: boolean;
}

const settingsFormSchema = z.object({
	eventTypeId: z.string().min(1, "Event type is required."),
	retry_attempts: z.coerce.number().int().min(0).max(10),
	timeout_seconds: z.coerce.number().int().min(1).max(300),
	enabled: z.boolean(),
});

function defaultSettings(): SettingsFormValues {
	return {
		retry_attempts: 3,
		timeout_seconds: 30,
		enabled: true,
		persisted: false,
	};
}

function toSettingsFormValues(settings: Settings): SettingsFormValues {
	return {
		retry_attempts: settings.retry_attempts,
		timeout_seconds: settings.timeout_seconds,
		enabled: settings.enabled,
		persisted: true,
	};
}

export async function clientLoader() {
	const eventTypes = await getEventTypes();
	const settingsByEventTypeId: Record<string, SettingsFormValues> = {};

	await Promise.all(
		eventTypes.map(async (eventType) => {
			try {
				const settings = await getSettings(eventType.id);
				settingsByEventTypeId[eventType.id] = toSettingsFormValues(settings);
			} catch {
				settingsByEventTypeId[eventType.id] = defaultSettings();
			}
		}),
	);

	return { eventTypes, settingsByEventTypeId };
}

export function HydrateFallback() {
	return (
		<div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
			<div>
				<Skeleton className="h-8 w-24" />
				<Skeleton className="h-4 w-72 mt-1" />
			</div>
			<Card>
				<CardHeader className="pb-3">
					<Skeleton className="h-5 w-40" />
					<Skeleton className="h-3 w-52 mt-1" />
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="space-y-1.5">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-full" />
						</div>
					</div>
					<div className="flex justify-end">
						<Skeleton className="h-9 w-16" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export async function clientAction({ request }: { request: Request }) {
	const formData = await request.formData();
	const result = settingsFormSchema.safeParse({
		eventTypeId: formData.get("eventTypeId"),
		retry_attempts: formData.get("retry_attempts"),
		timeout_seconds: formData.get("timeout_seconds"),
		enabled: formData.getAll("enabled").includes("true"),
	});

	if (!result.success) {
		return { ok: false, error: result.error.issues[0]?.message };
	}

	const { eventTypeId, ...settings } = result.data;
	const updated = await updateSettings(eventTypeId, settings);
	return { settings: updated };
}

export default function SettingsRoute({
	loaderData,
}: {
	loaderData: {
		eventTypes: EventType[];
		settingsByEventTypeId: Record<string, SettingsFormValues>;
	};
}) {
	return <SettingsPage 
		eventTypes={loaderData.eventTypes} 
		settingsByEventTypeId={loaderData.settingsByEventTypeId}
	/>;
}
