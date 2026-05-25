import { FileText } from "lucide-react";
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

function truncate(value: string, maxLength = 32) {
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
                <TableCell className="w-4 py-4 pl-4 pr-2 align-top">
                  <span
                    className={`mt-1.5 inline-block h-2 w-2 rounded-full ${
                      levelDot[log.level] ?? "bg-muted-foreground/70"
                    }`}
                  />
                </TableCell>

                <TableCell className="w-[125px] py-4 align-top text-xs text-muted-foreground/70">
                  {log.timestamp}
                </TableCell>

                <TableCell className="w-[220px] py-4 align-top">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-sm font-medium text-foreground">
                      {log.webhook_name ? truncate(log.webhook_name) : "System"}
                    </span>

                    <span className="truncate font-mono text-xs text-muted-foreground/70">
                      {log.target}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-4 pr-4 align-top">
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <p className="text-sm leading-5 text-foreground">
                      {log.message}
                    </p>

                    <span
                      className={`w-fit rounded-md bg-muted px-1.5 py-0.5 ${levelText[log.level]} font-mono text-[10px] uppercase tracking-wide`}
                    >
                      {log.level}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
