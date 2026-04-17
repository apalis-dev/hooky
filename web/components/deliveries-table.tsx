import { useNavigate } from "react-router";
import { Inbox } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Delivery } from "@/lib/types";

interface DeliveriesTableProps {
	deliveries: Delivery[];
}

export function DeliveriesTable({ deliveries }: DeliveriesTableProps) {
	const navigate = useNavigate();

	if (deliveries.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<Inbox
					className="h-10 w-10 text-muted-foreground/40 mb-3"
					strokeWidth={1.5}
				/>
				<h3 className="text-sm font-medium text-foreground">No deliveries</h3>
				<p className="text-sm text-muted-foreground mt-1">
					Deliveries will appear here once webhooks start firing.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="border-b">
						<TableHead className="text-xs font-normal text-muted-foreground">
							Event
						</TableHead>
						<TableHead className="text-xs font-normal text-muted-foreground">
							Status
						</TableHead>
						<TableHead className="text-xs font-normal text-muted-foreground">
							Duration
						</TableHead>
						<TableHead className="text-xs font-normal text-muted-foreground">
							Time
						</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{deliveries.map((delivery) => {
						const isError = delivery.status >= 400;

						return (
							<TableRow
								key={delivery.id}
								onClick={() => navigate(`/deliveries/${delivery.id}`)}
								className="cursor-pointer border-b last:border-0 hover:bg-muted/40 transition-colors"
							>
								<TableCell className="py-3">
									<span className="font-medium font-mono text-sm">
										{delivery.event}
									</span>
								</TableCell>

								<TableCell className="py-3">
									<span
										className={
											isError
												? "text-red-600 tabular-nums"
												: "text-muted-foreground tabular-nums"
										}
									>
										{delivery.status}
									</span>
								</TableCell>

								<TableCell className="py-3 tabular-nums text-muted-foreground">
									{delivery.duration}
								</TableCell>

								<TableCell className="py-3 text-muted-foreground">
									{delivery.timestamp}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
