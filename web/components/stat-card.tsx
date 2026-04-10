import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
	const trendColor = trend === "up" ? "text-green-500" : "text-red-500";

	return (
		<Card className="hover:shadow-sm transition-shadow">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<Icon className="h-6 w-6 text-muted-foreground" color={iconColor} />
			</CardHeader>
			<CardContent>
				<h3 className="text-2xl font-semibold text-foreground">{value}</h3>
				<div className="mt-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
					<TrendIcon className={`h-4 w-4 ${trendColor}`} />
					{change}
				</div>
			</CardContent>
		</Card>
	);
}
