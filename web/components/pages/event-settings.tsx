import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Settings as SettingsType } from "@/lib/types";

interface EventSettingsPageProps {
  webhook: { id: string; name: string };
  settings: SettingsType;
}

export function EventSettingsPage({
  webhook,
  settings,
}: EventSettingsPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-8">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            className="mt-1 shrink-0 rounded-full bg-background"
            onClick={() => navigate(`/webhooks/${webhook.id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to webhook</span>
          </Button>

          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Event Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure delivery behavior for{" "}
              <span className="font-medium text-foreground">
                {webhook.name}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              Event type:{" "}
              <span className="font-mono text-foreground">
                {settings.event_type_id}
              </span>
            </p>
          </div>
        </div>

        <Card className="rounded-2xl border bg-background shadow-sm">
          <CardHeader className="space-y-2 border-b px-6 py-5">
            <CardTitle className="text-lg font-semibold">
              Delivery Configuration
            </CardTitle>
            <CardDescription>
              Control retries, timeouts, and whether this event type can send
              deliveries.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 py-6">
            <form method="post" className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="retry_attempts">Retry Attempts</Label>
                  <Input
                    id="retry_attempts"
                    name="retry_attempts"
                    type="number"
                    defaultValue={settings.retry_attempts}
                    min={0}
                    max={10}
                    className="h-11"
                  />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Number of times to retry delivery after a failed request.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout_seconds">Timeout</Label>
                  <Input
                    id="timeout_seconds"
                    name="timeout_seconds"
                    type="number"
                    defaultValue={settings.timeout_seconds}
                    min={1}
                    max={300}
                    className="h-11"
                  />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Maximum seconds to wait before marking a delivery as failed.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="enabled" className="text-sm font-medium">
                      Enable Deliveries
                    </Label>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Allow this event type to trigger webhook deliveries.
                    </p>
                  </div>

                  <Switch
                    id="enabled"
                    name="enabled"
                    defaultChecked={settings.enabled}
                    value="true"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/webhooks/${webhook.id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Settings</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
