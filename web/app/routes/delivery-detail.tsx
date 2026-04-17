import { getDelivery } from "@/lib/api";
import type { Delivery } from "@/lib/types";
import { DeliveryDetailPage } from "@/components/pages/delivery-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export async function clientLoader({
	params,
}: { params: { id: string } }) {
	const delivery = await getDelivery(Number(params.id));
	return { delivery };
}

export function HydrateFallback() {
	return (
		<div className="p-8 space-y-6">
			<div className="flex items-center gap-4">
				<Skeleton className="h-10 w-10" />
				<div>
					<Skeleton className="h-9 w-44" />
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
							{["ev-name", "status", "duration", "timestamp"].map((id) => (
								<div key={id}>
									<Skeleton className="h-4 w-24 mb-1" />
									<Skeleton className="h-5 w-32" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<Skeleton className="h-5 w-32" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-20 w-full" />
					</CardContent>
				</Card>
				<Separator />
				<div>
					<Skeleton className="h-5 w-28 mb-3" />
					<Card>
						<CardContent className="flex items-center gap-3 pt-4">
							<Skeleton className="h-6 w-16" />
							<div>
								<Skeleton className="h-5 w-20" />
								<Skeleton className="h-4 w-14 mt-1" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default function DeliveryDetail({
	loaderData,
}: {
	loaderData: { delivery: Delivery };
}) {
	return <DeliveryDetailPage delivery={loaderData.delivery} />;
}
