"use client"

import { Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function TopNav({ onToggleSidebar }: { onToggleSidebar: (open: boolean) => void }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <button
        onClick={() => onToggleSidebar((prev) => !prev)}
        className="hidden sm:inline-flex p-1.5 hover:bg-muted rounded-lg transition-colors"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {mounted && (
          <button onClick={toggleTheme} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </button>
        )}
        <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold">
          A
        </div>
      </div>
    </div>
  )
}
