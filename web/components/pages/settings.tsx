import { Eye, EyeOff, Copy, RotateCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function SettingsPage() {
	const [showSecret, setShowSecret] = useState(false);
	const [showApiKey, setShowApiKey] = useState(false);
	const [copied, setCopied] = useState("");

	const handleCopy = (text: string, id: string) => {
		navigator.clipboard.writeText(text);
		setCopied(id);
		setTimeout(() => setCopied(""), 2000);
	};

	return (
		<div className="p-8 space-y-8">
			<div>
				<h1 className="text-3xl font-semibold text-foreground mb-2">
					Settings
				</h1>
				<p className="text-muted-foreground">
					Configure webhook behavior and security
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Signing Settings</CardTitle>
						<CardDescription>
							Secure your webhooks with signing keys
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="webhook-secret">Webhook Secret</Label>
							<div className="flex items-center gap-2">
								<Input
									id="webhook-secret"
									type={showSecret ? "text" : "password"}
									value="whk_secret_abc123xyz"
									readOnly
								/>
								<Button
									variant="outline"
									size="icon"
									onClick={() => setShowSecret(!showSecret)}
								>
									{showSecret ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
									<span className="sr-only">
										{showSecret ? "Hide" : "Show"} secret
									</span>
								</Button>
							</div>
						</div>

						<Button variant="outline" className="w-full">
							<RotateCw className="h-4 w-4" />
							Regenerate Secret
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>API Keys</CardTitle>
						<CardDescription>Manage API access credentials</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="api-key">Primary API Key</Label>
							<div className="flex items-center gap-2">
								<Input
									id="api-key"
									type={showApiKey ? "text" : "password"}
									value="sk_live_51234567890abcdef"
									readOnly
								/>
								<Button
									variant="outline"
									size="icon"
									onClick={() => setShowApiKey(!showApiKey)}
								>
									{showApiKey ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
									<span className="sr-only">
										{showApiKey ? "Hide" : "Show"} API key
									</span>
								</Button>
								<Button
									variant="outline"
									size="icon"
									onClick={() =>
										handleCopy("sk_live_51234567890abcdef", "apikey")
									}
								>
									<Copy className="h-4 w-4" />
									<span className="sr-only">Copy API key</span>
								</Button>
							</div>
							{copied === "apikey" && (
								<p className="text-xs text-muted-foreground">
									Copied to clipboard
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Delivery Configuration</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="timeout">Timeout (seconds)</Label>
							<Input id="timeout" type="number" defaultValue="30" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="max-retries">Max Retries</Label>
							<Input id="max-retries" type="number" defaultValue="3" />
						</div>
					</div>
					<div className="mt-6 flex justify-end">
						<Button>Save Changes</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
