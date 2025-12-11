"use client"

import { useState } from "react"
import { DeliveriesTable } from "../deliveries-table"
import { DeliveryDrawer } from "../drawers/delivery-drawer"

export function DeliveriesPage() {
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null)

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Deliveries</h1>
        <p className="text-muted-foreground">View webhook delivery history and attempts</p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <DeliveriesTable onRowClick={setSelectedDelivery} />
      </div>

      {selectedDelivery && <DeliveryDrawer delivery={selectedDelivery} onClose={() => setSelectedDelivery(null)} />}
    </div>
  )
}
