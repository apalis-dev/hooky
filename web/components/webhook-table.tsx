import { MoreVertical, Edit, Trash2, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const webhooks = [
	{
		id: 1,
		name: "User Events",
		url: "https://api.example.com/webhooks/users",
		status: "active",
		createdAt: "2025-11-15",
	},
	{
		id: 2,
		name: "Payment Notifications",
		url: "https://billing.example.com/events",
		status: "active",
		createdAt: "2025-11-10",
	},
	{
		id: 3,
		name: "Analytics Events",
		url: "https://analytics.example.com/track",
		status: "disabled",
		createdAt: "2025-10-28",
	},
	{
		id: 4,
		name: "Order Updates",
		url: "https://orders.example.com/webhooks",
		status: "active",
		createdAt: "2025-10-20",
	},
];

export function WebhookTable() {
	if (webhooks.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<Webhook
					className="h-10 w-10 text-muted-foreground/40 mb-3"
					strokeWidth={1.5}
				/>
				<h3 className="text-sm font-medium text-foreground">No webhooks</h3>
				<p className="text-sm text-muted-foreground mt-1">
					Create your first webhook endpoint to get started.
				</p>
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow className="border-b">
					<TableHead className="text-xs font-normal text-muted-foreground">
						Name
					</TableHead>
					<TableHead className="text-xs font-normal text-muted-foreground">
						Target
					</TableHead>
					<TableHead className="text-xs font-normal text-muted-foreground">
						Status
					</TableHead>
					<TableHead className="text-xs font-normal text-muted-foreground">
						Created
					</TableHead>
					<TableHead className="text-xs font-normal text-muted-foreground text-right">
						Actions
					</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{webhooks.map((webhook) => (
					<TableRow
						key={webhook.id}
						className="border-b last:border-0 hover:bg-muted/40 transition-colors"
					>
						{/* Name */}
						<TableCell className="py-3">
							<div className="flex flex-col">
								<span className="font-medium">{webhook.name}</span>
							</div>
						</TableCell>

						{/* URL */}
						<TableCell className="py-3 max-w-xs truncate text-muted-foreground">
							{webhook.url}
						</TableCell>

						{/* Status */}
						<TableCell className="py-3">
							<div className="flex items-center gap-2 text-sm">
								<span
									className={
										webhook.status === "active"
											? "h-1.5 w-1.5 rounded-full bg-emerald-500"
											: "h-1.5 w-1.5 rounded-full bg-zinc-400"
									}
								/>
								<span
									className={
										webhook.status === "active"
											? "text-emerald-600"
											: "text-muted-foreground"
									}
								>
									{webhook.status}
								</span>
							</div>
						</TableCell>

						{/* Created */}
						<TableCell className="py-3 text-muted-foreground tabular-nums">
							{webhook.createdAt}
						</TableCell>

						{/* Actions */}
						<TableCell className="py-3 text-right">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-muted-foreground hover:text-foreground"
									>
										<MoreVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent align="end">
									<DropdownMenuItem>
										<Edit className="h-4 w-4" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem className="text-red-600">
										<Trash2 className="h-4 w-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
