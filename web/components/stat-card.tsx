import { ArrowUp, ArrowDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: string
}

export function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  const trendColor = trend === "up" ? "text-success dark:text-success" : "text-warning dark:text-warning"
  const TrendIcon = trend === "up" ? ArrowUp : ArrowDown

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3 hover:border-accent/50 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span className="text-lg">{icon}</span>
      </div>
      <h3 className="text-2xl font-semibold text-foreground">{value}</h3>
      <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
        <TrendIcon className="w-4 h-4" />
        {change}
      </div>
    </div>
  )
}
