"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { insuranceData } from "@/lib/data"

interface EngagementChartProps {
  data: typeof insuranceData
  onBankClick: (bank: (typeof insuranceData)[0]) => void
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-slate-900 border border-slate-600 rounded-lg p-3">
        <p className="text-slate-100 font-semibold">{data.bank.company_name}</p>
        <p className="text-cyan-400">O'rtacha yoqtirishlar soni: {data.likes.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export function EngagementChart({ data, onBankClick }: EngagementChartProps) {
  const topBanks = [...data].sort((a, b) => (b.avg_likes_per_video ?? 0) - (a.avg_likes_per_video ?? 0)).slice(0, 10)

  const chartData = topBanks.map((bank, index) => ({
    name: (index + 1).toString(),
    likes: bank.avg_likes_per_video ?? 0,
    bank,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} />

        <Bar dataKey="likes" fill="#06b6d4" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
