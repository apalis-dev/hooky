import { getEvent, getWebhookEvents } from "@/lib/api";
import type { Event } from "@/lib/types";
import { EventDetailPage } from "@/components/pages/event-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export async function clientLoader({ params }: { params: { id: string } }) {
	const event = await getEvent(params.id);
	return { event };
}

export function HydrateFallback() {
	return (
		<div className="p-8 space-y-6">
			<div className="flex items-start gap-4">
				<Skeleton className="h-10 w-10" />
				<div>
					<Skeleton className="h-9 w-48" />
					<Skeleton className="h-5 w-32 mt-1" />
				</div>
			</div>
			<div className="max-w-2xl space-y-6">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-36" />
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							{[1, 2, 3, 4].map((i) => (
								<div key={i}>
									<Skeleton className="h-4 w-24 mb-1" />
									<Skeleton className="h-5 w-32" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default function EventDetail({
	loaderData,
}: {
	loaderData: { event: Event };
}) {
	return <EventDetailPage event={loaderData.event} />;
}