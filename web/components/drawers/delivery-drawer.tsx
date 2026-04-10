import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface DeliveryDrawerProps {
	delivery: any;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeliveryDrawer({
	delivery,
	open,
	onOpenChange,
}: DeliveryDrawerProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
				<SheetHeader>
					<SheetTitle>Delivery Details</SheetTitle>
				</SheetHeader>

				<div className="space-y-6 p-6">
					<div>
						<h3 className="text-sm font-semibold text-foreground mb-3">
							Event Information
						</h3>
						<div className="space-y-2 text-sm">
							<div>
								<p className="text-muted-foreground">Event Name</p>
								<p className="text-foreground font-medium">{delivery.event}</p>
							</div>
							<div>
								<p className="text-muted-foreground">Status Code</p>
								<Badge variant="outline">
									{delivery.status}
								</Badge>
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
					</div>

					<Separator />

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
			</SheetContent>
		</Sheet>
	);
}
