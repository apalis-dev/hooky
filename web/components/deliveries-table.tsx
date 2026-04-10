import { Inbox } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const deliveries = [
	{
		id: 1,
		event: "user.created",
		status: 200,
		duration: "145ms",
		timestamp: "2025-12-08 14:32:00",
		success: true,
	},
	{
		id: 2,
		event: "order.completed",
		status: 200,
		duration: "234ms",
		timestamp: "2025-12-08 14:31:15",
		success: true,
	},
	{
		id: 3,
		event: "payment.failed",
		status: 500,
		duration: "156ms",
		timestamp: "2025-12-08 14:28:42",
		success: false,
	},
	{
		id: 4,
		event: "user.updated",
		status: 200,
		duration: "89ms",
		timestamp: "2025-12-08 14:25:00",
		success: true,
	},
	{
		id: 5,
		event: "invoice.generated",
		status: 202,
		duration: "512ms",
		timestamp: "2025-12-08 14:22:30",
		success: true,
	},
];

interface DeliveriesTableProps {
	onRowClick: (delivery: any) => void;
}

export function DeliveriesTable({ onRowClick }: DeliveriesTableProps) {
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
		<div className="rounded-2xl border overflow-hidden">
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
								onClick={() => onRowClick(delivery)}
								className="cursor-pointer border-b last:border-0 hover:bg-muted/40 transition-colors"
							>
								{/* Event */}
								<TableCell className="py-3">
									<span className="font-medium font-mono text-sm">
										{delivery.event}
									</span>
								</TableCell>

								{/* HTTP Status */}
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

								{/* Duration */}
								<TableCell className="py-3 tabular-nums text-muted-foreground">
									{delivery.duration}
								</TableCell>

								{/* Time */}
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
