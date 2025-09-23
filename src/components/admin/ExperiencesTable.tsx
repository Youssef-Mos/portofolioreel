// src/components/admin/ExperiencesTable.tsx
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Edit2, 
  Trash2,
  Eye,
  Calendar,
  Building2,
  MapPin,
  Loader2,
  GraduationCap,
  Briefcase,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Experience {
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

export function ExperiencesTable() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/admin/experiences")
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!Array.isArray(data)) {
        console.error("Données reçues:", data)
        throw new Error("Les données reçues ne sont pas un tableau")
      }
      
      setExperiences(data)
    } catch (err) {
      console.error("Erreur détaillée:", err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const deleteExperience = async (experienceId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette expérience ?")) return
    
    try {
      const response = await fetch(`/api/admin/experiences/${experienceId}`, {
        method: "DELETE"
      })
      
      if (!response.ok) throw new Error("Erreur lors de la suppression")
      
      setExperiences(experiences.filter(e => e.id !== experienceId))
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
      'FULL_TIME': 'Temps plein',
      'PART_TIME': 'Temps partiel',
      'INTERNSHIP': 'Stage',
      'APPRENTICESHIP': 'Apprentissage',
      'FREELANCE': 'Freelance',
      'VOLUNTEER': 'Bénévolat',
      'OTHER': 'Autre'
    }
    return labels[kind as keyof typeof labels] || 'Autre'
  }

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case 'INTERNSHIP':
        return <GraduationCap className="w-4 h-4" />
      case 'FULL_TIME':
      case 'PART_TIME':
        return <Briefcase className="w-4 h-4" />
      case 'FREELANCE':
        return <Users className="w-4 h-4" />
      default:
        return <Briefcase className="w-4 h-4" />
    }
  }

  const getKindColor = (kind: string) => {
    const colors = {
      'FULL_TIME': 'bg-blue-100 text-blue-800',
      'PART_TIME': 'bg-purple-100 text-purple-800',
      'INTERNSHIP': 'bg-green-100 text-green-800',
      'APPRENTICESHIP': 'bg-orange-100 text-orange-800',
      'FREELANCE': 'bg-indigo-100 text-indigo-800',
      'VOLUNTEER': 'bg-pink-100 text-pink-800',
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
        <Button onClick={fetchExperiences} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {!experiences || experiences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Aucune expérience trouvée</p>
          <Link href="/admin/experiences/nouveau">
            <Button>Créer votre première expérience</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Expérience</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Technologies</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Période</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Durée</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(experiences) && experiences.map((experience) => (
                <tr key={experience.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getKindIcon(experience.kind)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 truncate max-w-xs">
                          {experience.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Building2 className="w-3 h-3" />
                          <span>{experience.place || 'Non spécifié'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getKindColor(experience.kind)}`}>
                      {getKindIcon(experience.kind)}
                      <span>{getKindLabel(experience.kind)}</span>
                    </span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {experience.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech.id}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {tech.name}
                        </span>
                      ))}
                      {experience.technologies.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{experience.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Présent'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    {experience.durationMonths ? (
                      <span className="text-sm text-gray-600">
                        {experience.durationMonths} mois
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Variable</span>
                    )}
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/admin/experiences/${experience.id}/modifier`}>
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
                        onClick={() => deleteExperience(experience.id)}
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