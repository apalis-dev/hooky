"use client"

import { Eye, EyeOff, Copy, RotateCw } from "lucide-react"
import { useState } from "react"

export function SettingsPage() {
  const [showSecret, setShowSecret] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState("")

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(""), 2000)
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure webhook behavior and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Signing Settings</h2>
          <p className="text-sm text-muted-foreground">Secure your webhooks with signing keys</p>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">Webhook Secret</label>
            <div className="flex items-center gap-2 bg-input border border-border rounded-lg px-3 py-2">
              <code className="flex-1 text-sm font-mono text-muted-foreground">
                {showSecret ? "whk_secret_abc123xyz" : "••••••••••••••••••••"}
              </code>
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                {showSecret ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium text-foreground">
            <RotateCw className="w-4 h-4" />
            Regenerate Secret
          </button>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
          <p className="text-sm text-muted-foreground">Manage API access credentials</p>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">Primary API Key</label>
            <div className="flex items-center gap-2 bg-input border border-border rounded-lg px-3 py-2">
              <code className="flex-1 text-sm font-mono text-muted-foreground">
                {showApiKey ? "sk_live_51234567890abcdef" : "••••••••••••••••••••"}
              </code>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => handleCopy("sk_live_51234567890abcdef", "apikey")}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {copied === "apikey" && <p className="text-xs text-accent">Copied to clipboard</p>}
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Delivery Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Timeout (seconds)</label>
            <input
              type="number"
              defaultValue="30"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Max Retries</label>
            <input
              type="number"
              defaultValue="3"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
