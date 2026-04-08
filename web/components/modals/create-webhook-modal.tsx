import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateWebhookModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const events = [
	"user.created",
	"user.updated",
	"user.deleted",
	"order.created",
	"order.completed",
	"payment.processed",
];

export function CreateWebhookModal({
	open,
	onOpenChange,
}: CreateWebhookModalProps) {
	const [name, setName] = useState("");
	const [url, setUrl] = useState("");
	const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create Webhook</DialogTitle>
					<DialogDescription>
						Set up a new webhook endpoint to receive event notifications.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-2">
					<div className="space-y-2">
						<Label htmlFor="webhook-name">Name</Label>
						<Input
							id="webhook-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="My Webhook"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="webhook-url">Target URL</Label>
						<Input
							id="webhook-url"
							type="url"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="https://api.example.com/webhooks"
						/>
					</div>

					<div className="space-y-2">
						<Label>Events to Subscribe</Label>
						<ScrollArea className="h-40">
							<div className="space-y-2">
								{events.map((event) => (
									<Label
										key={event}
										className="flex items-center gap-3 rounded-md p-2 hover:bg-muted cursor-pointer"
									>
										<Checkbox
											checked={selectedEvents.includes(event)}
											onCheckedChange={(checked) => {
												if (checked) {
													setSelectedEvents([...selectedEvents, event]);
												} else {
													setSelectedEvents(
														selectedEvents.filter((e) => e !== event),
													);
												}
											}}
										/>
										<span className="text-sm text-foreground">{event}</span>
									</Label>
								))}
							</div>
						</ScrollArea>
					</div>
				</div>

				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={() => onOpenChange(false)}>Create Webhook</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
