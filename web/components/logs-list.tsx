import { FileText } from "lucide-react";
import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LogWithWebhook } from "@/lib/types";

const levelDot: Record<string, string> = {
  trace: "bg-sky-500/80",
  debug: "bg-blue-500/80",
  info: "bg-muted-foreground/70",
  warn: "bg-yellow-500/80",
  error: "bg-red-500/80",
};

const levelText: Record<string, string> = {
  trace: "text-sky-500",
  debug: "text-blue-500",
  info: "text-muted-foreground",
  warn: "text-yellow-500",
  error: "text-red-500",
};

interface LogsListProps {
  logs: LogWithWebhook[];
}

function truncate(value: string, maxLength = 28) {
  return value.length > maxLength
    ? `${value.slice(0, maxLength - 1)}...`
    : value;
}

export function LogsList({ logs }: LogsListProps) {
  if (logs.length === 0) {
    return (
      <Card className="w-full rounded-2xl border">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 rounded-full border bg-muted/30 p-3">
            <FileText
              className="h-6 w-6 text-muted-foreground/50"
              strokeWidth={1.75}
            />
          </div>

          <h3 className="text-sm font-medium text-foreground">No logs yet</h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Webhook activity and system events will appear here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden rounded-2xl border">
      <ScrollArea className="h-fit">
        <Table className="w-full text-sm">
          <TableHeader className="sr-only" />

          <TableBody>
            {logs.map((log) => (
              <TableRow
                key={log.id}
                className="group border-border/60 transition-colors hover:bg-muted/35"
              >
                <TableCell className="w-4 py-3 pl-4 pr-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      levelDot[log.level] ?? "bg-muted-foreground/70"
                    }`}
                  />
                </TableCell>

                <TableCell className="w-[125px] max-w-[125px] py-3 text-xs text-muted-foreground/70">
                  <span className="block truncate" title={log.timestamp}>
                    {log.timestamp}
                  </span>
                </TableCell>

                <TableCell className="w-[170px] max-w-[170px] py-3">
                  {log.webhook_id && log.webhook_name ? (
                    <Link
                      to={`/webhooks/${log.webhook_id}`}
                      title={log.webhook_name}
                      className="block truncate text-sm font-medium text-foreground hover:underline"
                    >
                      {truncate(log.webhook_name)}
                    </Link>
                  ) : (
                    <span className="block truncate text-sm font-medium text-foreground">
                      System
                    </span>
                  )}
                </TableCell>

                <TableCell className="w-[210px] max-w-[210px] py-3 font-mono text-xs text-muted-foreground/70">
                  <span className="block truncate" title={log.target}>
                    {log.target}
                  </span>
                </TableCell>

                <TableCell className="w-[68px] py-3">
                  <span
                    className={`rounded-md bg-muted px-1.5 py-0.5 ${levelText[log.level]} font-mono text-[10px] uppercase tracking-wide`}
                  >
                    {log.level}
                  </span>
                </TableCell>

                <TableCell className="max-w-0 py-3 pr-4 text-sm text-foreground">
                  <span className="block truncate" title={log.message}>
                    {log.message}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
