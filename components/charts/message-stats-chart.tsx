"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface MessageStatsChartProps {
  data: Array<{
    date: string
    sent: number
    received: number
    delivered: number
    read: number
  }>
}

export function MessageStatsChart({ data }: MessageStatsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sent" stroke="#3b82f6" name="مرسل" />
        <Line type="monotone" dataKey="received" stroke="#10b981" name="مستقبل" />
        <Line type="monotone" dataKey="delivered" stroke="#f59e0b" name="مسلم" />
        <Line type="monotone" dataKey="read" stroke="#8b5cf6" name="مقروء" />
      </LineChart>
    </ResponsiveContainer>
  )
}
