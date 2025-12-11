"use client"

import { Activity, Bolt, Clock, FileText, Settings, X } from "lucide-react"

const navItems = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "webhooks", label: "Webhooks", icon: Bolt },
  { id: "deliveries", label: "Deliveries", icon: Clock },
  { id: "logs", label: "Logs", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
]

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  isOpen: boolean
  onToggle: (open: boolean) => void
}

export function Sidebar({ currentPage, onPageChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 sm:hidden ${isOpen ? "" : "hidden"}`}
        onClick={() => onToggle(false)}
      />

      <aside
        className={`fixed sm:static inset-y-0 left-0 w-64 border-r border-border bg-sidebar transform transition-transform duration-300 z-50 sm:z-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h1 className="text-lg font-semibold text-sidebar-foreground">Webhooks</h1>
          <button
            onClick={() => onToggle(false)}
            className="sm:hidden p-1 hover:bg-sidebar-accent rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id)
                  onToggle(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
