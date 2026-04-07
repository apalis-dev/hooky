
const deliveries = [
  {
    id: 1,
    event: "user.created",
    status: 200,
    duration: "145ms",
    timestamp: "2025-12-08 14:32:00",
    success: true,
  },
  {
    id: 2,
    event: "order.completed",
    status: 200,
    duration: "234ms",
    timestamp: "2025-12-08 14:31:15",
    success: true,
  },
  {
    id: 3,
    event: "payment.failed",
    status: 500,
    duration: "156ms",
    timestamp: "2025-12-08 14:28:42",
    success: false,
  },
  {
    id: 4,
    event: "user.updated",
    status: 200,
    duration: "89ms",
    timestamp: "2025-12-08 14:25:00",
    success: true,
  },
  {
    id: 5,
    event: "invoice.generated",
    status: 202,
    duration: "512ms",
    timestamp: "2025-12-08 14:22:30",
    success: true,
  },
]

interface DeliveriesTableProps {
  onRowClick: (delivery: any) => void
}

export function DeliveriesTable({ onRowClick }: DeliveriesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-6 py-3 text-left font-semibold text-foreground">Event</th>
            <th className="px-6 py-3 text-left font-semibold text-foreground">HTTP Status</th>
            <th className="px-6 py-3 text-left font-semibold text-foreground">Duration</th>
            <th className="px-6 py-3 text-left font-semibold text-foreground">Timestamp</th>
            <th className="px-6 py-3 text-right font-semibold text-foreground">Result</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery, idx) => (
            <tr
              key={delivery.id}
              onClick={() => onRowClick(delivery)}
              className={`border-b border-border hover:bg-muted/30 transition-colors cursor-pointer ${
                idx % 2 === 0 ? "bg-muted/10" : ""
              }`}
            >
              <td className="px-6 py-4 font-medium text-foreground">{delivery.event}</td>
              <td className="px-6 py-4">
                <code className="bg-input px-2 py-1 rounded text-xs font-mono text-foreground">{delivery.status}</code>
              </td>
              <td className="px-6 py-4 text-muted-foreground">{delivery.duration}</td>
              <td className="px-6 py-4 text-muted-foreground">{delivery.timestamp}</td>
              <td className="px-6 py-4 text-right">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium ${
                    delivery.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {delivery.success ? "✓ Success" : "✗ Failed"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
