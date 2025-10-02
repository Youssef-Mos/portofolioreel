// src/app/admin/appointments/page.tsx
"use client"

import { useState, useEffect } from "react"
import { 
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  Check,
  X,
  Loader2,
  Search,
  Download,
  Trash2
} from "lucide-react"

interface Appointment {
  id: string
  date: string
  timeSlot: string
  name: string
  email: string
  phone?: string
  message?: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  createdAt: string
}

interface Stats {
  total: number
  pending: number
  confirmed: number
  cancelled: number
  completed: number
  thisMonth: number
  upcoming: number
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED">("ALL")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [appointmentsRes, statsRes] = await Promise.all([
        fetch("/api/admin/appointments"),
        fetch("/api/admin/appointments/stats")
      ])

      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json()
        setAppointments(appointmentsData.appointments || [])
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const deleteAppointment = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) return

    try {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const exportCSV = async () => {
    try {
      const response = await fetch("/api/admin/appointments/export")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `appointments-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente"
      case "CONFIRMED":
        return "Confirmé"
      case "CANCELLED":
        return "Annulé"
      case "COMPLETED":
        return "Terminé"
      default:
        return status
    }
  }

  const filteredAppointments = appointments
    .filter(apt => filter === "ALL" || apt.status === filter)
    .filter(apt => 
      apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rendez-vous</h1>
          <p className="text-gray-600 mt-2">
            Gérez les demandes de rendez-vous
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Exporter CSV
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-lg border-2 border-yellow-200 p-4">
            <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
            <div className="text-sm text-yellow-700">En attente</div>
          </div>
          <div className="bg-green-50 rounded-lg border-2 border-green-200 p-4">
            <div className="text-2xl font-bold text-green-800">{stats.confirmed}</div>
            <div className="text-sm text-green-700">Confirmés</div>
          </div>
          <div className="bg-red-50 rounded-lg border-2 border-red-200 p-4">
            <div className="text-2xl font-bold text-red-800">{stats.cancelled}</div>
            <div className="text-sm text-red-700">Annulés</div>
          </div>
          <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4">
            <div className="text-2xl font-bold text-blue-800">{stats.completed}</div>
            <div className="text-sm text-blue-700">Terminés</div>
          </div>
          <div className="bg-purple-50 rounded-lg border-2 border-purple-200 p-4">
            <div className="text-2xl font-bold text-purple-800">{stats.thisMonth}</div>
            <div className="text-sm text-purple-700">Ce mois</div>
          </div>
          <div className="bg-indigo-50 rounded-lg border-2 border-indigo-200 p-4">
            <div className="text-2xl font-bold text-indigo-800">{stats.upcoming}</div>
            <div className="text-sm text-indigo-700">À venir</div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Filtres statut */}
          <div className="flex gap-2 flex-wrap">
            {(["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "ALL" ? "Tous" : getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des rendez-vous */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Aucun rendez-vous trouvé
          </h3>
          <p className="text-gray-500">
            {searchTerm ? "Essayez une autre recherche" : "Les rendez-vous apparaîtront ici"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Infos principales */}
                <div className="flex-1 space-y-4">
                  {/* Date et heure */}
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {new Date(appointment.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {appointment.timeSlot}
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 font-medium">{appointment.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <a href={`mailto:${appointment.email}`} className="text-blue-600 hover:underline">
                        {appointment.email}
                      </a>
                    </div>
                    {appointment.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <a href={`tel:${appointment.phone}`} className="text-blue-600 hover:underline">
                          {appointment.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  {appointment.message && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                        <p className="text-gray-700 text-sm">{appointment.message}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 min-w-[200px]">
                  {/* Status */}
                  <div className={`px-4 py-2 rounded-lg border-2 text-center font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </div>

                  {/* Boutons */}
                  {appointment.status === "PENDING" && (
                    <div className="space-y-2">
                      <button
                        onClick={() => updateStatus(appointment.id, "CONFIRMED")}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Confirmer
                      </button>
                      <button
                        onClick={() => updateStatus(appointment.id, "CANCELLED")}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Annuler
                      </button>
                    </div>
                  )}

                  {appointment.status === "CONFIRMED" && (
                    <button
                      onClick={() => updateStatus(appointment.id, "COMPLETED")}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Marquer terminé
                    </button>
                  )}

                  {/* Supprimer */}
                  <button
                    onClick={() => deleteAppointment(appointment.id)}
                    className="w-full bg-gray-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}