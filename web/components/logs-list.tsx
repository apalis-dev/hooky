import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Log } from "@/lib/types";

const levelDot: Record<string, string> = {
	info: "bg-muted-foreground/70",
	warn: "bg-yellow-500/80",
	error: "bg-red-500/80",
};

interface LogsListProps {
	logs: Log[];
}

export function LogsList({ logs }: LogsListProps) {
	if (logs.length === 0) {
		return (
			<Card className="rounded-2xl border w-full">
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<FileText
						className="h-10 w-10 text-muted-foreground/40 mb-3"
						strokeWidth={1.5}
					/>
					<h3 className="text-sm font-medium text-foreground">No logs</h3>
					<p className="text-sm text-muted-foreground mt-1">
						Logs will appear here as activity occurs.
					</p>
				</div>
			</Card>
		);
	}

	return (
		<Card className="rounded-2xl border w-full">
			<ScrollArea className="h-[600px]">
				<Table className="w-full text-sm font-mono">
					<TableHeader className="sr-only" />
					<TableBody>
						{logs.map((log) => (
							<TableRow
								key={log.id}
								className="hover:bg-muted/30 transition-colors"
							>
								<TableCell className="w-[10px] pr-2">
									<span
										className={`inline-block h-2 w-2 rounded-full ${levelDot[log.level] ?? "bg-muted-foreground/70"}`}
									/>
								</TableCell>

								<TableCell className="w-[110px] text-xs text-muted-foreground/70">
									{log.timestamp}
								</TableCell>

								<TableCell className="text-sm text-foreground break-words">
									{log.message}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</ScrollArea>
		</Card>
	);
}
