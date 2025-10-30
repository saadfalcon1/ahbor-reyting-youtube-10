"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { insuranceData } from "@/lib/data"

interface EngagementRateChartProps {
  data: typeof insuranceData
  onBankClick: (bank: (typeof insuranceData)[0]) => void
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-slate-900 border border-slate-600 rounded-lg p-3">
        <p className="text-slate-100 font-semibold">{data.bank.company_name}</p>
        <p className="text-emerald-400">Engagement Rate: {data.rate.toFixed(2)}%</p>
      </div>
    )
  }
  return null
}

export function EngagementRateChart({ data, onBankClick }: EngagementRateChartProps) {
  const withRates = data.map((b) => {
    const views = b.avg_views_per_video ?? 0
    const likes = b.avg_likes_per_video ?? 0
    const rate = views > 0 ? (likes / views) * 100 : 0
    return { ...b, __rate: rate }
  })
  const sortedData = withRates.sort((a, b) => (b.__rate ?? 0) - (a.__rate ?? 0)).slice(0, 12)

  const chartData = sortedData.map((bank, index) => ({
    name: (index + 1).toString(),
    rate: bank.__rate ?? 0,
    bank,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: "#10b981", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
