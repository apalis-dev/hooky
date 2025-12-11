"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { WebhookTable } from "../webhook-table"
import { CreateWebhookModal } from "../modals/create-webhook-modal"

export function WebhooksPage() {
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Hooky</h1>
        <p className="text-muted-foreground">Easily create, monitor, and manage your webhooks</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search webhooks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder-muted-foreground"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Webhook
        </button>
      </div>
      <div className="flex gap-2">
        {["all", "active", "disabled"].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === filter
                ? "bg-accent text-accent-foreground"
                : "bg-card border border-border text-foreground hover:bg-muted"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <WebhookTable />
      </div>

      {showModal && <CreateWebhookModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
