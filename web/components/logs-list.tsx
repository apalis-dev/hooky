
const logs = [
  {
    id: 1,
    level: "info",
    timestamp: "2025-12-08 14:35:22",
    message: "Webhook delivered successfully to user.created endpoint",
  },
  {
    id: 2,
    level: "info",
    timestamp: "2025-12-08 14:32:15",
    message: "New webhook endpoint registered: Payment Notifications",
  },
  {
    id: 3,
    level: "warn",
    timestamp: "2025-12-08 14:28:42",
    message: "Webhook delivery timeout - retrying in 60s",
  },
  {
    id: 4,
    level: "error",
    timestamp: "2025-12-08 14:25:30",
    message: "Failed to deliver webhook after 3 retry attempts",
  },
  {
    id: 5,
    level: "info",
    timestamp: "2025-12-08 14:20:10",
    message: "Webhook endpoint disabled due to repeated failures",
  },
]

interface LogsListProps {
  logLevel: string
}

export function LogsList({ logLevel }: LogsListProps) {
  const filteredLogs = logLevel === "all" ? logs : logs.filter((log) => log.level === logLevel)

  return (
    <div className="bg-card border border-border rounded-lg divide-y divide-border max-h-[600px] overflow-y-auto">
      {filteredLogs.map((log) => (
        <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                log.level === "info" ? "bg-blue-500" : log.level === "warn" ? "bg-yellow-500" : "bg-red-500"
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{log.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
            </div>
            <span
              className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium ${
                log.level === "info"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                  : log.level === "warn"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200"
                    : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
              }`}
            >
              {log.level.toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
