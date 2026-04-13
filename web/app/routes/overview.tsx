import { getWebhooks, getDeliveries, getEvents } from "@/lib/api";
import type { Webhook, Delivery, Event } from "@/lib/types";
import { OverviewPage } from "@/components/pages/overview";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
				<Skeleton className="h-9 w-32 mb-2" />
				<Skeleton className="h-5 w-80" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{["stat-1", "stat-2", "stat-3", "stat-4"].map((id) => (
					<Card key={id}>
						<CardHeader className="pb-2">
							<Skeleton className="h-4 w-28" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-20 mb-2" />
							<Skeleton className="h-4 w-32" />
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-7 w-10 mt-1" />
					</CardHeader>
					<CardContent className="space-y-3">
						<Skeleton className="h-1.5 w-full rounded-full" />
						{["healthy", "inactive", "failing"].map((id) => (
							<div key={id} className="flex items-center justify-between">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-6" />
							</div>
						))}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<Skeleton className="h-4 w-24" />
					</CardHeader>
					<CardContent className="space-y-4">
						{["p50", "p95", "p99"].map((id) => (
							<div key={id} className="space-y-1">
								<div className="flex items-center justify-between">
									<Skeleton className="h-4 w-10" />
									<Skeleton className="h-4 w-14" />
								</div>
								<Skeleton className="h-1 w-full rounded-full" />
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-32" />
				</CardHeader>
				<CardContent className="space-y-3">
					{["row-1", "row-2", "row-3", "row-4", "row-5"].map((id) => (
						<Skeleton key={id} className="h-10 w-full" />
					))}
				</CardContent>
			</Card>
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
