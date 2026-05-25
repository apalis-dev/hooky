import { redirect } from "react-router";
import { z } from "zod";
import {
  getWebhook,
  getWebhookEventTypes,
  getWebhookEvents,
  getWebhookDeliveries,
  updateWebhook,
  deleteWebhook,
  createEventType,
  dispatch,
  getSettings,
} from "@/lib/api";
import type {
  Webhook,
  EventType,
  Event,
  Delivery,
  Settings,
} from "@/lib/types";
import { WebhookDetailPage } from "@/components/pages/webhook-detail";
import { RouteErrorBoundary } from "@/components/route-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const webhookStatusSchema = z.enum(["active", "disabled", "paused"]);
const eventTypeNameSchema = z.string().trim().min(1, "Event name is required.");
const dispatchSchema = z.object({
  eventType: z.string().trim().min(1, "Event type is required."),
  payload: z
    .string()
    .default("{}")
    .transform((value, ctx) => {
      try {
        return JSON.parse(value || "{}");
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Payload must be valid JSON.",
        });
        return z.NEVER;
      }
    }),
});

export async function clientLoader({ params }: { params: { id: string } }) {
  const [webhook, eventTypes, events, deliveries] = await Promise.all([
    getWebhook(params.id),
    getWebhookEventTypes(params.id),
    getWebhookEvents(params.id, { limit: 10 }),
    getWebhookDeliveries(params.id, { limit: 10 }),
  ]);

  // Fetch settings for each event type
  const settingsMap: Record<string, Settings> = {};
  await Promise.all(
    eventTypes.map(async (et) => {
      try {
        const s = await getSettings(et.id);
        settingsMap[et.id] = s;
      } catch {
        settingsMap[et.id] = {
          id: "",
          event_type_id: et.id,
          retry_attempts: 3,
          timeout_seconds: 30,
          enabled: true,
        };
      }
    })
  );

  return { webhook, eventTypes, events, deliveries, settings: settingsMap };
}

export async function clientAction({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "updateStatus") {
    const status = webhookStatusSchema.parse(formData.get("status"));
    await updateWebhook(params.id, { status });
    return { ok: true };
  }

  if (intent === "delete") {
    await deleteWebhook(params.id);
    return redirect("/webhooks");
  }

  if (intent === "createEventType") {
    const name = eventTypeNameSchema.parse(formData.get("name"));
    await createEventType({ webhook_id: params.id, name });
    return { ok: true };
  }

  if (intent === "dispatch") {
    const result = dispatchSchema.safeParse({
      eventType: formData.get("eventType"),
      payload: formData.get("payload"),
    });

    if (!result.success) {
      return { ok: false, error: result.error.issues[0]?.message };
    }

    const webhook = await getWebhook(params.id);
    const dispatched = await dispatch({
      webhook_name: webhook.name,
      event_type: result.data.eventType,
      payload: result.data.payload,
    });
    return {
      ok: true,
      eventId: dispatched.event_id,
      pollUntil: Date.now() + 10_000,
    };
  }

  return { ok: false };
}

export function HydrateFallback() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-1">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function WebhookDetail({
  loaderData,
}: {
  loaderData: {
    webhook: Webhook;
    eventTypes: EventType[];
    events: Event[];
    deliveries: Delivery[];
    settings: Record<string, Settings>;
  };
}) {
  return <WebhookDetailPage {...loaderData} />;
}

export function ErrorBoundary() {
  return (
    <RouteErrorBoundary
      backLabel="Back to webhooks"
      backTo="/webhooks"
      notFoundMessage="That webhook does not exist or may have been deleted."
      notFoundTitle="Webhook not found"
    />
  );
}
