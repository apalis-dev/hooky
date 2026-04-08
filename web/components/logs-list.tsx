import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const logs = [
	{
		id: 1,
		level: "info",
		timestamp: "2025-12-08 14:35:22",
		message: "Webhook delivered successfully to user.created endpoint",
	},
	{
		id: 2,
		level: "info",
		timestamp: "2025-12-08 14:32:15",
		message: "New webhook endpoint registered: Payment Notifications",
	},
	{
		id: 3,
		level: "warn",
		timestamp: "2025-12-08 14:28:42",
		message: "Webhook delivery timeout - retrying in 60s",
	},
	{
		id: 4,
		level: "error",
		timestamp: "2025-12-08 14:25:30",
		message: "Failed to deliver webhook after 3 retry attempts",
	},
	{
		id: 5,
		level: "info",
		timestamp: "2025-12-08 14:20:10",
		message: "Webhook endpoint disabled due to repeated failures",
	},
];

const levelVariant = {
	info: "secondary" as const,
	warn: "outline" as const,
	error: "destructive" as const,
};

const levelColors = {
	info: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
	warn: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
	error: "",
};

const dotColors = {
	info: "bg-blue-500",
	warn: "bg-yellow-500",
	error: "bg-red-500",
};

interface LogsListProps {
	logLevel: string;
}

export function LogsList({ logLevel }: LogsListProps) {
	const filteredLogs =
		logLevel === "all" ? logs : logs.filter((log) => log.level === logLevel);

	return (
		<Card>
			<ScrollArea className="h-[600px]">
				<div className="divide-y divide-border">
					{filteredLogs.map((log) => (
						<div
							key={log.id}
							className="p-4 hover:bg-muted/50 transition-colors"
						>
							<div className="flex items-start gap-3">
								<div
									className={`mt-2 h-2 w-2 shrink-0 rounded-full ${dotColors[log.level as keyof typeof dotColors]}`}
								/>
								<div className="min-w-0 flex-1">
									<p className="text-sm text-foreground">{log.message}</p>
									<p className="mt-1 text-xs text-muted-foreground">
										{log.timestamp}
									</p>
								</div>
								<Badge
									variant={
										levelVariant[log.level as keyof typeof levelVariant]
									}
									className={
										levelColors[log.level as keyof typeof levelColors]
									}
								>
									{log.level.toUpperCase()}
								</Badge>
							</div>
						</div>
					))}
				</div>
			</ScrollArea>
		</Card>
	);
}
