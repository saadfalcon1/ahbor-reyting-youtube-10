"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { insuranceData } from "@/lib/data"
import { X } from "lucide-react"

interface BankDetailsModalProps {
  bank: (typeof insuranceData)[0]
  onClose: () => void
}

export function BankDetailsModal({ bank, onClose }: BankDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900 border-slate-800 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl text-white">{bank.company_name}</CardTitle>
            <CardDescription className="text-slate-400">{bank.username}</CardDescription>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Ijtimoiy tarmoq ko‘rsatkichlari */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <DetailMetric label="Obunachilar soni" value={(bank.subscribers ?? 0).toLocaleString()} />
            <DetailMetric label="Jami videolar" value={(bank.total_videos ?? 0).toString()} />
            <DetailMetric label="Jami ko‘rishlar" value={(bank.total_views ?? 0).toLocaleString()} />
            <DetailMetric label="Har bir video uchun o‘rtacha ko‘rishlar" value={(bank.avg_views_per_video ?? 0).toLocaleString()} />
            <DetailMetric label="Har bir video uchun o‘rtacha yoqtirishlar" value={(bank.avg_likes_per_video ?? 0).toFixed(1)} />
            <DetailMetric label="Oyiga o‘rtacha ko'rishlar soni" value={(bank.avg_views_per_month ?? 0).toString()} />
          </div>

          {/* Jalb qilish tahlili */}
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Jalb qilish tahlili</h3>
            <div className="space-y-3">
              <AnalysisRow label="Jalb qilish darajasi" value={`${(((bank.avg_likes_per_video ?? 0) / (bank.avg_views_per_video || 1)) * 100).toFixed(2)}%`} color="blue" />
              <AnalysisRow label="Oyiga o'rtacha postlar soni" value={(bank.avg_posts_per_month ?? 0).toString()} color="green" />
              <AnalysisRow label="Obunachilar soni" value={`${(((bank.subscribers ?? 0) / 1000).toFixed(1))}K`} color="purple" />
            </div>
          </div>

          {/* Kanal ma’lumotlari */}
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Kanal ma’lumotlari</h3>
            <div className="space-y-2 text-sm">
              <InfoRow label="Kanal yaratilgan sana" value={bank.channel_created_date} />
              <InfoRow label="So‘nggi yangilanish" value={bank.last_updated_date} />
              <InfoRow label="Foydalanuvchi nomi" value={bank.username} />
            </div>
          </div>

          {/* Faoliyat ko‘rsatkichlari */}
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Kanal faoliyati ko‘rsatkichlari</h3>
            <div className="space-y-3">
              <PerformanceBar
                label="Jalb qilish darajasi"
                value={Math.min(100, ((((bank.avg_likes_per_video ?? 0) / (bank.avg_views_per_video || 1)) * 100)))}
                color="from-blue-500 to-cyan-500"
              />
              <PerformanceBar
                label="Kontent faolligi"
                value={Math.min(100, ((bank.avg_posts_per_month ?? 0) / 30) * 100)}
                color="from-green-500 to-emerald-500"
              />
              <PerformanceBar
                label="Auditoriya qamrovi"
                value={Math.min(100, ((bank.subscribers ?? 0) / 2000) * 100)}
                color="from-purple-500 to-pink-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface DetailMetricProps {
  label: string
  value: string
}

function DetailMetric({ label, value }: DetailMetricProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  )
}

interface AnalysisRowProps {
  label: string
  value: string
  color: "blue" | "green" | "purple"
}

function AnalysisRow({ label, value, color }: AnalysisRowProps) {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    purple: "bg-purple-500/20 text-purple-400",
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-300">{label}</span>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClasses[color]}`}>{value}</span>
    </div>
  )
}

interface InfoRowProps {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  )
}

interface PerformanceBarProps {
  label: string
  value: number
  color: string
}

function PerformanceBar({ label, value, color }: PerformanceBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-300 text-sm">{label}</span>
        <span className="text-white font-semibold text-sm">{value.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
