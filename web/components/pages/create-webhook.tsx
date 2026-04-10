import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const events = [
	"user.created",
	"user.updated",
	"user.deleted",
	"order.created",
	"order.completed",
	"payment.processed",
];

export function CreateWebhookPage() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [url, setUrl] = useState("");
	const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

	const handleSubmit = () => {
		// TODO: wire to API
		navigate("/webhooks");
	};

	return (
		<div className="p-8 space-y-8">
			<div className="flex items-start gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate("/webhooks")}
					className="mt-1"
				>
					<ArrowLeft className="h-4 w-4" />
					<span className="sr-only">Back to webhooks</span>
				</Button>

				<div className="space-y-1">
					<h1 className="text-3xl font-semibold tracking-tight">
						Create Webhook
					</h1>
					<p className="text-muted-foreground">
						Set up a webhook endpoint to receive event notifications.
					</p>
				</div>
			</div>

			<div className="max-w-2xl space-y-6">
				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle>Endpoint Details</CardTitle>
						<CardDescription>
							Define the webhook name and destination URL.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-5">
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
					</CardContent>
				</Card>

				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle>Events</CardTitle>
						<CardDescription>
							Choose which events trigger this webhook.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<ScrollArea className="h-52 pr-2">
							<div className="space-y-1">
								{events.map((event) => (
									<Label
										key={event}
										className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50 cursor-pointer"
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
					</CardContent>
				</Card>

				<div className="flex items-center justify-end gap-3">
					<Button variant="outline" onClick={() => navigate("/webhooks")}>
						Cancel
					</Button>
					<Button onClick={handleSubmit}>Create Webhook</Button>
				</div>
			</div>
		</div>
	);
}
