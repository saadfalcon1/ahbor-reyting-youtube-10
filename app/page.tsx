"use client"

import { useState } from "react"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { BankDetailsModal } from "@/components/bank-details-modal"
import type { insuranceData } from "@/lib/data"

export default function Home() {
  const [selectedBank, setSelectedBank] = useState<(typeof insuranceData)[0] | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <AnalyticsDashboard onBankClick={setSelectedBank} />
      {selectedBank && <BankDetailsModal bank={selectedBank} onClose={() => setSelectedBank(null)} />}
    </main>
  )
}
