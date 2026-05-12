import { useState, type FormEvent } from "react";
import {
  useNavigate,
  Form,
  Link,
  useFetcher,
} from "react-router";
import {
  ArrowLeft,
  Plus,
  Play,
  Trash2,
  Radio,
  Activity,
  Send,
  Copy,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  Webhook,
  EventType,
  Event,
  Delivery,
  Settings,
} from "@/lib/types";

interface WebhookDetailPageProps {
  webhook: Webhook;
  eventTypes: EventType[];
  events: Event[];
  deliveries: Delivery[];
  settings: Record<string, Settings>;
}

const getWebhookStatusStyles = (status: string) => {
  switch (status) {
    case "active":
      return {
        dot: "bg-emerald-500",
        text: "text-emerald-600",
      };
    case "disabled":
      return {
        dot: "bg-red-500",
        text: "text-red-600",
      };
    default:
      return {
        dot: "bg-zinc-400",
        text: "text-muted-foreground",
      };
  }
};

const getEventStatusStyles = (status: string) => {
  switch (status) {
    case "success":
      return {
        dot: "bg-emerald-500",
        text: "text-emerald-600",
      };
    case "fail":
    case "failed":
      return {
        dot: "bg-red-500",
        text: "text-red-600",
      };
    default:
      return {
        dot: "bg-zinc-400",
        text: "text-muted-foreground",
      };
  }
};

