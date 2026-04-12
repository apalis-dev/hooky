import { Inbox } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const recentEvents = [
	{
		id: 1,
		event: "user.created",
		status: "success",
		timestamp: "2025-12-08 14:32:00",
		duration: "145ms",
		endpoint: "https://api.example.com/webhooks",
		attempts: 1,
	},
	{
		id: 2,
		event: "order.completed",
		status: "success",
		timestamp: "2025-12-08 14:31:15",
		duration: "234ms",
		endpoint: "https://api.example.com/orders",
		attempts: 1,
	},
	{
		id: 3,
		event: "payment.failed",
		status: "failed",
		timestamp: "2025-12-08 14:28:42",
		duration: "156ms",
		endpoint: "https://payment.example.com/webhook",
		attempts: 3,
	},
	{
		id: 4,
		event: "user.updated",
		status: "success",
		timestamp: "2025-12-08 14:25:00",
		duration: "89ms",
		endpoint: "https://api.example.com/webhooks",
		attempts: 1,
	},
	{
		id: 5,
		event: "invoice.generated",
		status: "success",
		timestamp: "2025-12-08 14:22:30",
		duration: "512ms",
		endpoint: "https://billing.example.com/invoice",
		attempts: 2,
	},
];

export function RecentEventsTable() {
	if (recentEvents.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<Inbox
					className="h-10 w-10 text-muted-foreground/40 mb-3"
					strokeWidth={1.5}
				/>
				<h3 className="text-sm font-medium text-foreground">
					No recent events
				</h3>
				<p className="text-sm text-muted-foreground mt-1">
					Events will appear here as they occur.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-2xl border overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="border-b">
						<TableHead className="text-xs text-muted-foreground font-normal">
							Event
						</TableHead>
						<TableHead className="text-xs text-muted-foreground font-normal">
							Endpoint
						</TableHead>
						<TableHead className="text-xs text-muted-foreground font-normal">
							Attempts
						</TableHead>
						<TableHead className="text-xs text-muted-foreground font-normal">
							Duration
						</TableHead>
						<TableHead className="text-xs text-muted-foreground font-normal text-right">
							Status
						</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{recentEvents.map((event) => (
						<TableRow
							key={event.id}
							className="border-b last:border-0 hover:bg-muted/40 transition-colors"
						>
							{/* Event */}
							<TableCell className="py-3">
								<span className="font-medium">{event.event}</span>
							</TableCell>

							{/* Endpoint */}
							<TableCell className="py-3 max-w-xs truncate text-muted-foreground">
								{event.endpoint}
							</TableCell>

							{/* Attempts */}
							<TableCell className="py-3 text-muted-foreground tabular-nums">
								{event.attempts}
							</TableCell>

							{/* Duration */}
							<TableCell className="py-3 text-muted-foreground tabular-nums">
								{event.duration}
							</TableCell>

							{/* Status */}
							<TableCell className="py-3 text-right">
								<div className="flex items-center justify-end gap-2 text-sm">
									<span
										className={
											event.status === "success"
												? "h-1.5 w-1.5 rounded-full bg-emerald-500"
												: "h-1.5 w-1.5 rounded-full bg-red-500"
										}
									/>
									<span
										className={
											event.status === "success"
												? "text-emerald-600"
												: "text-red-600"
										}
									>
										{event.status}
									</span>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
