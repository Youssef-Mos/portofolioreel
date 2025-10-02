// src/components/projects/ProjectGrid.tsx
"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ProjectCard } from "./ProjectCard"
import { Loader2, Search, Filter } from "lucide-react"

interface Technology {
  id: string
  name: string
  slug: string
  category: string | null
  iconUrl: string | null
}

interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  keyPoints: string[]
  keywords: string[]
  teamSize: number | null
  durationMonths: number | null
  startDate: string | null
  endDate: string | null
  favorite: boolean
  logoUrl: string | null
  githubUrl: string | null
  testProject: boolean
  technologies: Technology[]
  createdAt: string
  updatedAt: string
}

export function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data.data || [])
        }
      } catch (error) {
        console.error("Erreur lors du chargement des projets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || 
                           (selectedCategory === "favorite" && project.favorite) ||
                           (selectedCategory === "testable" && project.testProject)
    
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: "all", label: "Tous les projets" },
    { value: "favorite", label: "Projets phares" },
    { value: "testable", label: "Projets testables" }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des projets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        {/* Recherche */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtres */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Nombre de résultats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-gray-600"
      >
        {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
      </motion.div>

      {/* Grille des projets */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>

      {/* État vide */}
      {filteredProjects.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun projet trouvé</h3>
          <p className="text-gray-600">
            Essayez de modifier vos critères de recherche ou de filtrage.
          </p>
        </motion.div>
      )}
    </div>
  )
}