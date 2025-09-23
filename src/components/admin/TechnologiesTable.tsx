// src/components/admin/TechnologiesTable.tsx
"use client"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { 
  Edit2, 
  Trash2,
  Tag,
  Loader2,
  Settings,
  FolderOpen,
  Briefcase,
  Heart,
  AlertTriangle,
  Plus,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Technology {
  id: string
  name: string
  slug: string
  category: string | null
  iconUrl: string | null
  _count: {
    projects: number
    experiences: number
    engagements: number
  }
  createdAt: string
  updatedAt: string
}

type SortField = 'name' | 'category' | 'usage' | 'createdAt'
type SortDirection = 'asc' | 'desc'

const ITEMS_PER_PAGE = 15

export function TechnologiesTable() {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filtres et tri
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Fonctions utilitaires définies avant leur utilisation
  const getTotalUsage = (tech: Technology) => {
    return tech._count.projects + tech._count.experiences + tech._count.engagements
  }

  const isUsed = (tech: Technology) => {
    return getTotalUsage(tech) > 0
  }

  const getCategoryColor = (category: string | null) => {
    const colors = {
      'Web Development': 'bg-blue-100 text-blue-800',
      'Data Science': 'bg-green-100 text-green-800',
      'Artificial Intelligence': 'bg-purple-100 text-purple-800',
      'Programming': 'bg-indigo-100 text-indigo-800',
      'Design': 'bg-pink-100 text-pink-800',
      'Soft Skills': 'bg-orange-100 text-orange-800',
      'Leadership': 'bg-red-100 text-red-800',
      'Education': 'bg-yellow-100 text-yellow-800',
      'Marketing': 'bg-cyan-100 text-cyan-800',
      'Operations': 'bg-teal-100 text-teal-800',
      'Healthcare': 'bg-emerald-100 text-emerald-800',
      'Communication': 'bg-emerald-100 text-emerald-800',
      'Problem Solving': 'bg-blue-100 text-blue-800',
      'Project Management': 'bg-indigo-100 text-indigo-800',
      'Teamwork': 'bg-green-100 text-green-800',
      'Creativity': 'bg-pink-100 text-pink-800',
      'Critical Thinking': 'bg-purple-100 text-purple-800',
      'DevOps': 'bg-gray-100 text-gray-800',
      'Mobile Development': 'bg-blue-100 text-blue-800',
      'Database': 'bg-green-100 text-green-800',
      'Security': 'bg-red-100 text-red-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Consulting': 'bg-teal-100 text-teal-800',
      'Research': 'bg-purple-100 text-purple-800',
      'Sales': 'bg-orange-100 text-orange-800',
      'Languages': 'bg-cyan-100 text-cyan-800',
      'Tools': 'bg-gray-100 text-gray-800',
      'Frameworks': 'bg-indigo-100 text-indigo-800',
      'Certifications': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  useEffect(() => {
    fetchTechnologies()
  }, [])

  const fetchTechnologies = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/admin/technologies")
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!Array.isArray(data)) {
        console.error("Données reçues:", data)
        throw new Error("Les données reçues ne sont pas un tableau")
      }
      
      setTechnologies(data)
    } catch (err) {
      console.error("Erreur détaillée:", err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const deleteTechnology = async (technologyId: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la technologie "${name}" ?`)) return
    
    try {
      const response = await fetch(`/api/admin/technologies/${technologyId}`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 409) {
          alert(`Impossible de supprimer "${name}" car elle est utilisée dans des projets, expériences ou engagements.`)
          return
        }
        throw new Error("Erreur lors de la suppression")
      }
      
      setTechnologies(technologies.filter(t => t.id !== technologyId))
    } catch (err) {
      console.error("Erreur:", err)
    }
  }

  // Récupérer toutes les catégories uniques
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      technologies
        .map(t => t.category)
        .filter(Boolean)
    )
    return Array.from(uniqueCategories).sort()
  }, [technologies])

  // Fonction de tri et filtrage
  const filteredAndSortedTechnologies = useMemo(() => {
    let filtered = technologies

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(tech => 
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter(tech => tech.category === selectedCategory)
    }

    // Tri
    filtered.sort((a, b) => {
      let valueA: any, valueB: any

      switch (sortField) {
        case 'name':
          valueA = a.name.toLowerCase()
          valueB = b.name.toLowerCase()
          break
        case 'category':
          valueA = a.category?.toLowerCase() || ''
          valueB = b.category?.toLowerCase() || ''
          break
        case 'usage':
          valueA = getTotalUsage(a)
          valueB = getTotalUsage(b)
          break
        case 'createdAt':
          valueA = new Date(a.createdAt).getTime()
          valueB = new Date(b.createdAt).getTime()
          break
        default:
          return 0
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [technologies, searchTerm, selectedCategory, sortField, sortDirection, getTotalUsage])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTechnologies.length / ITEMS_PER_PAGE)
  const paginatedTechnologies = filteredAndSortedTechnologies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />
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
        <Button onClick={fetchTechnologies} variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, slug ou catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtre par catégorie */}
          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category ?? ''} value={category ?? ''}>
                  {category ?? 'Non définie'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Résultats */}
        <div className="mt-3 text-sm text-gray-600">
          {filteredAndSortedTechnologies.length} technologie{filteredAndSortedTechnologies.length > 1 ? 's' : ''} trouvée{filteredAndSortedTechnologies.length > 1 ? 's' : ''}
          {(searchTerm || selectedCategory !== "all") && (
            <span> sur {technologies.length} au total</span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredAndSortedTechnologies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== "all" 
                ? "Aucune technologie ne correspond aux critères de recherche"
                : "Aucune technologie trouvée"
              }
            </p>
            <Link href="/admin/technologies/nouveau">
              <Button>Créer votre première technologie</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th 
                      className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Technologie</span>
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Catégorie</span>
                        {getSortIcon('category')}
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Slug</th>
                    <th 
                      className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('usage')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Utilisation</span>
                        {getSortIcon('usage')}
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedTechnologies.map((technology) => (
                    <tr key={technology.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {technology.iconUrl ? (
                              <img 
                                src={technology.iconUrl} 
                                alt={technology.name}
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <Tag className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {technology.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(technology.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        {technology.category ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(technology.category)}`}>
                            {technology.category}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Non définie</span>
                        )}
                      </td>
                      
                      <td className="py-4 px-4">
                        <code className="px-2 py-1 bg-gray-100 text-sm font-mono rounded">
                          {technology.slug}
                        </code>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <FolderOpen className="w-3 h-3 text-blue-500" />
                              <span className="text-gray-600">{technology._count.projects}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Briefcase className="w-3 h-3 text-green-500" />
                              <span className="text-gray-600">{technology._count.experiences}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-3 h-3 text-purple-500" />
                              <span className="text-gray-600">{technology._count.engagements}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Total: {getTotalUsage(technology)}
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        {isUsed(technology) ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            <span>Utilisée</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            <span>Non utilisée</span>
                          </span>
                        )}
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/admin/technologies/${technology.id}/modifier`}>
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
                            onClick={() => deleteTechnology(technology.id, technology.name)}
                            disabled={isUsed(technology)}
                            className={`flex items-center space-x-1 ${
                              isUsed(technology) 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-red-600 hover:text-red-700 hover:border-red-300'
                            }`}
                            title={isUsed(technology) ? "Impossible de supprimer car utilisée" : "Supprimer"}
                          >
                            {isUsed(technology) ? (
                              <AlertTriangle className="w-4 h-4" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Affichage de {((currentPage - 1) * ITEMS_PER_PAGE) + 1} à {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedTechnologies.length)} sur {filteredAndSortedTechnologies.length} résultats
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Précédent</span>
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 text-sm rounded ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-1"
                    >
                      <span>Suivant</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}