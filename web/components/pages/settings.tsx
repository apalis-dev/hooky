import { Eye, EyeOff, Copy, RotateCw } from "lucide-react";
import { useState } from "react";
import { Form, useFetcher } from "react-router";
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
import type { Settings } from "@/lib/types";

interface SettingsPageProps {
	settings: Settings;
}

export function SettingsPage({ settings }: SettingsPageProps) {
	const [showSecret, setShowSecret] = useState(false);
	const [showApiKey, setShowApiKey] = useState(false);
	const [copied, setCopied] = useState("");
	const fetcher = useFetcher();
	const isSaving = fetcher.state !== "idle";

	const handleCopy = (text: string, id: string) => {
		navigator.clipboard.writeText(text);
		setCopied(id);
		setTimeout(() => setCopied(""), 1500);
	};

	return (
		<div className="p-6 space-y-6 max-w-5xl">
			<div>
				<h1 className="text-2xl font-semibold text-foreground">Settings</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Manage your webhook configuration and API access
				</p>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-base font-medium">
							Signing Secret
						</CardTitle>
						<CardDescription className="text-xs">
							Used to verify webhook payloads
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="space-y-1.5">
							<Label htmlFor="webhook-secret" className="text-xs">
								Webhook Secret
							</Label>

							<div className="flex items-center gap-2">
								<Input
									id="webhook-secret"
									type={showSecret ? "text" : "password"}
									value="whk_secret_abc123xyz"
									readOnly
									className="font-mono text-xs"
								/>

								<Button
									variant="ghost"
									size="icon"
									onClick={() => setShowSecret(!showSecret)}
								>
									{showSecret ? (
										<EyeOff className="h-4 w-4 text-muted-foreground" />
									) : (
										<Eye className="h-4 w-4 text-muted-foreground" />
									)}
								</Button>

								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleCopy("whk_secret_abc123xyz", "secret")}
								>
									<Copy className="h-4 w-4 text-muted-foreground" />
								</Button>
							</div>

							{copied === "secret" && (
								<p className="text-[11px] text-muted-foreground">Copied</p>
							)}
						</div>

						<Button variant="outline" size="sm" className="w-full">
							<RotateCw className="h-3.5 w-3.5 mr-2" />
							Regenerate
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-base font-medium">API Key</CardTitle>
						<CardDescription className="text-xs">
							Used for authenticating API requests
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="space-y-1.5">
							<Label htmlFor="api-key" className="text-xs">
								Primary Key
							</Label>

							<div className="flex items-center gap-2">
								<Input
									id="api-key"
									type={showApiKey ? "text" : "password"}
									value="sk_live_51234567890abcdef"
									readOnly
									className="font-mono text-xs"
								/>

								<Button
									variant="ghost"
									size="icon"
									onClick={() => setShowApiKey(!showApiKey)}
								>
									{showApiKey ? (
										<EyeOff className="h-4 w-4 text-muted-foreground" />
									) : (
										<Eye className="h-4 w-4 text-muted-foreground" />
									)}
								</Button>

								<Button
									variant="ghost"
									size="icon"
									onClick={() =>
										handleCopy("sk_live_51234567890abcdef", "apikey")
									}
								>
									<Copy className="h-4 w-4 text-muted-foreground" />
								</Button>
							</div>

							{copied === "apikey" && (
								<p className="text-[11px] text-muted-foreground">Copied</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base font-medium">
						Delivery Configuration
					</CardTitle>
					<CardDescription className="text-xs">
						Control webhook retry behavior
					</CardDescription>
				</CardHeader>

				<CardContent>
					<fetcher.Form method="POST" className="space-y-4">
						<input type="hidden" name="enabled" value={String(settings.enabled)} />
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<Label htmlFor="timeout" className="text-xs">
									Timeout (seconds)
								</Label>
								<Input
									id="timeout"
									name="timeout_seconds"
									type="number"
									defaultValue={settings.timeout_seconds}
									className="text-sm"
								/>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="max-retries" className="text-xs">
									Max Retries
								</Label>
								<Input
									id="max-retries"
									name="retry_attempts"
									type="number"
									defaultValue={settings.retry_attempts}
									className="text-sm"
								/>
							</div>
						</div>

						<div className="flex justify-end">
							<Button type="submit" size="sm" disabled={isSaving}>
								{isSaving ? "Saving..." : "Save"}
							</Button>
						</div>
					</fetcher.Form>
				</CardContent>
			</Card>
		</div>
	);
}
