import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconColor,
}: StatCardProps) {
  const TrendIcon = trend === "up" ? ArrowUp : ArrowDown;
  const trendColor = trend === "up" ? "text-emerald-500" : "text-red-500";

  return (
    <Card className="h-full rounded-2xl transition-shadow hover:shadow-sm">
      <CardContent className="flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <p className="truncate text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <h3 className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {value}
            </h3>
          </div>

          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60"
            style={{ color: iconColor }}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <TrendIcon className={`h-4 w-4 shrink-0 ${trendColor}`} />
          <span className="truncate">{change}</span>
        </div>
      </CardContent>
    </Card>
  );
}
