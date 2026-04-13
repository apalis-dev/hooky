import { getWebhooks, getDeliveries, getEvents } from "@/lib/api";
import type { Webhook, Delivery, Event } from "@/lib/types";
import { OverviewPage } from "@/components/pages/overview";

export async function clientLoader() {
	const [webhooks, deliveries, events] = await Promise.all([
		getWebhooks({ limit: 200 }),
		getDeliveries({ limit: 200 }),
		getEvents({ limit: 10 }),
	]);

	return { webhooks, deliveries, events };
}

export function HydrateFallback() {
	return (
		<div className="p-8 space-y-8">
			<div>
				<div className="h-9 w-32 bg-muted animate-pulse rounded" />
				<div className="h-5 w-64 bg-muted animate-pulse rounded mt-2" />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{["stat-1", "stat-2", "stat-3", "stat-4"].map((id) => (
					<div
						key={id}
						className="h-32 bg-muted animate-pulse rounded-xl"
					/>
				))}
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="h-48 bg-muted animate-pulse rounded-xl" />
				<div className="h-48 bg-muted animate-pulse rounded-xl" />
			</div>
			<div className="h-64 bg-muted animate-pulse rounded-xl" />
		</div>
	);
}

export default function Overview({
	loaderData,
}: {
	loaderData: {
		webhooks: Webhook[];
		deliveries: Delivery[];
		events: Event[];
	};
}) {
	return (
		<OverviewPage
			webhooks={loaderData.webhooks}
			deliveries={loaderData.deliveries}
			events={loaderData.events}
		/>
	);
}
