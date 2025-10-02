// src/components/projects/ProjectCard.tsx
"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Calendar, 
  Users, 
  Star, 
  Github, 
  Play, 
  Clock,
  Code,
  Tag
} from "lucide-react"

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

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non défini"
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short"
    })
  }

  const getThemeGradient = (title: string) => {
    const themes = [
      'from-blue-500 to-purple-600',
      'from-purple-500 to-pink-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-indigo-500 to-blue-600',
      'from-cyan-500 to-blue-600',
      'from-violet-500 to-purple-600',
      'from-emerald-500 to-green-600'
    ]
    
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('e-commerce')) return themes[0]
    if (lowerTitle.includes('dashboard')) return themes[1]
    if (lowerTitle.includes('portfolio')) return themes[2]
    if (lowerTitle.includes('api')) return themes[3]
    if (lowerTitle.includes('mobile')) return themes[4]
    if (lowerTitle.includes('web')) return themes[5]
    if (lowerTitle.includes('data')) return themes[6]
    if (lowerTitle.includes('game')) return themes[7]
    
    return themes[index % themes.length]
  }

  const themeGradient = getThemeGradient(project.title)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer"
    >
      <Link href={`/projets/${project.slug}`}>
        {/* Header avec logo/image */}
        <div className={`relative h-48 bg-gradient-to-r ${themeGradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            {project.favorite && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex items-center space-x-1 px-3 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full text-yellow-100"
              >
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-medium">Phare</span>
              </motion.div>
            )}
            
            {project.testProject && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full text-green-100"
              >
                <Play className="w-3 h-3" />
                <span className="text-xs font-medium">Testable</span>
              </motion.div>
            )}
          </div>

          {/* Logo/Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {project.logoUrl ? (
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                src={project.logoUrl}
                alt={project.title}
                className="w-16 h-16 rounded-xl shadow-lg bg-white p-3 group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
              >
                <Code className="w-8 h-8 text-white" />
              </motion.div>
            )}
          </div>

          {/* Actions overlay */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.githubUrl && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  window.open(project.githubUrl!, '_blank')
                }}
              >
                <Github className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Titre et description */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
              {project.title}
            </h3>
            {project.description && (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {project.description}
              </p>
            )}
          </div>

          {/* Technologies */}
          {project.technologies.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech.id}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tech.name}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Informations projet */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              {project.teamSize && (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{project.teamSize}</span>
                </div>
              )}
              {project.durationMonths && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{project.durationMonths}m</span>
                </div>
              )}
              {project.startDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(project.startDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Mots-clés */}
          {project.keywords.length > 0 && (
            <div className="flex items-center space-x-2 text-xs text-gray-400 mb-4">
              <Tag className="w-3 h-3" />
              <span className="truncate">
                {project.keywords.slice(0, 3).join(' • ')}
                {project.keywords.length > 3 && '...'}
              </span>
            </div>
          )}

          {/* Call to action avec effet hover */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${themeGradient}`} />
                <span className="text-sm text-gray-600">Voir le détail</span>
              </div>
              
              {/* Texte qui apparaît au hover */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Appuyez pour en savoir plus →
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

