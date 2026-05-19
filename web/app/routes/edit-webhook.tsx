import { redirect } from "react-router";
import { z } from "zod";
import { getWebhook, updateWebhook } from "@/lib/api";
import type { Webhook } from "@/lib/types";
import { EditWebhookPage } from "@/components/pages/edit-webhook";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const editWebhookSchema = z.object({
	name: z.string().trim().min(1, "Name is required."),
	url: z.string().trim().url("Enter a valid URL."),
});

function requireWebhookId(params: { id?: string }) {
	if (!params.id) {
		throw new Response("Webhook ID is required.", { status: 400 });
	}

	return params.id;
}

export function HydrateFallback() {
	return (
		<div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
			<div className="flex items-start gap-4">
				<Skeleton className="h-10 w-10 mt-1" />
				<div className="space-y-1">
					<Skeleton className="h-9 w-44" />
					<Skeleton className="h-5 w-80" />
				</div>
			</div>
			<div className="max-w-2xl space-y-6">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-36" />
						<Skeleton className="h-4 w-64 mt-1" />
					</CardHeader>
					<CardContent className="space-y-5">
						<div className="space-y-2">
							<Skeleton className="h-4 w-12" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-10 w-full" />
						</div>
					</CardContent>
				</Card>
				<div className="flex items-center justify-end gap-3">
					<Skeleton className="h-10 w-20" />
					<Skeleton className="h-10 w-36" />
				</div>
			</div>
		</div>
	);
}

export async function clientLoader({ params }: { params: { id?: string } }) {
	const webhook = await getWebhook(requireWebhookId(params));
	return { webhook };
}

export async function clientAction({
	request,
	params,
}: {
	request: Request;
	params: { id?: string };
}) {
	const webhookId = requireWebhookId(params);
	const formData = await request.formData();
	const result = editWebhookSchema.safeParse({
		name: formData.get("name"),
		url: formData.get("url"),
	});

	if (!result.success) {
		return { ok: false, error: result.error.issues[0]?.message };
	}

	await updateWebhook(webhookId, result.data);
	return redirect(`/webhooks/${webhookId}`);
}

export default function EditWebhook({
	loaderData,
}: {
	loaderData: { webhook: Webhook };
}) {
	return <EditWebhookPage webhook={loaderData.webhook} />;
}
