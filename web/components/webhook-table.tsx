import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Target URL</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Created At</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{webhooks.map((webhook) => (
					<TableRow key={webhook.id}>
						<TableCell className="font-medium">{webhook.name}</TableCell>
						<TableCell className="max-w-xs truncate text-muted-foreground">
							{webhook.url}
						</TableCell>
						<TableCell>
							<Badge
								variant={
									webhook.status === "active" ? "secondary" : "outline"
								}
								className={
									webhook.status === "active"
										? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
										: ""
								}
							>
								{webhook.status === "active" ? "● " : "○ "}
								{webhook.status.charAt(0).toUpperCase() +
									webhook.status.slice(1)}
							</Badge>
						</TableCell>
						<TableCell className="text-muted-foreground">
							{webhook.createdAt}
						</TableCell>
						<TableCell className="text-right">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="h-8 w-8">
										<MoreVertical className="h-4 w-4" />
										<span className="sr-only">Open menu</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem>
										<Edit className="h-4 w-4" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem variant="destructive">
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
