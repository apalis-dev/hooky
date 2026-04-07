
import { X } from "lucide-react"
import { useState } from "react"

interface CreateWebhookModalProps {
  onClose: () => void
}

export function CreateWebhookModal({ onClose }: CreateWebhookModalProps) {
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])

  const events = [
    "user.created",
    "user.updated",
    "user.deleted",
    "order.created",
    "order.completed",
    "payment.processed",
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 border-b border-border p-6 flex items-center justify-between bg-card">
          <h2 className="text-lg font-semibold text-foreground">Create Webhook</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Webhook"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Target URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/webhooks"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Events to Subscribe</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {events.map((event) => (
                <label key={event} className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEvents([...selectedEvents, event])
                      } else {
                        setSelectedEvents(selectedEvents.filter((e) => e !== event))
                      }
                    }}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-foreground">{event}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-6 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Create Webhook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
