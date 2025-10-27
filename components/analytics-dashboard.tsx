"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FollowersChart } from "./charts/followers-chart"
import { EngagementChart } from "./charts/engagement-chart"
import { EngagementRateChart } from "./charts/engagement-rate-chart"
import { PostingFrequencyChart } from "./charts/posting-frequency-chart"
import { BanksList } from "./banks-list"
import { insuranceData } from "@/lib/data"

interface AnalyticsDashboardProps {
  onBankClick: (bank: (typeof insuranceData)[0]) => void
}

export function AnalyticsDashboard({ onBankClick }: AnalyticsDashboardProps) {
  const stats = useMemo(() => {
    const totalFollowers = insuranceData.reduce((sum, bank) => sum + (bank.subscribers ?? 0), 0)

    const engagementRates = insuranceData.map((b) => {
      const views = b.avg_views_per_video ?? 0
      const likes = b.avg_likes_per_video ?? 0
      return views > 0 ? (likes / views) * 100 : 0
    })
    const avgEngagementRate = (
      engagementRates.reduce((a, b) => a + b, 0) / (engagementRates.length || 1)
    ).toFixed(2)

    const avgLikes = (
      insuranceData.reduce((sum, bank) => sum + (bank.avg_likes_per_video ?? 0), 0) /
      (insuranceData.length || 1)
    ).toFixed(1)

    const topBank = insuranceData.reduce((prev, current) =>
      (current.subscribers ?? 0) > (prev.subscribers ?? 0) ? current : prev
    )

    return { totalFollowers, avgEngagementRate, avgLikes, topBank }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Insurance Analytics</h1>
          <p className="text-slate-400">Social media performance metrics for Uzbekistan insurance companies</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Total Followers" value={stats.totalFollowers.toLocaleString()} icon="👥" />
          <MetricCard label="Avg Engagement Rate" value={`${stats.avgEngagementRate}%`} icon="📊" />
          <MetricCard label="Avg Likes per Post" value={stats.avgLikes} icon="❤️" />
          <MetricCard
            label="Top Bank"
            value={stats.topBank.company_name}
            icon="🏆"
            subtitle={`${(stats.topBank.subscribers ?? 0).toLocaleString()} followers`}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Top Banks by Followers</CardTitle>
              <CardDescription>Leading insurance companies by social media reach</CardDescription>
            </CardHeader>
            <CardContent>
              <FollowersChart data={insuranceData} onBankClick={onBankClick} />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Engagement Metrics</CardTitle>
              <CardDescription>Average likes and comments per post</CardDescription>
            </CardHeader>
            <CardContent>
              <EngagementChart data={insuranceData} onBankClick={onBankClick} />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Engagement Rate Trend</CardTitle>
              <CardDescription>Performance distribution across companies</CardDescription>
            </CardHeader>
            <CardContent>
              <EngagementRateChart data={insuranceData} onBankClick={onBankClick} />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Posting Frequency</CardTitle>
              <CardDescription>Average posts per month by company</CardDescription>
            </CardHeader>
            <CardContent>
              <PostingFrequencyChart data={insuranceData} onBankClick={onBankClick} />
            </CardContent>
          </Card>
        </div>

        {/* Banks List */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">All Insurance Companies</CardTitle>
            <CardDescription>Click on any company to view detailed information</CardDescription>
          </CardHeader>
          <CardContent>
            <BanksList data={insuranceData} onBankClick={onBankClick} />
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
