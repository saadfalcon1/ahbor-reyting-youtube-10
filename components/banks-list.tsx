"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import type { insuranceData } from "@/lib/data"

interface BanksListProps {
  data: typeof insuranceData
  onBankClick: (bank: (typeof insuranceData)[0]) => void
}

export function BanksList({ data, onBankClick }: BanksListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = data.filter(
    (bank) =>
      bank.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Kanal nomi</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Username</th>
              <th className="text-right py-3 px-4 text-slate-400 font-semibold">Obunachilar soni</th>
              <th className="text-right py-3 px-4 text-slate-400 font-semibold">Har bir post uchun o'rtacha like</th>
              <th className="text-right py-3 px-4 text-slate-400 font-semibold">Faollik darajasi</th>
              <th className="text-center py-3 px-4 text-slate-400 font-semibold">Batafsil ma'lumot</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((bank) => (
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
