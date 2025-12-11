"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const healthData = [
  { name: "Mon", healthy: 22, degraded: 0, failing: 0 },
  { name: "Tue", healthy: 21, degraded: 1, failing: 0 },
  { name: "Wed", healthy: 22, degraded: 0, failing: 0 },
  { name: "Thu", healthy: 20, degraded: 2, failing: 0 },
  { name: "Fri", healthy: 22, degraded: 0, failing: 0 },
  { name: "Sat", healthy: 22, degraded: 0, failing: 0 },
  { name: "Sun", healthy: 22, degraded: 0, failing: 0 },
]

export function EndpointHealthChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={healthData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="healthy" fill="hsl(var(--color-success))" />
        <Bar dataKey="degraded" fill="hsl(var(--color-warning))" />
        <Bar dataKey="failing" fill="hsl(var(--color-destructive))" />
      </BarChart>
    </ResponsiveContainer>
  )
}
