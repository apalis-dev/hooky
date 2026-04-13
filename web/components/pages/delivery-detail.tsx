import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Delivery } from "@/lib/types";

interface DeliveryDetailPageProps {
	delivery: Delivery;
}

export function DeliveryDetailPage({ delivery }: DeliveryDetailPageProps) {
	const navigate = useNavigate();

	return (
		<div className="p-8 space-y-6">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate("/deliveries")}
				>
					<ArrowLeft className="h-4 w-4" />
					<span className="sr-only">Back to deliveries</span>
				</Button>
				<div>
					<h1 className="text-3xl font-semibold text-foreground">
						Delivery Details
					</h1>
					<p className="text-muted-foreground">{delivery.event}</p>
				</div>
			</div>

			<div className="max-w-2xl space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Event Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-muted-foreground">Event Name</p>
								<p className="text-foreground font-medium">{delivery.event}</p>
							</div>
							<div>
								<p className="text-muted-foreground">Status Code</p>
								<Badge variant="outline">{delivery.status}</Badge>
							</div>
							<div>
								<p className="text-muted-foreground">Duration</p>
								<p className="text-foreground font-medium">
									{delivery.duration}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground">Timestamp</p>
								<p className="text-foreground font-medium">
									{delivery.timestamp}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Request Payload</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="text-xs text-muted-foreground overflow-x-auto">
							{`{
  "id": "evt_${delivery.id}",
  "event": "${delivery.event}",
  "timestamp": "${delivery.timestamp}"
}`}
						</pre>
					</CardContent>
				</Card>

				<Separator />

				<div>
					<h3 className="text-sm font-semibold text-foreground mb-3">
						Delivery Status
					</h3>
					<Card>
						<CardContent className="flex items-center gap-3 pt-4">
							<Badge variant={delivery.success ? "success" : "destructive"}>
								{delivery.success ? "Success" : "Failed"}
							</Badge>
							<div>
								<p className="text-sm text-foreground font-medium">
									HTTP {delivery.status}
								</p>
								<p className="text-xs text-muted-foreground">
									{delivery.duration}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
