import { CheckCircle, Zap } from "lucide-react";
import { StatCard } from "../stat-card";
import { RecentEventsTable } from "../recent-events-table";
import { Progress } from "@/components/ui/progress";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function OverviewPage() {
	return (
		<div className="p-8 space-y-8">
			<div>
				<h1 className="text-3xl font-semibold text-foreground mb-2">
					Overview
				</h1>
				<p className="text-muted-foreground">
					Monitor your webhook system health at a glance
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					title="Active Endpoints"
					value="22"
					change="+1"
					trend="up"
					icon="✓"
				/>
				<StatCard
					title="Success Rate"
					value="99.8%"
					change="+0.2%"
					trend="up"
					icon="📈"
				/>
				<StatCard
					title="Avg Delivery Time"
					value="245ms"
					change="-12ms"
					trend="down"
					icon="⚡"
				/>
				<StatCard
					title="24h Deliveries"
					value="1.2K"
					change="+234"
					trend="up"
					icon="📡"
				/>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Card>
					<CardHeader>
						<CardTitle>Endpoint Status</CardTitle>
						<CardAction>
							<CheckCircle className="h-5 w-5 text-success" />
						</CardAction>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Healthy</span>
							<span className="text-sm font-semibold text-foreground">20</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Degraded</span>
							<span className="text-sm font-semibold text-warning">2</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Failing</span>
							<span className="text-sm font-semibold text-destructive">0</span>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Performance</CardTitle>
						<CardAction>
							<Zap className="h-5 w-5 text-accent" />
						</CardAction>
					</CardHeader>
					<CardContent className="space-y-3">
						<div>
							<div className="flex items-center justify-between mb-1">
								<span className="text-sm text-muted-foreground">
									P50 Latency
								</span>
								<span className="text-sm font-semibold text-foreground">
									145ms
								</span>
							</div>
							<Progress value={48} />
						</div>
						<div>
							<div className="flex items-center justify-between mb-1">
								<span className="text-sm text-muted-foreground">
									P95 Latency
								</span>
								<span className="text-sm font-semibold text-foreground">
									512ms
								</span>
							</div>
							<Progress value={85} />
						</div>
						<div>
							<div className="flex items-center justify-between mb-1">
								<span className="text-sm text-muted-foreground">
									P99 Latency
								</span>
								<span className="text-sm font-semibold text-foreground">
									1.2s
								</span>
							</div>
							<Progress value={100} />
						</div>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Recent Events</CardTitle>
				</CardHeader>
				<CardContent>
					<RecentEventsTable />
				</CardContent>
			</Card>
		</div>
	);
}