export function WebhookDetailPage({
  webhook,
  eventTypes,
  events,
  deliveries,
  settings,
}: WebhookDetailPageProps) {
  const navigate = useNavigate();
  const createEventTypeFetcher = useFetcher<{ ok: boolean }>();
  const dispatchFetcher = useFetcher<{
    ok: boolean;
    event?: Event;
    error?: string;
  }>();
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isAddEventTypeOpen, setIsAddEventTypeOpen] = useState(false);
  const [dispatchPayload, setDispatchPayload] = useState("{}");
  const [dispatchPayloadError, setDispatchPayloadError] = useState("");
  const [copied, setCopied] = useState(false);

  const webhookStatus = getWebhookStatusStyles(webhook.status);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhook.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDispatchSubmit = (event: FormEvent<HTMLFormElement>) => {
    try {
      JSON.parse(dispatchPayload || "{}");
    } catch {
      event.preventDefault();
      setDispatchPayloadError("Payload must be valid JSON.");
      return;
    }

    setDispatchPayloadError("");
    setIsDispatchOpen(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4 min-w-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/webhooks")}
            className="mt-1 shrink-0 rounded-full bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to webhooks</span>
          </Button>

          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-3xl font-semibold tracking-tight">
                {webhook.name}
              </h1>

              <div className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${webhookStatus.dot}`}
                />
                <span className={webhookStatus.text}>{webhook.status}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <p className="truncate font-mono">{webhook.url}</p>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyUrl}
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3.5 w-3.5" />
                <span className="sr-only">Copy webhook URL</span>
              </Button>

              {copied && (
                <span className="text-xs text-muted-foreground">Copied</span>
              )}
            </div>
          </div>
        </div>

        <Form method="post" className="shrink-0">
          <input type="hidden" name="intent" value="delete" />
          <Button
            variant="outline"
            size="sm"
            type="submit"
            className="text-red-600 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </Form>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Radio className="h-4 w-4" strokeWidth={1.5} />
              <span>Event Types</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight tabular-nums">
              {eventTypes.length}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" strokeWidth={1.5} />
              <span>Total Events</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight tabular-nums">
              {events.length}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Send className="h-4 w-4" strokeWidth={1.5} />
              <span>Total Deliveries</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight tabular-nums">
              {deliveries.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
            <div>
              <CardTitle className="text-base font-medium">
                Event Types
              </CardTitle>
              <CardDescription className="text-xs">
                Events this webhook can receive
              </CardDescription>
            </div>

            <Dialog
              open={isAddEventTypeOpen}
              onOpenChange={setIsAddEventTypeOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Event Type</DialogTitle>
                  <DialogDescription>
                    Create a new event type for this webhook.
                  </DialogDescription>
                </DialogHeader>

                <createEventTypeFetcher.Form
                  method="post"
                  className="space-y-4"
                  onSubmit={() => setIsAddEventTypeOpen(false)}
                >
                  <input type="hidden" name="intent" value="createEventType" />

                  <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input
                      id="eventName"
                      name="name"
                      placeholder="user.created"
                      className="font-mono text-sm"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={createEventTypeFetcher.state !== "idle"}
                    >
                      {createEventTypeFetcher.state !== "idle"
                        ? "Adding..."
                        : "Add Event Type"}
                    </Button>
                  </div>
                </createEventTypeFetcher.Form>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            {eventTypes.length > 0 ? (
              <div className="divide-y rounded-xl border">
                {eventTypes.map((eventType) => (
                  <div
                    key={eventType.id}
                    className="flex items-center justify-between gap-3 px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/70" />
                      <span className="truncate font-mono text-sm">
                        {eventType.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {eventType.id.slice(0, 8)}
                      </span>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        title="Configure settings"
                      >
                        <Link to={`/webhooks/${webhook.id}/settings/${eventType.id}`}>
                          <SettingsIcon className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <p className="text-sm font-medium">No event types</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add one to start receiving webhook events.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Test Dispatch
            </CardTitle>
            <CardDescription className="text-xs">
              Send a test payload to this webhook endpoint
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                  <Play className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium">Dispatch a test event</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose an event type and send a JSON payload to verify the
                    endpoint behavior.
                  </p>
                </div>
              </div>
            </div>

            <Dialog open={isDispatchOpen} onOpenChange={setIsDispatchOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Play className="h-4 w-4" />
                  Send Test Event
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dispatch Test Event</DialogTitle>
                  <DialogDescription>
                    Send a test event to {webhook.name}.
                  </DialogDescription>
                </DialogHeader>

                <dispatchFetcher.Form
                  method="post"
                  className="space-y-4"
                  onSubmit={handleDispatchSubmit}
                >
                  <input type="hidden" name="intent" value="dispatch" />

                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select name="eventType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((eventType) => (
                          <SelectItem key={eventType.id} value={eventType.name}>
                            {eventType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payload">Payload JSON</Label>
                    <Textarea
                      id="payload"
                      name="payload"
                      value={dispatchPayload}
                      onChange={(event) => {
                        setDispatchPayload(event.target.value);
                        setDispatchPayloadError("");
                      }}
                      placeholder='{"key": "value"}'
                      rows={8}
                      className="font-mono text-sm"
                    />
                    {(dispatchPayloadError || dispatchFetcher.data?.error) && (
                      <p className="text-xs text-red-600">
                        {dispatchPayloadError || dispatchFetcher.data?.error}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={dispatchFetcher.state !== "idle"}
                    >
                      {dispatchFetcher.state !== "idle"
                        ? "Dispatching..."
                        : "Dispatch"}
                    </Button>
                  </div>
                </dispatchFetcher.Form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Recent Events</CardTitle>
          <CardDescription className="text-xs">
            Latest events dispatched to this webhook
          </CardDescription>
        </CardHeader>

        <CardContent>
          {events.length > 0 ? (
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="text-xs font-normal text-muted-foreground">
                      Event
                    </TableHead>
                    <TableHead className="text-xs font-normal text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-normal text-muted-foreground">
                      Duration
                    </TableHead>
                    <TableHead className="text-xs font-normal text-muted-foreground">
                      Time
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {events.map((event) => {
                    const status = getEventStatusStyles(event.status);

                    return (
                      <TableRow
                        key={event.id}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        <TableCell className="py-3 font-mono text-xs">
                          <Link
                            to={`/events/${event.id}`}
                            className="hover:underline"
                          >
                            {event.id.slice(0, 12)}...
                          </Link>
                        </TableCell>

                        <TableCell className="py-3">
                          <div className="flex items-center gap-2 text-sm">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />
                            <span className={status.text}>{event.status}</span>
                          </div>
                        </TableCell>

                        <TableCell className="py-3 text-muted-foreground tabular-nums">
                          {event.duration_ms}ms
                        </TableCell>

                        <TableCell className="py-3 text-xs text-muted-foreground">
                          {event.timestamp}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <p className="text-sm font-medium">No events yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use test dispatch to send the first event.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Deliveries */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Recent Deliveries
          </CardTitle>
          <CardDescription className="text-xs">
            Delivery attempts for this webhook
          </CardDescription>
        </CardHeader>

        <CardContent>
          {deliveries.length > 0 ? (
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="text-xs font-normal text-muted-foreground">
                      Event
                    </TableHead>
                    <TableHead className="text-xs font-normal text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-normal text-muted-foreground">
                      Duration
                    </TableHead>
                    <TableHead className="text-xs font-normal text-muted-foreground">
                      Time
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow
                      key={delivery.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="py-3 font-mono text-xs">
                        {delivery.event_id.slice(0, 12)}...
                      </TableCell>

                      <TableCell className="py-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              delivery.success ? "bg-emerald-500" : "bg-red-500"
                            }`}
                          />
                          <span
                            className={
                              delivery.success
                                ? "text-muted-foreground tabular-nums"
                                : "text-red-600"
                            }
                          >
                            {delivery.status_code || "Failed"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 text-muted-foreground tabular-nums">
                        {delivery.duration_ms}ms
                      </TableCell>

                      <TableCell className="py-3 text-xs text-muted-foreground">
                        {delivery.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <p className="text-sm font-medium">No deliveries yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Delivery attempts will appear here once events are dispatched.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
