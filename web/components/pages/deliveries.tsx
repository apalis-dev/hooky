import { useState } from "react";
import { DeliveriesTable } from "../deliveries-table";
import { DeliveryDrawer } from "../drawers/delivery-drawer";
import { Card } from "@/components/ui/card";

export function DeliveriesPage() {
	const [selectedDelivery, setSelectedDelivery] = useState<any>(null);

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
				<DeliveriesTable onRowClick={setSelectedDelivery} />
			</Card>

			{selectedDelivery && (
				<DeliveryDrawer
					delivery={selectedDelivery}
					open={!!selectedDelivery}
					onOpenChange={(open) => {
						if (!open) setSelectedDelivery(null);
					}}
				/>
			)}
		</div>
	);
}
