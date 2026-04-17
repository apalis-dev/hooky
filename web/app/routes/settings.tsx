import { getSettings, updateSettings } from "@/lib/api";
import type { Settings } from "@/lib/types";
import { SettingsPage } from "@/components/pages/settings";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export async function clientLoader() {
	const settings = await getSettings();
	return { settings };
}

export function HydrateFallback() {
	return (
		<div className="p-6 space-y-6 max-w-5xl">
			<div>
				<Skeleton className="h-8 w-24" />
				<Skeleton className="h-4 w-72 mt-1" />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{["secret", "apikey"].map((id) => (
					<Card key={id}>
						<CardHeader className="pb-3">
							<Skeleton className="h-5 w-28" />
							<Skeleton className="h-3 w-48 mt-1" />
						</CardHeader>
						<CardContent className="space-y-3">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-full" />
						</CardContent>
					</Card>
				))}
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
	const settings: Settings = {
		retry_attempts: Number(formData.get("retry_attempts")),
		timeout_seconds: Number(formData.get("timeout_seconds")),
		enabled: formData.get("enabled") === "true",
	};
	const updated = await updateSettings(settings);
	return { settings: updated };
}

export default function SettingsRoute({
	loaderData,
}: {
	loaderData: { settings: Settings };
}) {
	return <SettingsPage settings={loaderData.settings} />;
}
