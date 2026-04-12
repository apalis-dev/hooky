import { Link } from "react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { WebhookTable } from "../webhook-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WebhooksPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	return (
		<div className="p-8 space-y-6">
			<div>
				<h1 className="text-3xl font-semibold text-foreground mb-2">Hooky</h1>
				<p className="text-muted-foreground">current webhooks</p>
			</div>
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search webhooks..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-9"
					/>
				</div>

				<Button asChild>
					<Link to="/webhooks/new">
						<Plus className="h-4 w-4" />
						Create Webhook
					</Link>
				</Button>
			</div>
			<Tabs value={statusFilter} onValueChange={setStatusFilter}>
				<TabsList>
					{["all", "active", "disabled"].map((filter) => (
						<TabsTrigger key={filter} value={filter}>
							{filter.charAt(0).toUpperCase() + filter.slice(1)}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
			<Card className="overflow-hidden">
				<WebhookTable />
			</Card>
		</div>
	);
}
