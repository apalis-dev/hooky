import { Badge } from "@/components/ui/badge";
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
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Event</TableHead>
					<TableHead>HTTP Status</TableHead>
					<TableHead>Duration</TableHead>
					<TableHead>Timestamp</TableHead>
					<TableHead className="text-right">Result</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{deliveries.map((delivery) => (
					<TableRow
						key={delivery.id}
						onClick={() => onRowClick(delivery)}
						className="cursor-pointer"
					>
						<TableCell className="font-medium">{delivery.event}</TableCell>
						<TableCell>
							<Badge variant="outline" className="font-mono">
								{delivery.status}
							</Badge>
						</TableCell>
						<TableCell className="text-muted-foreground">
							{delivery.duration}
						</TableCell>
						<TableCell className="text-muted-foreground">
							{delivery.timestamp}
						</TableCell>
						<TableCell className="text-right">
							<Badge
								variant={delivery.success ? "secondary" : "destructive"}
								className={
									delivery.success
										? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
										: ""
								}
							>
								{delivery.success ? "✓ Success" : "✗ Failed"}
							</Badge>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
