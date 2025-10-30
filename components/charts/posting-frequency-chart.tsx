"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { insuranceData } from "@/lib/data"

interface PostingFrequencyChartProps {
  data: typeof insuranceData
  onBankClick: (bank: (typeof insuranceData)[0]) => void
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { bank, frequency } = payload[0].payload
    return (
      <div className="bg-slate-900 border border-slate-600 rounded-lg p-2">
        <p className="text-slate-100 font-semibold">{bank.company_name}</p>
        <p className="text-amber-400">Nashrlar soni: {frequency.toFixed(1)}</p>
      </div>
    )
  }
  return null
}

export function PostingFrequencyChart({ data, onBankClick }: PostingFrequencyChartProps) {
  const topBanks = [...data].sort((a, b) => (b.avg_posts_per_month ?? 0) - (a.avg_posts_per_month ?? 0)).slice(0, 10)

  const chartData = topBanks.map((bank, index) => ({
    name: (index + 1).toString(),
    frequency: bank.avg_posts_per_month ?? 0,
    bank,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(245, 158, 11, 0.1)" }} />
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
