import {
	CheckCircle,
	TrendingUp,
	Zap,
	Radio,
	Activity,
	Gauge,
} from "lucide-react";
import { parse, format } from "@lukeed/ms";
import { StatCard } from "../stat-card";
import { RecentEventsTable } from "../recent-events-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Webhook, Delivery, Event } from "@/lib/types";

interface OverviewPageProps {
	webhooks: Webhook[];
	deliveries: Delivery[];
	events: Event[];
}

function computeStats(webhooks: Webhook[], deliveries: Delivery[]) {
	const activeCount = webhooks.filter((w) => w.status === "active").length;
	const totalEndpoints = webhooks.length;

	const successCount = deliveries.filter((d) => d.success).length;
	const successRate =
		deliveries.length > 0
			? ((successCount / deliveries.length) * 100).toFixed(1)
			: "0.0";

	const durations = deliveries.map((d) => parse(d.duration) ?? 0);
	const avgLatency =
		durations.length > 0
			? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
			: 0;

	return {
		activeCount,
		totalEndpoints,
		successRate,
		successCount,
		avgLatency,
		totalDeliveries: deliveries.length,
	};
}

export function OverviewPage({
	webhooks,
	deliveries,
	events,
}: OverviewPageProps) {
	const stats = computeStats(webhooks, deliveries);

	// Endpoint status breakdown
	const healthyCount = webhooks.filter((w) => w.status === "active").length;
	const degradedCount = webhooks.filter(
		(w) => w.status === "disabled",
	).length;
	const failingCount = webhooks.filter((w) => w.status === "failed").length;
	const total = webhooks.length || 1;
	const healthyPct = Math.round((healthyCount / total) * 100);
	const degradedPct = Math.round((degradedCount / total) * 100);
	const failingPct = Math.round((failingCount / total) * 100);

	// Percentile latencies
	const sortedDurations = deliveries
		.map((d) => parse(d.duration) ?? 0)
		.sort((a, b) => a - b);
	const percentile = (arr: number[], p: number) =>
		arr.length > 0 ? arr[Math.ceil((p / 100) * arr.length) - 1] : 0;
	const p50 = percentile(sortedDurations, 50);
	const p95 = percentile(sortedDurations, 95);
	const p99 = percentile(sortedDurations, 99);
	const maxLatency = sortedDurations[sortedDurations.length - 1] || 1;

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
					value={String(stats.activeCount)}
					change={`${stats.totalEndpoints} total`}
					trend="up"
					icon={CheckCircle}
					iconColor="#22c55e"
				/>
				<StatCard
					title="Success Rate"
					value={`${stats.successRate}%`}
					change={`${stats.totalDeliveries} deliveries`}
					trend="up"
					icon={TrendingUp}
					iconColor="#3b82f6"
				/>
				<StatCard
					title="Avg Delivery Time"
					value={format(stats.avgLatency)}
					change={`P95: ${format(p95)}`}
					trend="down"
					icon={Zap}
					iconColor="#ffd230"
				/>
				<StatCard
					title="Total Deliveries"
					value={String(stats.totalDeliveries)}
					change={`${stats.successCount} succeeded`}
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
							{webhooks.length}
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
							<div
								className="bg-emerald-500/80"
								style={{ width: `${healthyPct}%` }}
							/>
							<div
								className="bg-zinc-400/60"
								style={{ width: `${degradedPct}%` }}
							/>
							<div
								className="bg-red-500/80"
								style={{ width: `${failingPct}%` }}
							/>
						</div>

						<div className="space-y-2 text-sm">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-muted-foreground">
									<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
									<span>Healthy</span>
								</div>
								<span className="font-medium tabular-nums">{healthyCount}</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-muted-foreground">
									<span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
									<span>Degraded</span>
								</div>
								<span className="font-medium tabular-nums">
									{degradedCount}
								</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-muted-foreground">
									<span className="h-1.5 w-1.5 rounded-full bg-red-500" />
									<span>Failing</span>
								</div>
								<span className="font-medium tabular-nums">{failingCount}</span>
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
								<span className="text-sm font-medium tabular-nums">
									{format(p50)}
								</span>
							</div>
							<div className="h-1 w-full rounded-full bg-muted overflow-hidden">
								<div
									className="h-full bg-foreground/70"
									style={{
										width: `${Math.round((p50 / maxLatency) * 100)}%`,
									}}
								/>
							</div>
						</div>

						<div className="space-y-1">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">P95</span>
								<span className="text-sm font-medium tabular-nums">
									{format(p95)}
								</span>
							</div>
							<div className="h-1 w-full rounded-full bg-muted overflow-hidden">
								<div
									className="h-full bg-foreground/70"
									style={{
										width: `${Math.round((p95 / maxLatency) * 100)}%`,
									}}
								/>
							</div>
						</div>

						<div className="space-y-1">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">P99</span>
								<span className="text-sm font-medium tabular-nums">
									{format(p99)}
								</span>
							</div>
							<div className="h-1 w-full rounded-full bg-muted overflow-hidden">
								<div
									className="h-full bg-foreground/70"
									style={{
										width: `${Math.round((p99 / maxLatency) * 100)}%`,
									}}
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
					<RecentEventsTable events={events} />
				</CardContent>
			</Card>
		</div>
	);
}
