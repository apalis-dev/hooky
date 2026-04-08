
import { useState } from "react"
import { LogsFilter } from "../logs-filter"
import { LogsList } from "../logs-list"

export function LogsPage() {
  const [logLevel, setLogLevel] = useState("all")

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Logs</h1>
        <p className="text-muted-foreground">View system events and error logs</p>
      </div>

      <LogsFilter logLevel={logLevel} onLogLevelChange={setLogLevel} />
      <LogsList logLevel={logLevel} />
    </div>
  )
}
