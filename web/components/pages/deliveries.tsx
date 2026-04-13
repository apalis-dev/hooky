import type { Delivery } from "@/lib/types";
import { DeliveriesTable } from "../deliveries-table";
import { Card } from "@/components/ui/card";

interface DeliveriesPageProps {
	deliveries: Delivery[];
}

export function DeliveriesPage({ deliveries }: DeliveriesPageProps) {
	return (
		<div className="p-8 space-y-6">
			<div>
				<h1 className="text-3xl font-semibold text-foreground mb-2">
					Deliveries
				</h1>
				<p className="text-muted-foreground">
					View webhook delivery history and attempts
				</p>
			</div>

			<Card className="overflow-hidden">
				<DeliveriesTable deliveries={deliveries} />
			</Card>
		</div>
	);
}
