// src/app/admin/analytics/page.tsx
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard"

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Analyse détaillée de votre portfolio et performances
        </p>
      </div>

      {/* Dashboard */}
      <AnalyticsDashboard />
    </div>
  )
}