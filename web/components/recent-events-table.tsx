"use client"

const recentEvents = [
  {
    id: 1,
    event: "user.created",
    status: "success",
    timestamp: "2025-12-08 14:32:00",
    duration: "145ms",
    endpoint: "https://api.example.com/webhooks",
    attempts: 1,
  },
  {
    id: 2,
    event: "order.completed",
    status: "success",
    timestamp: "2025-12-08 14:31:15",
    duration: "234ms",
    endpoint: "https://api.example.com/orders",
    attempts: 1,
  },
  {
    id: 3,
    event: "payment.failed",
    status: "failed",
    timestamp: "2025-12-08 14:28:42",
    duration: "156ms",
    endpoint: "https://payment.example.com/webhook",
    attempts: 3,
  },
  {
    id: 4,
    event: "user.updated",
    status: "success",
    timestamp: "2025-12-08 14:25:00",
    duration: "89ms",
    endpoint: "https://api.example.com/webhooks",
    attempts: 1,
  },
  {
    id: 5,
    event: "invoice.generated",
    status: "success",
    timestamp: "2025-12-08 14:22:30",
    duration: "512ms",
    endpoint: "https://billing.example.com/invoice",
    attempts: 2,
  },
]

export function RecentEventsTable() {
  return (
    <div className="space-y-1">
      {recentEvents.map((event, idx) => (
        <div
          key={event.id}
          className={`flex items-center justify-between p-4 text-sm ${
            idx % 2 === 0 ? "bg-muted/30" : ""
          } hover:bg-muted/50 transition-colors rounded`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                event.status === "success" ? "bg-success" : "bg-destructive"
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground truncate">{event.event}</p>
              <p className="text-xs text-muted-foreground">{event.endpoint}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4 text-right">
            <div className="hidden sm:block text-xs text-muted-foreground">
              {event.attempts} {event.attempts === 1 ? "attempt" : "attempts"}
            </div>
            <div className="text-right">
              <span
                className={`text-xs font-medium ${event.status === "success" ? "text-success" : "text-destructive"}`}
              >
                {event.status === "success" ? "✓" : "✗"} {event.duration}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
