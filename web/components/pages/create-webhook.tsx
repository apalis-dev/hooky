import { Form, useActionData, useNavigate, useNavigation } from "react-router";
import { ArrowLeft } from "lucide-react";
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

export function CreateWebhookPage() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData() as { error?: string } | undefined;
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/webhooks")}
          className="mt-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to webhooks</span>
        </Button>

        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create Webhook
          </h1>
          <p className="text-muted-foreground">
            Set up a webhook endpoint to receive event notifications.
          </p>
        </div>
      </div>

      <Form method="POST" className="max-w-2xl space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Endpoint Details</CardTitle>
            <CardDescription>
              Define the webhook name and destination URL.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="webhook-name">Name</Label>
              <Input
                id="webhook-name"
                name="name"
                required
                placeholder="My Webhook"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">Target URL</Label>
              <Input
                id="webhook-url"
                name="url"
                type="url"
                required
                placeholder="https://api.example.com/webhooks"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {actionData?.error && (
            <p className="mr-auto text-sm text-red-600">{actionData.error}</p>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/webhooks")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Webhook"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
