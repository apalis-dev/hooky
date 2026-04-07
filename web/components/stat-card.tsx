import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
	title: string;
	value: string;
	change: string;
	trend: "up" | "down";
	icon: React.ReactNode;
}

export function StatCard({ title, value, change, trend, icon }: StatCardProps) {
	const trendColor =
		trend === "up"
			? "text-success dark:text-success"
			: "text-warning dark:text-warning";
	const TrendIcon = trend === "up" ? ArrowUp : ArrowDown;

	return (
		<Card className="hover:border-accent/50 transition-colors">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<span className="text-lg">{icon}</span>
			</CardHeader>
			<CardContent>
				<h3 className="text-2xl font-semibold text-foreground">{value}</h3>
				<div
					className={`mt-1 flex items-center gap-1 text-sm font-medium ${trendColor}`}
				>
					<TrendIcon className="h-4 w-4" />
					{change}
				</div>
			</CardContent>
		</Card>
	);
}
