import { useNavigate, useParams } from "react-router";
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

// TODO: replace with API fetch by ID
const deliveries: Record<string, any> = {
	"1": {
		id: 1,
		event: "user.created",
		status: 200,
		duration: "145ms",
		timestamp: "2025-12-08 14:32:00",
		success: true,
	},
	"2": {
		id: 2,
		event: "order.completed",
		status: 200,
		duration: "234ms",
		timestamp: "2025-12-08 14:31:15",
		success: true,
	},
	"3": {
		id: 3,
		event: "payment.failed",
		status: 500,
		duration: "156ms",
		timestamp: "2025-12-08 14:28:42",
		success: false,
	},
	"4": {
		id: 4,
		event: "user.updated",
		status: 200,
		duration: "89ms",
		timestamp: "2025-12-08 14:25:00",
		success: true,
	},
	"5": {
		id: 5,
		event: "invoice.generated",
		status: 202,
		duration: "512ms",
		timestamp: "2025-12-08 14:22:30",
		success: true,
	},
};

export function DeliveryDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const delivery = id ? deliveries[id] : null;

	if (!delivery) {
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
					<h1 className="text-3xl font-semibold text-foreground">
						Delivery Not Found
					</h1>
				</div>
				<p className="text-muted-foreground">
					The delivery you're looking for doesn't exist.
				</p>
			</div>
		);
	}

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
  "id": "evt_123456",
  "event": "${delivery.event}",
  "timestamp": "${delivery.timestamp}",
  "data": {
    "userId": "user_789",
    "email": "user@example.com"
  }
}`}
						</pre>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Response Payload</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="text-xs text-muted-foreground overflow-x-auto">
							{`{
  "received": true,
  "id": "evt_123456"
}`}
						</pre>
					</CardContent>
				</Card>

				<Separator />

				<div>
					<h3 className="text-sm font-semibold text-foreground mb-3">
						Retries
					</h3>
					<Card>
						<CardContent className="flex items-center gap-3 pt-4">
							<Badge variant="success">Success</Badge>
							<div>
								<p className="text-sm text-foreground font-medium">
									Attempt 1
								</p>
								<p className="text-xs text-muted-foreground">
									2025-12-08 14:32:00
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
