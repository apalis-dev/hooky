import {
	Edit,
	MoreHorizontal,
	Trash2,
	Webhook as WebhookIcon,
} from "lucide-react";
import { useFetcher } from "react-router";
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
import type { Webhook } from "@/lib/types";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

interface WebhookTableProps {
	webhooks: Webhook[];
}

export function WebhookTable({ webhooks }: WebhookTableProps) {
	if (webhooks.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<WebhookIcon
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
					<WebhookRow key={webhook.id} webhook={webhook} />
				))}
			</TableBody>
		</Table>
	);
}

function WebhookRow({ webhook }: { webhook: Webhook }) {
	const fetcher = useFetcher();
	const isDeleting = fetcher.state !== "idle";

	return (
		<TableRow
			className={`border-b last:border-0 hover:bg-muted/40 transition-colors ${isDeleting ? "opacity-50" : ""}`}
		>
			<TableCell className="py-3">
				<div className="flex flex-col">
					<span className="font-medium">{webhook.name}</span>
				</div>
			</TableCell>

			<TableCell className="py-3 max-w-xs truncate text-muted-foreground">
				{webhook.url}
			</TableCell>

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

			<TableCell className="py-3 text-muted-foreground tabular-nums">
				{webhook.created_at}
			</TableCell>

			<TableCell className="py-3 text-right">
				<DropdownMenu>
					<DropdownMenuTrigger
						className={cn(
							buttonVariants({ variant: "ghost", size: "icon" }),
							"h-8 w-8 text-muted-foreground hover:text-foreground",
						)}
					>
						<MoreHorizontal className="h-4 w-4" />
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<Edit className="h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-red-600"
							onClick={() =>
								fetcher.submit(
									{ webhookId: String(webhook.id) },
									{ method: "DELETE", action: "/webhooks" },
								)
							}
						>
							<Trash2 className="h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}
