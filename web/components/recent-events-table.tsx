import { Inbox } from "lucide-react";
import type { Event } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router";

interface RecentEventsTableProps {
  events: Event[];
}

export function RecentEventsTable({ events }: RecentEventsTableProps) {
  const navigate = useNavigate();
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Inbox
          className="h-10 w-10 text-muted-foreground/40 mb-3"
          strokeWidth={1.5}
        />
        <h3 className="text-sm font-medium text-foreground">
          No recent events
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Events will appear here as they occur.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="text-xs text-muted-foreground font-normal">
              Event
            </TableHead>
            <TableHead className="text-xs text-muted-foreground font-normal">
              Endpoint
            </TableHead>
            <TableHead className="text-xs text-muted-foreground font-normal">
              Attempts
            </TableHead>
            <TableHead className="text-xs text-muted-foreground font-normal">
              Duration
            </TableHead>
            <TableHead className="text-xs text-muted-foreground font-normal text-right">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {events.map((event) => (
            <TableRow
              onClick={() => navigate(`/events/${event.id}`)}
              key={event.id}
              className="border-b last:border-0 hover:bg-muted/40 transition-colors"
            >
              <TableCell className="py-3">
                <span className="font-mono text-xs">
                  {event.event_type_id.slice(0, 12)}...
                </span>
              </TableCell>

              <TableCell className="py-3 max-w-xs truncate text-muted-foreground font-mono text-xs">
                {event.webhook_id.slice(0, 12)}...
              </TableCell>

              <TableCell className="py-3 text-muted-foreground tabular-nums">
                {event.attempts}
              </TableCell>

              <TableCell className="py-3 text-muted-foreground tabular-nums">
                {event.duration_ms}ms
              </TableCell>

              <TableCell className="py-3 text-right">
                <div className="flex items-center justify-end gap-2 text-sm">
                  <span
                    className={
                      event.status === "success"
                        ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                        : "h-1.5 w-1.5 rounded-full bg-red-500"
                    }
                  />
                  <span
                    className={
                      event.status === "success"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }
                  >
                    {event.status}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
