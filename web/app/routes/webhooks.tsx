import { getWebhooks, deleteWebhook } from "@/lib/api";
import type { Webhook } from "@/lib/types";
import { WebhooksPage } from "@/components/pages/webhooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export async function clientLoader() {
	const webhooks = await getWebhooks();
	return { webhooks };
}

export async function clientAction({
	request,
}: { request: Request }) {
	const formData = await request.formData();
	const webhookId = Number(formData.get("webhookId"));
	await deleteWebhook(webhookId);
	return { ok: true };
}

export function HydrateFallback() {
	return (
		<div className="p-8 space-y-6">
			<div>
				<Skeleton className="h-9 w-24 mb-2" />
				<Skeleton className="h-5 w-40" />
			</div>
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<Skeleton className="h-10 w-full max-w-md" />
				<Skeleton className="h-10 w-36" />
			</div>
			<Skeleton className="h-10 w-64" />
			<Card className="overflow-hidden">
				<div className="p-4 space-y-3">
					<Skeleton className="h-8 w-full" />
					{["wh-1", "wh-2", "wh-3"].map((id) => (
						<Skeleton key={id} className="h-14 w-full" />
					))}
				</div>
			</Card>
		</div>
	);
}

export default function Webhooks({
	loaderData,
}: {
	loaderData: { webhooks: Webhook[] };
}) {
	return <WebhooksPage webhooks={loaderData.webhooks} />;
}
