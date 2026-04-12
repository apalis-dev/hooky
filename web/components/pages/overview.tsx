import {
	CheckCircle,
	TrendingUp,
	Zap,
	Radio,
	Activity,
	Gauge,
} from "lucide-react";
import { StatCard } from "../stat-card";
import { RecentEventsTable } from "../recent-events-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
					icon={CheckCircle}
					iconColor="#22c55e"
				/>
				<StatCard
					title="Success Rate"
					value="99.8%"
					change="+0.2%"
					trend="up"
					icon={TrendingUp}
					iconColor="#3b82f6"
				/>
				<StatCard
					title="Avg Delivery Time"
					value="245ms"
					change="-12ms"
					trend="down"
					icon={Zap}
					iconColor="#ffd230"
				/>
				<StatCard
					title="24h Deliveries"
					value="1.2K"
					change="+234"
					trend="up"
					icon={Radio}
					iconColor="#f43f5e"
				/>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Card className="rounded-2xl border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/40">
					<CardHeader className="pb-2">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Activity className="h-4 w-4" />
							<span>Endpoint Status</span>
						</div>
						<div className="text-2xl font-semibold tracking-tight tabular-nums">
							22
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
							<div className="bg-emerald-500/80" style={{ width: "91%" }} />
							<div className="bg-zinc-400/60" style={{ width: "9%" }} />
							<div className="bg-red-500/80" style={{ width: "0%" }} />
						</div>

						<div className="space-y-2 text-sm">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-muted-foreground">
									<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
									<span>Healthy</span>
								</div>
								<span className="font-medium tabular-nums">20</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-muted-foreground">
									<span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
									<span>Degraded</span>
								</div>
								<span className="font-medium tabular-nums">2</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-muted-foreground">
									<span className="h-1.5 w-1.5 rounded-full bg-red-500" />
									<span>Failing</span>
								</div>
								<span className="font-medium tabular-nums">0</span>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="rounded-2xl border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/40">
					<CardHeader className="pb-2">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Gauge className="h-4 w-4" /> <span>Performance</span>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-1">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">P50</span>{" "}
								<span className="text-sm font-medium tabular-nums">145ms</span>
							</div>
							<div className="h-1 w-full rounded-full bg-muted overflow-hidden">
								<div
									className="h-full bg-foreground/70"
									style={{ width: "48%" }}
								/>
							</div>
						</div>

						<div className="space-y-1">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">P95</span>
								<span className="text-sm font-medium tabular-nums">512ms</span>
							</div>
							<div className="h-1 w-full rounded-full bg-muted overflow-hidden">
								<div
									className="h-full bg-foreground/70"
									style={{ width: "85%" }}
								/>
							</div>
						</div>

						<div className="space-y-1">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">P99</span>
								<span className="text-sm font-medium tabular-nums">1.2s</span>
							</div>
							<div className="h-1 w-full rounded-full bg-muted overflow-hidden">
								<div
									className="h-full bg-foreground/70"
									style={{ width: "100%" }}
								/>
							</div>
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
