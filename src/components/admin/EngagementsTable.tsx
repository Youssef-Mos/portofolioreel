// src/components/admin/EngagementsTable.tsx
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Edit2, 
  Trash2,
  Calendar,
  Users,
  MapPin,
  Loader2,
  Heart,
  Megaphone,
  PackageCheck,
  UserCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Engagement {
  id: string
  title: string
  place: string | null
  kind: string
  description: string | null
  durationMonths: number | null
  startDate: string | null
  endDate: string | null
  keyAchievements: string[]
  technologies: {
    id: string
    name: string
    category: string | null
  }[]
  createdAt: string
  updatedAt: string
}

export function EngagementsTable() {
  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEngagements()
  }, [])

  const fetchEngagements = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/admin/engagements")
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!Array.isArray(data)) {
        console.error("Données reçues:", data)
        throw new Error("Les données reçues ne sont pas un tableau")
      }
      
      setEngagements(data)
    } catch (err) {
      console.error("Erreur détaillée:", err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const deleteEngagement = async (engagementId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet engagement ?")) return
    
    try {
      const response = await fetch(`/api/admin/engagements/${engagementId}`, {
        method: "DELETE"
      })
      
      if (!response.ok) throw new Error("Erreur lors de la suppression")
      
      setEngagements(engagements.filter(e => e.id !== engagementId))
    } catch (err) {
      console.error("Erreur:", err)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non défini"
    return new Date(dateString).toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric"
    })
  }

  const getKindLabel = (kind: string) => {
    const labels = {
      'ASSOCIATION': 'Association',
      'VOLUNTEER': 'Bénévolat',
      'LEADERSHIP': 'Leadership',
      'EVENT': 'Événement',
      'COMMUNITY': 'Communauté',
      'OTHER': 'Autre'
    }
    return labels[kind as keyof typeof labels] || 'Autre'
  }

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case 'ASSOCIATION':
        return <Users className="w-4 h-4" />
      case 'VOLUNTEER':
        return <PackageCheck className="w-4 h-4" />
      case 'LEADERSHIP':
        return <Megaphone className="w-4 h-4" />
      case 'EVENT':
        return <Calendar className="w-4 h-4" />
      case 'COMMUNITY':
        return <UserCheck className="w-4 h-4" />
      default:
        return <Heart className="w-4 h-4" />
    }
  }

  const getKindColor = (kind: string) => {
    const colors = {
      'ASSOCIATION': 'bg-green-100 text-green-800',
      'VOLUNTEER': 'bg-orange-100 text-orange-800',
      'LEADERSHIP': 'bg-purple-100 text-purple-800',
      'EVENT': 'bg-blue-100 text-blue-800',
      'COMMUNITY': 'bg-red-100 text-red-800',
      'OTHER': 'bg-gray-100 text-gray-800'
    }
    return colors[kind as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Erreur: {error}</p>
        <Button onClick={fetchEngagements} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {!engagements || engagements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Aucun engagement trouvé</p>
          <Link href="/admin/engagements/nouveau">
            <Button>Créer votre premier engagement</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Engagement</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Compétences</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Période</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(engagements) && engagements.map((engagement) => (
                <tr key={engagement.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getKindIcon(engagement.kind)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 truncate max-w-xs">
                          {engagement.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>{engagement.place || 'Non spécifié'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getKindColor(engagement.kind)}`}>
                      {getKindIcon(engagement.kind)}
                      <span>{getKindLabel(engagement.kind)}</span>
                    </span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {engagement.technologies.slice(0, 3).map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {engagement.technologies.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{engagement.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(engagement.startDate)} - {engagement.endDate ? formatDate(engagement.endDate) : 'Présent'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{engagement.keyAchievements.length}</span> action{engagement.keyAchievements.length > 1 ? 's' : ''}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/admin/engagements/${engagement.id}/modifier`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteEngagement(engagement.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}