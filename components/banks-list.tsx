"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import type { insuranceData } from "@/lib/data"

interface BanksListProps {
  data: typeof insuranceData
  onBankClick: (bank: (typeof insuranceData)[0]) => void
}

// Saralash uchun ustun kalitlari
type SortKey = "company_name" | "subscribers" | "avg_likes_per_video" | "engagement"

export function BanksList({ data, onBankClick }: BanksListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("subscribers")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // 🔍 Qidiruv
  const filteredData = data.filter(
    (bank) =>
      bank.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 🔽 Saralash
  const sortedData = [...filteredData].sort((a, b) => {
    let valA: any
    let valB: any

    switch (sortKey) {
      case "company_name":
        valA = a.company_name
        valB = b.company_name
        break
      case "subscribers":
        valA = a.subscribers ?? 0
        valB = b.subscribers ?? 0
        break
      case "avg_likes_per_video":
        valA = a.avg_likes_per_video ?? 0
        valB = b.avg_likes_per_video ?? 0
        break
      case "engagement":
        valA = (a.avg_likes_per_video ?? 0) / (a.avg_views_per_video || 1)
        valB = (b.avg_likes_per_video ?? 0) / (b.avg_views_per_video || 1)
        break
    }

    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    return sortOrder === "asc" ? valA - valB : valB - valA
  })

  // 📊 Ustunni bosganda saralashni almashtirish
  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("desc")
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by company name or username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th
                onClick={() => handleSort("company_name")}
                className="text-left py-3 px-4 text-slate-400 font-semibold cursor-pointer hover:text-white"
              >
                Kanal nomi {sortKey === "company_name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Username</th>
              <th
                onClick={() => handleSort("subscribers")}
                className="text-right py-3 px-4 text-slate-400 font-semibold cursor-pointer hover:text-white"
              >
                Obunachilar soni {sortKey === "subscribers" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("avg_likes_per_video")}
                className="text-right py-3 px-4 text-slate-400 font-semibold cursor-pointer hover:text-white"
              >
                O‘rtacha like {sortKey === "avg_likes_per_video" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("engagement")}
                className="text-right py-3 px-4 text-slate-400 font-semibold cursor-pointer hover:text-white"
              >
                Faollik darajasi {sortKey === "engagement" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="text-center py-3 px-4 text-slate-400 font-semibold">Batafsil ma'lumot</th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((bank) => (
              <tr
                key={bank.username}
                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer"
                onClick={() => onBankClick(bank)}
              >
                <td className="py-3 px-4 text-white font-medium">{bank.company_name}</td>
                <td className="py-3 px-4 text-slate-400">{bank.username}</td>
                <td className="py-3 px-4 text-right text-white">{(bank.subscribers ?? 0).toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-slate-300">{(bank.avg_likes_per_video ?? 0).toFixed(1)}</td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-block bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                    {(((bank.avg_likes_per_video ?? 0) / (bank.avg_views_per_video || 1)) * 100).toFixed(2)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button className="text-blue-400 hover:text-blue-300 font-medium text-xs">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
