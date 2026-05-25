import { Form, useActionData, useNavigate, useNavigation } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Webhook } from "@/lib/types";
import { Spinner } from "../ui/spinner";

interface EditWebhookPageProps {
  webhook: Webhook;
}

export function EditWebhookPage({ webhook }: EditWebhookPageProps) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData() as { error?: string } | undefined;
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-8">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(`/webhooks/${webhook.id}`)}
            className="mt-1 shrink-0 rounded-full bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to webhook details</span>
          </Button>

          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Edit Webhook
            </h1>
            <p className="text-sm text-muted-foreground">
              Update the endpoint name and destination URL.
            </p>
          </div>
        </div>

        <Form method="POST">
          <Card className="rounded-2xl border bg-background shadow-sm">
            <CardHeader className="space-y-2 border-b px-6 py-5">
              <CardTitle className="text-lg font-semibold">
                Endpoint Details
              </CardTitle>
              <CardDescription>
                Changes will apply to future delivery attempts for this webhook.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-6 py-6">
              {actionData?.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {actionData.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="webhook-name">Name</Label>
                <Input
                  id="webhook-name"
                  name="name"
                  defaultValue={webhook.name}
                  required
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  A short label to help you identify this webhook.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Target URL</Label>
                <Input
                  id="webhook-url"
                  name="url"
                  type="url"
                  defaultValue={webhook.url}
                  required
                  className="h-11 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  The HTTPS endpoint that will receive webhook events.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col-reverse gap-3 border-t px-6 py-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/webhooks/${webhook.id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4 animate-spin" /> Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </Form>
      </div>
    </div>
  );
}
