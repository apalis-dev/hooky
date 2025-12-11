"use client"

import { MoreVertical, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

const webhooks = [
  {
    id: 1,
    name: "User Events",
    url: "https://api.example.com/webhooks/users",
    status: "active",
    createdAt: "2025-11-15",
  },
  {
    id: 2,
    name: "Payment Notifications",
    url: "https://billing.example.com/events",
    status: "active",
    createdAt: "2025-11-10",
  },
  {
    id: 3,
    name: "Analytics Events",
    url: "https://analytics.example.com/track",
    status: "disabled",
    createdAt: "2025-10-28",
  },
  {
    id: 4,
    name: "Order Updates",
    url: "https://orders.example.com/webhooks",
    status: "active",
    createdAt: "2025-10-20",
  },
]

export function WebhookTable() {
  const [openMenu, setOpenMenu] = useState<number | null>(null)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-6 py-3 text-left font-semibold text-foreground">Name</th>
            <th className="px-6 py-3 text-left font-semibold text-foreground">Target URL</th>
            <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
            <th className="px-6 py-3 text-left font-semibold text-foreground">Created At</th>
            <th className="px-6 py-3 text-right font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {webhooks.map((webhook, idx) => (
            <tr
              key={webhook.id}
              className={`border-b border-border hover:bg-muted/30 transition-colors ${
                idx % 2 === 0 ? "bg-muted/10" : ""
              }`}
            >
              <td className="px-6 py-4 font-medium text-foreground">{webhook.name}</td>
              <td className="px-6 py-4 text-muted-foreground truncate max-w-xs">{webhook.url}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    webhook.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200"
                  }`}
                >
                  {webhook.status === "active" ? "● " : "○ "}
                  {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-muted-foreground">{webhook.createdAt}</td>
              <td className="px-6 py-4 text-right relative">
                <button
                  onClick={() => setOpenMenu(openMenu === webhook.id ? null : webhook.id)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
                {openMenu === webhook.id && (
                  <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 z-10">
                    <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted text-sm text-foreground">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted text-sm text-destructive">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
