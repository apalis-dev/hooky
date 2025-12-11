"use client"

import { X } from "lucide-react"

interface DeliveryDrawerProps {
  delivery: any
  onClose: () => void
}

export function DeliveryDrawer({ delivery, onClose }: DeliveryDrawerProps) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-screen w-full max-w-md bg-card border-l border-border shadow-lg overflow-y-auto">
        <div className="sticky top-0 border-b border-border p-6 flex items-center justify-between bg-card">
          <h2 className="text-lg font-semibold text-foreground">Delivery Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Event Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Event Name</p>
                <p className="text-foreground font-medium">{delivery.event}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status Code</p>
                <p className="text-foreground font-medium">{delivery.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="text-foreground font-medium">{delivery.duration}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Timestamp</p>
                <p className="text-foreground font-medium">{delivery.timestamp}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Request Payload</h3>
            <pre className="bg-input border border-border rounded p-3 text-xs overflow-x-auto text-muted-foreground">
              {`{
  "id": "evt_123456",
  "event": "${delivery.event}",
  "timestamp": "${delivery.timestamp}",
  "data": {
    "userId": "user_789",
    "email": "user@example.com"
  }
}`}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Response Payload</h3>
            <pre className="bg-input border border-border rounded p-3 text-xs overflow-x-auto text-muted-foreground">
              {`{
  "received": true,
  "id": "evt_123456"
}`}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Retries</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 p-3 bg-input rounded border border-border">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <div>
                  <p className="text-foreground font-medium">Attempt 1 - Success</p>
                  <p className="text-xs text-muted-foreground">2025-12-08 14:32:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
