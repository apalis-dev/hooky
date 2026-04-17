import { getLogs } from "@/lib/api";
import type { Log } from "@/lib/types";
import { LogsPage } from "@/components/pages/logs";
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_LIMIT = 10;

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 0;
  const limit = Number(url.searchParams.get("limit")) || DEFAULT_LIMIT;
  const logs = await getLogs({ page, limit });
  return { logs, page, limit };
}

export function HydrateFallback() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <Skeleton className="h-9 w-20 mb-2" />
        <Skeleton className="h-5 w-56" />
      </div>
      <Skeleton className="h-10 w-64" />
      <div className="space-y-3">
        {["log-1", "log-2", "log-3", "log-4", "log-5"].map((id) => (
          <div key={id} className="flex items-start gap-3">
            <Skeleton className="h-5 w-12 shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Logs({
  loaderData,
}: {
  loaderData: { logs: Log[]; page: number; limit: number };
}) {
  return (
    <LogsPage
      logs={loaderData.logs}
      page={loaderData.page}
      limit={loaderData.limit}
    />
  );
}
