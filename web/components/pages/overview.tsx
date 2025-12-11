"use client"
import { CheckCircle, Zap } from "lucide-react"
import { StatCard } from "../stat-card"
import { RecentEventsTable } from "../recent-events-table"

export function OverviewPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Overview</h1>
        <p className="text-muted-foreground">Monitor your webhook system health at a glance</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Endpoints" value="22" change="+1" trend="up" icon="✓" />
        <StatCard title="Success Rate" value="99.8%" change="+0.2%" trend="up" icon="📈" />
        <StatCard title="Avg Delivery Time" value="245ms" change="-12ms" trend="down" icon="⚡" />
        <StatCard title="24h Deliveries" value="1.2K" change="+234" trend="up" icon="📡" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Endpoint Status</h2>
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div className="space-y-3">
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
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Performance</h2>
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">P50 Latency</span>
                <span className="text-sm font-semibold text-foreground">145ms</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: "48%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">P95 Latency</span>
                <span className="text-sm font-semibold text-foreground">512ms</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">P99 Latency</span>
                <span className="text-sm font-semibold text-foreground">1.2s</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Events</h2>
        <RecentEventsTable />
      </div>
    </div>
  )
}
