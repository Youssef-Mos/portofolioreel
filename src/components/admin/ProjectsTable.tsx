// src/components/admin/ProjectsTable.tsx (VERSION MISE À JOUR)
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Star, 
  StarOff,
  Eye,
  Calendar,
  Users,
  Loader2,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  teamSize: number | null
  durationMonths: number | null
  startDate: string | null
  endDate: string | null
  favorite: boolean
  logoUrl: string | null
  technologies: {
    id: string
    name: string
    category: string | null
  }[]
  createdAt: string
  updatedAt: string
}

export function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/admin/projects")
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Vérifier que les données sont bien un tableau
      if (!Array.isArray(data)) {
        console.error("Données reçues:", data)
        throw new Error("Les données reçues ne sont pas un tableau")
      }
      
      setProjects(data)
    } catch (err) {
      console.error("Erreur détaillée:", err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (projectId: string, currentFavorite: boolean) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: !currentFavorite })
      })
      
      if (!response.ok) throw new Error("Erreur lors de la mise à jour")
      
      setProjects(projects.map(p => 
        p.id === projectId ? { ...p, favorite: !currentFavorite } : p
      ))
    } catch (err) {
      console.error("Erreur:", err)
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return
    
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "DELETE"
      })
      
      if (!response.ok) throw new Error("Erreur lors de la suppression")
      
      setProjects(projects.filter(p => p.id !== projectId))
    } catch (err) {
      console.error("Erreur:", err)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non défini"
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
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
        <Button onClick={fetchProjects} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun projet</h3>
          <p className="text-gray-600 mb-4">Commencez par créer votre premier projet.</p>
          <Link href="/admin/projets/nouveau">
            <Button>Créer un projet</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Projet</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Technologies</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Équipe & Durée</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Dates</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-start space-x-3">
                      {project.logoUrl ? (
                        <img
                          src={project.logoUrl}
                          alt={`Logo ${project.title}`}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {project.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 truncate">{project.title}</h3>
                          {project.favorite && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">/{project.slug}</p>
                        {project.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech.id}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {tech.name}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      {project.teamSize && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{project.teamSize} {project.teamSize > 1 ? 'personnes' : 'personne'}</span>
                        </div>
                      )}
                      {project.durationMonths && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{project.durationMonths} mois</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {project.startDate ? (
                        <div>
                          <div>Début: {formatDate(project.startDate)}</div>
                          {project.endDate && (
                            <div>Fin: {formatDate(project.endDate)}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Dates non définies</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleFavorite(project.id, project.favorite)}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                        title={project.favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        {project.favorite ? (
                          <Star className="w-4 h-4 fill-current text-yellow-500" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/projets/${project.slug}`} target="_blank">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                          title="Voir le projet"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      
                      <Link href={`/admin/projets/${project.id}/modifier`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                          title="Modifier le projet"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300"
                        title="Supprimer le projet"
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