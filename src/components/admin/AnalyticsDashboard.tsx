// src/components/admin/AnalyticsDashboard.tsx
"use client"
import { useState, useEffect } from "react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"
import { 
  FolderOpen, 
  Briefcase, 
  Heart, 
  Tag,
  TrendingUp,
  Calendar,
  Users,
  Target,
  Loader2,
  Download,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Project {
  id: string
  title: string
  favorite: boolean
  startDate: string | null
  endDate: string | null
  durationMonths: number | null
  teamSize: number | null
  technologies: { name: string; category: string | null }[]
  createdAt: string
}

interface Experience {
  id: string
  title: string
  kind: string
  startDate: string | null
  endDate: string | null
  durationMonths: number | null
  technologies: { name: string; category: string | null }[]
  createdAt: string
}

interface Engagement {
  id: string
  title: string
  kind: string
  startDate: string | null
  endDate: string | null
  durationMonths: number | null
  technologies: { name: string; category: string | null }[]
  createdAt: string
}

interface Technology {
  id: string
  name: string
  category: string | null
  _count: {
    projects: number
    experiences: number
    engagements: number
  }
  createdAt: string
}

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
]

export function AnalyticsDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [projectsRes, experiencesRes, engagementsRes, technologiesRes] = await Promise.all([
        fetch("/api/admin/projects"),
        fetch("/api/admin/experiences"), 
        fetch("/api/admin/engagements"),
        fetch("/api/admin/technologies")
      ])

      if (!projectsRes.ok || !experiencesRes.ok || !engagementsRes.ok || !technologiesRes.ok) {
        throw new Error("Erreur lors du chargement des données")
      }

      const [projectsData, experiencesData, engagementsData, technologiesData] = await Promise.all([
        projectsRes.json(),
        experiencesRes.json(),
        engagementsRes.json(),
        technologiesRes.json()
      ])

      setProjects(projectsData)
      setExperiences(experiencesData)
      setEngagements(engagementsData)
      setTechnologies(technologiesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  // Calculs de métriques
  const totalProjects = projects.length
  const favoriteProjects = projects.filter(p => p.favorite).length
  const totalExperiences = experiences.length
  const totalEngagements = engagements.length
  const totalTechnologies = technologies.length

  // Durée moyenne des projets
  const avgProjectDuration = projects.reduce((acc, p) => acc + (p.durationMonths || 0), 0) / (projects.filter(p => p.durationMonths).length || 1)

  // Taille moyenne des équipes
  const avgTeamSize = projects.reduce((acc, p) => acc + (p.teamSize || 1), 0) / totalProjects

  // Technologies les plus utilisées
  const technologyUsage = technologies
    .map(tech => ({
      name: tech.name,
      value: tech._count.projects + tech._count.experiences + tech._count.engagements,
      projects: tech._count.projects,
      experiences: tech._count.experiences,
      engagements: tech._count.engagements,
      category: tech.category
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  // Répartition par catégories de technologies
  const categoryDistribution = technologies.reduce((acc, tech) => {
    const category = tech.category || 'Autre'
    const usage = tech._count.projects + tech._count.experiences + tech._count.engagements
    acc[category] = (acc[category] || 0) + usage
    return acc
  }, {} as Record<string, number>)

  const categoryData = Object.entries(categoryDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Timeline des créations (par mois)
  const getMonthYear = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }

  const timelineData: Record<string, any> = {}
  
  // Ajouter les projets
  projects.forEach(project => {
    const monthYear = getMonthYear(project.createdAt)
    if (!timelineData[monthYear]) {
      timelineData[monthYear] = { month: monthYear, projects: 0, experiences: 0, engagements: 0 }
    }
    timelineData[monthYear].projects++
  })

  // Ajouter les expériences
  experiences.forEach(exp => {
    const monthYear = getMonthYear(exp.createdAt)
    if (!timelineData[monthYear]) {
      timelineData[monthYear] = { month: monthYear, projects: 0, experiences: 0, engagements: 0 }
    }
    timelineData[monthYear].experiences++
  })

  // Ajouter les engagements
  engagements.forEach(eng => {
    const monthYear = getMonthYear(eng.createdAt)
    if (!timelineData[monthYear]) {
      timelineData[monthYear] = { month: monthYear, projects: 0, experiences: 0, engagements: 0 }
    }
    timelineData[monthYear].engagements++
  })

  const timelineArray = Object.values(timelineData)
    .sort((a: any, b: any) => a.month.localeCompare(b.month))
    .slice(-12) // Derniers 12 mois

  // Répartition des types d'expériences
  const experienceTypes = experiences.reduce((acc, exp) => {
    const type = exp.kind
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const experienceTypeData = Object.entries(experienceTypes)
    .map(([name, value]) => ({ 
      name: name.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()), 
      value 
    }))

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
        <Button onClick={fetchAllData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={fetchAllData} variant="outline" className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Actualiser</span>
        </Button>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projets Total</p>
              <p className="text-3xl font-bold text-gray-900">{totalProjects}</p>
              <p className="text-sm text-green-600 mt-1">
                {favoriteProjects} favoris
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expériences</p>
              <p className="text-3xl font-bold text-gray-900">{totalExperiences}</p>
              <p className="text-sm text-gray-500 mt-1">
                {avgProjectDuration.toFixed(1)} mois/projet
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagements</p>
              <p className="text-3xl font-bold text-gray-900">{totalEngagements}</p>
              <p className="text-sm text-gray-500 mt-1">
                Associatif
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Technologies</p>
              <p className="text-3xl font-bold text-gray-900">{totalTechnologies}</p>
              <p className="text-sm text-gray-500 mt-1">
                {avgTeamSize.toFixed(1)} pers./équipe
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500">
              <Tag className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques - Ligne 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technologies les plus utilisées */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Technologies les plus utilisées
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={technologyUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, 'Utilisations']}
                  labelFormatter={(label) => `Technologie: ${label}`}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition par catégories */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition par catégories
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Graphiques - Ligne 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline d'activité */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activité des 12 derniers mois
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-')
                    return `${month}/${year.slice(-2)}`
                  }}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => {
                    const [year, month] = value.split('-')
                    return `${month}/${year}`
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="projects"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  name="Projets"
                />
                <Area
                  type="monotone"
                  dataKey="experiences"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  name="Expériences"
                />
                <Area
                  type="monotone"
                  dataKey="engagements"
                  stackId="1"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  name="Engagements"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Types d'expériences */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Types d'expériences
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={experienceTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {experienceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8" />
            <div>
              <h3 className="font-semibold">Taux de favoris</h3>
              <p className="text-2xl font-bold">
                {totalProjects > 0 ? Math.round((favoriteProjects / totalProjects) * 100) : 0}%
              </p>
              <p className="text-blue-100 text-sm">
                {favoriteProjects} sur {totalProjects} projets
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8" />
            <div>
              <h3 className="font-semibold">Croissance</h3>
              <p className="text-2xl font-bold">
                +{timelineArray.slice(-3).reduce((acc: number, month: any) => 
                  acc + month.projects + month.experiences + month.engagements, 0)}
              </p>
              <p className="text-green-100 text-sm">
                Derniers 3 mois
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8" />
            <div>
              <h3 className="font-semibold">Polyvalence</h3>
              <p className="text-2xl font-bold">
                {categoryData.length}
              </p>
              <p className="text-purple-100 text-sm">
                Catégories maîtrisées
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}