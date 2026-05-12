import { useNavigate } from "react-router";
import { ArrowLeft, Clock, Hash, RotateCw, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Event } from "@/lib/types";

interface EventDetailPageProps {
  event: Event;
}

const getStatusStyles = (status: string) => {
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

export function EventDetailPage({ event }: EventDetailPageProps) {
  const navigate = useNavigate();
  const status = getStatusStyles(event.status);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mt-1 shrink-0 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>

        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Event Details
            </h1>

            <div className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs">
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              <span className={status.text}>{event.status}</span>
            </div>
          </div>

          <p className="truncate font-mono text-sm text-muted-foreground">
            {event.id}
          </p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Event Information */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Event Information
            </CardTitle>
            <CardDescription className="text-xs">
              Runtime metadata for this webhook event
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RotateCw className="h-4 w-4" strokeWidth={1.5} />
                  <span>Attempts</span>
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
                  {event.attempts}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" strokeWidth={1.5} />
                  <span>Duration</span>
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
                  {event.duration_ms}ms
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash className="h-4 w-4" strokeWidth={1.5} />
                  <span>Status</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  <span className={status.text}>{event.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border px-4 py-3">
              <p className="text-xs text-muted-foreground">Timestamp</p>
              <p className="mt-1 font-mono text-sm text-foreground">
                {event.timestamp}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* References */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">References</CardTitle>
            <CardDescription className="text-xs">
              Linked resources associated with this event
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="rounded-xl border">
              <div className="flex items-center justify-between gap-4 border-b px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Webhook className="h-4 w-4" strokeWidth={1.5} />
                  <span>Webhook ID</span>
                </div>
              </div>

              <div className="px-4 py-3">
                <p className="break-all font-mono text-xs text-muted-foreground">
                  {event.webhook_id}
                </p>
              </div>
            </div>

            <div className="rounded-xl border">
              <div className="flex items-center justify-between gap-4 border-b px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash className="h-4 w-4" strokeWidth={1.5} />
                  <span>Event Type ID</span>
                </div>
              </div>

              <div className="px-4 py-3">
                <p className="break-all font-mono text-xs text-muted-foreground">
                  {event.event_type_id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note */}
        <div className="rounded-2xl border border-dashed p-4">
          <p className="text-sm font-medium">Payload unavailable</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The payload sent with this event is not stored in the database. To
            inspect payload data, check the delivery attempt or use test
            dispatch.
          </p>
        </div>
      </div>
    </div>
  );
}
