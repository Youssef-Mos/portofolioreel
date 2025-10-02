// src/components/admin/AppointmentsStats.tsx
"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface Stats {
  total: number
  pending: number
  confirmed: number
  upcoming: number
}

export function AppointmentsStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/appointments/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Rendez-vous
        </h3>
        <Link
          href="/admin/appointments"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Voir tout
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* En attente */}
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-800">
              {stats.pending}
            </span>
          </div>
          <p className="text-sm text-yellow-700 font-medium">En attente</p>
        </div>

        {/* Confirmés */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-green-800">
              {stats.confirmed}
            </span>
          </div>
          <p className="text-sm text-green-700 font-medium">Confirmés</p>
        </div>

        {/* À venir */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">
                Prochains rendez-vous
              </span>
            </div>
            <span className="text-2xl font-bold text-blue-800">
              {stats.upcoming}
            </span>
          </div>
        </div>
      </div>

      {stats.pending > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>{stats.pending}</strong> demande{stats.pending > 1 ? "s" : ""} en attente de confirmation
          </p>
        </div>
      )}
    </div>
  )
}