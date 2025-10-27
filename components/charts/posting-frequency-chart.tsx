"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { insuranceData } from "@/lib/data"

interface PostingFrequencyChartProps {
  data: typeof insuranceData
  onBankClick: (bank: (typeof insuranceData)[0]) => void
}

export function PostingFrequencyChart({ data, onBankClick }: PostingFrequencyChartProps) {
  const topBanks = [...data]
    .sort((a, b) => (b.avg_posts_per_month ?? 0) - (a.avg_posts_per_month ?? 0))
    .slice(0, 10)

  const chartData = topBanks.map((bank) => ({
    name: bank.company_name.substring(0, 12),
    frequency: bank.avg_posts_per_month ?? 0,
    bank,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
        <YAxis stroke="#94a3b8" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #475569",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#f1f5f9" }}
          cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
        />
        <Bar
          dataKey="frequency"
          fill="#f59e0b"
          onClick={(data) => onBankClick(data.bank)}
          cursor="pointer"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
