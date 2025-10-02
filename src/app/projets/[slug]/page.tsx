// src/app/projets/[slug]/page.tsx
"use client"
import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Github, 
  ExternalLink, 
  Calendar, 
  Users, 
  Clock, 
  Star,
  Play,
  Code,
  Lightbulb,
  Target,
  Loader2,
  ChevronUp,
  Tag,
  Home
} from "lucide-react"
import Link from "next/link"
import { ProjectDetailSkeleton } from "@/components/skeletons/ProjectDetailSkeleton"

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

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function ProjectDetailPage({ params }: PageProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { slug } = await params
        const response = await fetch(`/api/projects/${slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error(`Erreur ${response.status}`)
        }

        const data = await response.json()
        setProject(data)
      } catch (error) {
        console.error("Erreur lors du chargement du projet:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non défini"
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long"
    })
  }

  const getThemeColors = (title: string) => {
    const themes = {
      'e-commerce': { primary: 'blue', gradient: 'from-blue-500 to-purple-600' },
      'dashboard': { primary: 'purple', gradient: 'from-purple-500 to-pink-600' },
      'portfolio': { primary: 'green', gradient: 'from-green-500 to-teal-600' },
      'api': { primary: 'orange', gradient: 'from-orange-500 to-red-600' },
      'mobile': { primary: 'indigo', gradient: 'from-indigo-500 to-blue-600' },
      'web': { primary: 'cyan', gradient: 'from-cyan-500 to-blue-600' },
      'data': { primary: 'violet', gradient: 'from-violet-500 to-purple-600' },
      'game': { primary: 'emerald', gradient: 'from-emerald-500 to-green-600' }
    }

    const lowerTitle = title.toLowerCase()
    for (const [key, theme] of Object.entries(themes)) {
      if (lowerTitle.includes(key)) return theme
    }
    
    return { primary: 'blue', gradient: 'from-blue-500 to-purple-600' }
  }

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  if (!project) {
    notFound()
  }

  const theme = getThemeColors(project.title)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
     <div className="fixed top-6 left-6 z-50 flex items-center gap-3">
        {/* Bouton Accueil */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 group"
          >
            <Home className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-sm font-medium text-gray-700">Accueil</span>
          </Link>
        </motion.div>


      </div>

      {/* Bouton scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Header avec image/logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`relative h-96 bg-gradient-to-r ${theme.gradient} overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center text-white">
            {project.logoUrl ? (
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                src={project.logoUrl}
                alt={project.title}
                className="w-24 h-24 mx-auto mb-6 rounded-2xl shadow-2xl bg-white p-4"
              />
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <Code className="w-12 h-12 text-white" />
              </motion.div>
            )}
            
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {project.title}
            </motion.h1>
            
            {project.favorite && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 backdrop-blur-sm rounded-full"
              >
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Projet phare</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {project.description && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-3 text-yellow-500" />
                  Description du projet
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {project.description}
                </p>
              </motion.div>
            )}

            {/* Points clés */}
            {project.keyPoints.length > 0 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-green-500" />
                  Points clés du projet
                </h2>
                <div className="space-y-4">
                  {project.keyPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient} mt-3 flex-shrink-0`} />
                      <p className="text-gray-700 flex-1">{point}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Technologies */}
            {project.technologies.length > 0 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Code className="w-6 h-6 mr-3 text-blue-500" />
                  Technologies utilisées
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.technologies.map((tech, index) => (
                    <motion.div
                      key={tech.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      {tech.iconUrl ? (
                        <img src={tech.iconUrl} alt={tech.name} className="w-8 h-8" />
                      ) : (
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                          <span className="text-white text-xs font-bold">
                            {tech.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{tech.name}</p>
                        {tech.category && (
                          <p className="text-xs text-gray-500">{tech.category}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations du projet */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Informations</h3>
              
              <div className="space-y-4">
                {project.teamSize && (
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Équipe</p>
                      <p className="font-medium text-gray-900">
                        {project.teamSize} {project.teamSize > 1 ? 'personnes' : 'personne'}
                      </p>
                    </div>
                  </div>
                )}

                {project.durationMonths && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Durée</p>
                      <p className="font-medium text-gray-900">{project.durationMonths} mois</p>
                    </div>
                  </div>
                )}

                {project.startDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {project.endDate ? 'Période' : 'Date de début'}
                      </p>
                      <p className="font-medium text-gray-900">
                        {formatDate(project.startDate)}
                        {project.endDate && ` - ${formatDate(project.endDate)}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mots-clés */}
              {project.keywords.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Mots-clés
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer avec boutons d'action */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white border-t border-gray-200 py-8 mt-12"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {project.testProject && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/projets/${project.slug}/demo`}
                  className={`inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <Play className="w-5 h-5" />
                  <span>Tester le projet</span>
                </Link>
              </motion.div>
            )}

            {project.githubUrl && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Github className="w-5 h-5" />
                  <span>Voir sur GitHub</span>
                </Link>
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => router.back()}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-gray-700 border border-gray-300 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour aux projets</span>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}