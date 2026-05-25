import { useState } from "react";
import { useFetcher } from "react-router";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EventType } from "@/lib/types";
import type { SettingsFormValues } from "@/app/routes/settings";
import { Spinner } from "@/components/ui/spinner";
import { Save } from "lucide-react";

interface SettingsPageProps {
  eventTypes: EventType[];
  settingsByEventTypeId: Record<string, SettingsFormValues>;
}

export function SettingsPage({
  eventTypes,
  settingsByEventTypeId,
}: SettingsPageProps) {
  const [selectedEventType, setSelectedEventType] = useState(
    eventTypes[0]?.id || ""
  );
  const fetcher = useFetcher<{
    ok?: boolean;
    error?: string;
    settings?: SettingsFormValues;
  }>();
  const isSaving = fetcher.state !== "idle";
  const settings = settingsByEventTypeId[selectedEventType];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage webhook delivery configuration
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Delivery Configuration
          </CardTitle>
          <CardDescription className="text-xs">
            Control webhook retry behavior per event type
          </CardDescription>
        </CardHeader>

        <CardContent>
          {eventTypes.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No event types configured. Create a webhook with event types
              first.
            </p>
          ) : (
            <fetcher.Form
              key={selectedEventType}
              method="POST"
              className="space-y-4"
            >
              <input
                type="hidden"
                name="eventTypeId"
                value={selectedEventType}
              />
              <div className="space-y-1.5">
                <Label htmlFor="event-type" className="text-xs">
                  Event Type
                </Label>
                <Select
                  value={selectedEventType}
                  onValueChange={setSelectedEventType}
                >
                  <SelectTrigger id="event-type" className="text-sm">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((eventType) => (
                      <SelectItem key={eventType.id} value={eventType.id}>
                        {eventType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {settings && !settings.persisted && (
                  <p className="text-xs text-muted-foreground">
                    Using default delivery settings until you save.
                  </p>
                )}
              </div>
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label
                      htmlFor="settings-enabled"
                      className="text-sm font-medium"
                    >
                      Enable Deliveries
                    </Label>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Allow this event type to trigger webhook deliveries.
                    </p>
                  </div>

                  <div>
                    <input type="hidden" name="enabled" value="false" />
                    <Switch
                      id="settings-enabled"
                      name="enabled"
                      defaultChecked={settings?.enabled ?? true}
                      value="true"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="timeout" className="text-xs">
                    Timeout (seconds)
                  </Label>
                  <Input
                    id="timeout"
                    name="timeout_seconds"
                    type="number"
                    defaultValue={settings?.timeout_seconds ?? 30}
                    min={1}
                    max={300}
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
                    defaultValue={settings?.retry_attempts ?? 3}
                    min={0}
                    max={10}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                {fetcher.data?.error && (
                  <p className="mr-auto text-sm text-red-600">
                    {fetcher.data.error}
                  </p>
                )}
                <Button
                  type="submit"
                  variant={"outline"}
                  size="sm"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </fetcher.Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
