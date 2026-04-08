import { Badge } from "@/components/ui/badge";
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
								<Badge variant="outline" className="font-mono">
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

					<div>
						<h3 className="text-sm font-semibold text-foreground mb-3">
							Request Payload
						</h3>
						<pre className="bg-muted border border-border rounded-md p-3 text-xs overflow-x-auto text-muted-foreground">
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
					</div>

					<div>
						<h3 className="text-sm font-semibold text-foreground mb-3">
							Response Payload
						</h3>
						<pre className="bg-muted border border-border rounded-md p-3 text-xs overflow-x-auto text-muted-foreground">
							{`{
  "received": true,
  "id": "evt_123456"
}`}
						</pre>
					</div>

					<Separator />

					<div>
						<h3 className="text-sm font-semibold text-foreground mb-3">
							Retries
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex items-center gap-3 rounded-md border border-border bg-muted/50 p-3">
								<div className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
								<div>
									<p className="text-foreground font-medium">
										Attempt 1 - Success
									</p>
									<p className="text-xs text-muted-foreground">
										2025-12-08 14:32:00
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
