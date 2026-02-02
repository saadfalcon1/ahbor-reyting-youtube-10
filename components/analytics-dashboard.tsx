"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FollowersChart } from "./charts/followers-chart"
import { EngagementChart } from "./charts/engagement-chart"
import { PostingFrequencyChart } from "./charts/posting-frequency-chart"
import { BanksList } from "./banks-list"
import { INSURANCE_BY_MONTH } from "@/lib/monthly-data"

// Sug'urta kompaniyasi ma'lumotlari tipi
export interface InsuranceCompany {
  company_name: string
  subscribers?: number
  followers?: number
  avg_views_per_video?: number
  avg_likes_per_video?: number
  avg_views_per_post?: number
  avg_likes_per_post?: number
  avg_likes?: number
}

type MonthKey = keyof typeof INSURANCE_BY_MONTH
type MonthData = InsuranceCompany[]

interface AnalyticsDashboardProps {
  onBankClick: (company: InsuranceCompany) => void
}

const MONTHS: { key: MonthKey; label: string }[] = [
  { key: "nov", label: "Noyabr" },
  { key: "dec", label: "Dekabr" },
  { key: "jan", label: "Yanvar" },
]

export function AnalyticsDashboard({ onBankClick }: AnalyticsDashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>("jan")

  const currentMonthData: MonthData = (INSURANCE_BY_MONTH[selectedMonth] ?? []) as MonthData

  const stats = useMemo(() => {
    if (!currentMonthData.length) {
      return {
        totalFollowers: 0,
        avgEngagementRate: "0.00",
        avgLikes: "0.0",
        topCompany: null as InsuranceCompany | null,
        followersDiff: 0,
      }
    }

    const totalFollowers = currentMonthData.reduce((sum, company) => {
      const subs = company.subscribers ?? company.followers ?? 0
      return sum + subs
    }, 0)

    const engagementRates = currentMonthData.map((c) => {
      const views = c.avg_views_per_video ?? c.avg_views_per_post ?? 0
      const likes = c.avg_likes_per_video ?? c.avg_likes_per_post ?? 0
      return views > 0 ? (likes / views) * 100 : 0
    })

    const avgEngagementRate = (
      engagementRates.reduce((a, b) => a + b, 0) / (engagementRates.length || 1)
    ).toFixed(2)

    const avgLikes = (
      currentMonthData.reduce(
        (sum, company) => sum + (company.avg_likes_per_video ?? company.avg_likes_per_post ?? company.avg_likes ?? 0),
        0,
      ) / (currentMonthData.length || 1)
    ).toFixed(1)

    const topCompany = currentMonthData.reduce((prev, current) => {
      const prevSubs = prev.subscribers ?? prev.followers ?? 0
      const currSubs = current.subscribers ?? current.followers ?? 0
      return currSubs > prevSubs ? current : prev
    })

    let followersDiff = 0

    if (selectedMonth === "dec") {
      const novData = (INSURANCE_BY_MONTH["nov"] ?? []) as MonthData
      const novTotalFollowers = novData.reduce((sum, company) => {
        const subs = company.subscribers ?? company.followers ?? 0
        return sum + subs
      }, 0)
      followersDiff = totalFollowers - novTotalFollowers
    } else if (selectedMonth === "jan") {
      const decData = (INSURANCE_BY_MONTH["dec"] ?? []) as MonthData
      const decTotalFollowers = decData.reduce((sum, company) => {
        const subs = company.subscribers ?? company.followers ?? 0
        return sum + subs
      }, 0)
      followersDiff = totalFollowers - decTotalFollowers
    }

    return { totalFollowers, avgEngagementRate, avgLikes, topCompany, followersDiff }
  }, [currentMonthData, selectedMonth])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
                alt="YouTube"
                className="h-10 md:h-12 w-auto shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 break-words">
                  Sug'urta kompaniyalarining YouTubedagi faoliyati va ko'rsatkichlari
                </h1>
                <p className="text-slate-400 text-sm">Yangilangan sana: 31-dekabr 2025-yil</p>
              </div>
              <img src="/Ahborlogo.png" alt="Ahbor logo" className="h-8 sm:hidden w-auto object-contain shrink-0" />
            </div>

            <img
              src="/Ahborlogo.png"
              alt="Ahbor logo"
              className="hidden sm:block h-16 md:h-20 w-auto object-contain max-w-[160px] shrink-0"
            />
          </div>
        </div>

        {/* Oy filteri */}
        <div className="flex gap-2 mb-6">
          {MONTHS.map((month) => (
            <button
              key={month.key}
              onClick={() => setSelectedMonth(month.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  selectedMonth === month.key
                    ? "bg-red-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
            >
              {month.label}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        {stats.topCompany && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              label="Jami obunachilar"
              value={stats.totalFollowers.toLocaleString()}
              icon="👥"
            />
            <MetricCard
              label="Obunachilar o‘sishi (oylik)"
              value={stats.followersDiff.toLocaleString()}
              icon="📊"
            />
            <MetricCard
              label="Har bir nashr uchun o'rtacha yoqtirishlar soni"
              value={stats.avgLikes}
              icon="❤️"
            />
            <MetricCard
              label="Eng ko'p obunachilarga ega sug'urta kompaniyasi"
              value={stats.topCompany.company_name}
              icon="🏆"
              subtitle={`${(stats.topCompany.subscribers ?? stats.topCompany.followers ?? 0).toLocaleString()} obunachi`}
            />
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Eng ko'p obunachilarga ega top-10 sug'urta kompaniyalari</CardTitle>
              <CardDescription>YouTubeda eng katta auditoriyaga ega sug'urta kompaniyalari</CardDescription>
            </CardHeader>
            <CardContent>
              <FollowersChart data={currentMonthData} onBankClick={onBankClick} />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">O'rtacha yoqtirishlar soni</CardTitle>
              <CardDescription>Har bir nashr uchun o'rtacha yoqtirishlar soni</CardDescription>
            </CardHeader>
            <CardContent>
              <EngagementChart data={currentMonthData} onBankClick={onBankClick} />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">O'rtacha nashrlar soni</CardTitle>
              <CardDescription>Har bir kompaniya tomonidan bir oyda joylashtirilgan nashrlar soni</CardDescription>
            </CardHeader>
            <CardContent>
              <PostingFrequencyChart data={currentMonthData} onBankClick={onBankClick} />
            </CardContent>
          </Card>
        </div>

        {/* Insurance Companies List */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Barcha sug'urta kanallari</CardTitle>
            <CardDescription>Kanal ma'lumotlari ro'yxat ko'rinishida</CardDescription>
          </CardHeader>
          <CardContent>
            <BanksList data={currentMonthData} onBankClick={onBankClick} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string
  icon: string
  subtitle?: string
}

function MetricCard({ label, value, icon, subtitle }: MetricCardProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}