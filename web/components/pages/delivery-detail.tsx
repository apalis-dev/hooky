import { useNavigate } from "react-router";
import { ArrowLeft, Clock, Hash, Send, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Delivery } from "@/lib/types";

interface DeliveryDetailPageProps {
  delivery: Delivery;
}

const getDeliveryStatusStyles = (success: boolean) => {
  if (success) {
    return {
      dot: "bg-emerald-500",
      text: "text-emerald-600",
      label: "Success",
    };
  }

  return {
    dot: "bg-red-500",
    text: "text-red-600",
    label: "Failed",
  };
};

export function DeliveryDetailPage({ delivery }: DeliveryDetailPageProps) {
  const navigate = useNavigate();
  const status = getDeliveryStatusStyles(delivery.success);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/deliveries")}
          className="mt-1 shrink-0 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to deliveries</span>
        </Button>

        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Delivery Details
            </h1>

            <div className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs">
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              <span className={status.text}>{status.label}</span>
            </div>
          </div>

          <p className="truncate font-mono text-xs text-muted-foreground">
            {delivery.id}
          </p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Delivery Information */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Delivery Information
            </CardTitle>
            <CardDescription className="text-xs">
              Runtime metadata for this delivery attempt
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Server className="h-4 w-4" strokeWidth={1.5} />
                  <span>Status</span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  <span className={status.text}>
                    HTTP {delivery.status_code ?? "Failed"}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" strokeWidth={1.5} />
                  <span>Duration</span>
                </div>

                <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
                  {delivery.duration_ms}ms
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Send className="h-4 w-4" strokeWidth={1.5} />
                  <span>Result</span>
                </div>

                <p className={`mt-3 text-sm font-medium ${status.text}`}>
                  {status.label}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border px-4 py-3">
                <p className="text-xs text-muted-foreground">Timestamp</p>
                <p className="mt-1 font-mono text-sm text-foreground">
                  {delivery.timestamp}
                </p>
              </div>

              <div className="rounded-xl border px-4 py-3">
                <p className="text-xs text-muted-foreground">Event ID</p>
                <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                  {delivery.event_id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Payload */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Request Payload
            </CardTitle>
            <CardDescription className="text-xs">
              Payload metadata sent with this delivery
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="overflow-hidden rounded-xl border bg-muted/20">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span>JSON</span>
                </div>
              </div>

              <pre className="overflow-x-auto p-4 text-xs text-muted-foreground">
                {`{
  "delivery_id": "${delivery.id}",
  "event_id": "${delivery.event_id}",
  "timestamp": "${delivery.timestamp}"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Status Summary */}
        <div className="rounded-2xl border border-dashed p-4">
          <p className="text-sm font-medium">Delivery Status</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This delivery{" "}
            {delivery.success ? "completed successfully" : "failed"} with{" "}
            <span className="font-mono">
              HTTP {delivery.status_code ?? "N/A"}
            </span>{" "}
            in{" "}
            <span className="font-mono tabular-nums">
              {delivery.duration_ms}ms
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
