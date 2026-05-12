import { redirect } from "react-router";
import {
  getWebhook,
  getWebhookEventTypes,
  getWebhookEvents,
  getWebhookDeliveries,
  getEvent,
  updateWebhook,
  deleteWebhook,
  createEventType,
  dispatch,
  getSettings,
  updateSettings,
} from "@/lib/api";
import type {
  Webhook,
  EventType,
  Event,
  Delivery,
  Settings,
} from "@/lib/types";
import { WebhookDetailPage } from "@/components/pages/webhook-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PENDING_EVENT_STATUSES = new Set(["sending", "submitting"]);

async function waitForEventToSettle(eventId: string) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const event = await getEvent(eventId);

    if (!PENDING_EVENT_STATUSES.has(event.status)) {
      return event;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 500));
  }

  return getEvent(eventId);
}

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
    const status = formData.get("status") as string;
    await updateWebhook(params.id, { status });
    return { ok: true };
  }

  if (intent === "delete") {
    await deleteWebhook(params.id);
    return redirect("/webhooks");
  }

  if (intent === "createEventType") {
    const name = formData.get("name") as string;
    await createEventType({ webhook_id: params.id, name });
    return { ok: true };
  }

  if (intent === "dispatch") {
    const eventType = formData.get("eventType") as string;
    const payloadStr = formData.get("payload") as string;
    const payload = JSON.parse(payloadStr || "{}");
    const webhook = await getWebhook(params.id);
    const dispatched = await dispatch({
      webhook_name: webhook.name,
      event_type: eventType,
      payload,
    });
    const event = await waitForEventToSettle(dispatched.event_id);
    return { ok: true, event };
  }

  if (intent === "saveSettings") {
    const eventTypeId = formData.get("eventTypeId") as string;
    const settings = {
      retry_attempts: Number(formData.get("retry_attempts")),
      timeout_seconds: Number(formData.get("timeout_seconds")),
      enabled: formData.get("enabled") === "true",
    };
    await updateSettings(eventTypeId, settings);
    return { ok: true };
  }

  if (intent === "configureSettings") {
    const eventTypeId = formData.get("eventTypeId") as string;
    await updateSettings(eventTypeId, {
      retry_attempts: 3,
      timeout_seconds: 30,
      enabled: true,
    });
    return redirect(`/webhooks/${params.id}/settings/${eventTypeId}`);
  }

  return { ok: false };
}

export function HydrateFallback() {
  return (
    <div className="p-8 space-y-6">
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
