import { getDeliveries } from "@/lib/api";
import type { Delivery } from "@/lib/types";
import { DeliveriesPage } from "@/components/pages/deliveries";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export async function clientLoader() {
	const deliveries = await getDeliveries();
	return { deliveries };
}

export function HydrateFallback() {
	return (
		<div className="p-8 space-y-6">
			<div>
				<Skeleton className="h-9 w-32 mb-2" />
				<Skeleton className="h-5 w-72" />
			</div>
			<Card className="overflow-hidden">
				<div className="p-4 space-y-3">
					<Skeleton className="h-8 w-full" />
					{["del-1", "del-2", "del-3", "del-4"].map((id) => (
						<Skeleton key={id} className="h-12 w-full" />
					))}
				</div>
			</Card>
		</div>
	);
}

export default function Deliveries({
	loaderData,
}: {
	loaderData: { deliveries: Delivery[] };
}) {
	return <DeliveriesPage deliveries={loaderData.deliveries} />;
}
