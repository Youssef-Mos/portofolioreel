// src/components/admin/ProjectForm.tsx (VERSION MISE À JOUR)
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Loader2,
  AlertCircle,
  Calendar,
  Users,
  Tag,
  FileText,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Type explicite pour les données du formulaire
interface ProjectFormData {
  title: string
  slug: string
  keywords: { value: string }[]
  teamSize?: number
  durationMonths?: number
  startDate?: string
  endDate?: string
  description?: string
  keyPoints: { value: string }[]
  favorite: boolean
  logoUrl?: string
  githubUrl?: string
  testProject: boolean
  technologySlugs: { value: string }[]
}

// Schema de validation simplifié
const projectSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  keywords: z.array(z.object({ value: z.string() })),
  teamSize: z.number().optional(),
  durationMonths: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  keyPoints: z.array(z.object({ value: z.string() })),
  favorite: z.boolean(),
  logoUrl: z.string().optional(),
  githubUrl: z.string().url("L'URL GitHub doit être valide").optional().or(z.literal("")),
  testProject: z.boolean(),
  technologySlugs: z.array(z.object({ value: z.string() })),
})

interface Technology {
  id: string
  name: string
  slug: string
  category: string | null
}

interface Project {
  id: string
  title: string
  slug: string
  keywords: string[]
  teamSize: number | null
  durationMonths: number | null
  startDate: string | null
  endDate: string | null
  description: string | null
  keyPoints: string[]
  favorite: boolean
  logoUrl: string | null
  githubUrl: string | null
  testProject: boolean
  technologies: Technology[]
}

interface ProjectFormProps {
  project?: Project // Optionnel pour le mode création
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!project

  // State for new technology modal
  const [showNewTechModal, setShowNewTechModal] = useState(false)
  const [newTechForm, setNewTechForm] = useState<{ name: string; slug: string; category: string }>({
    name: "",
    slug: "",
    category: ""
  })
  const [newTechLoading, setNewTechLoading] = useState(false)

  // Préparer les valeurs par défaut en fonction du mode
  const getDefaultValues = (): ProjectFormData => {
    if (project) {
      return {
        title: project.title,
        slug: project.slug,
        keywords: project.keywords.map(keyword => ({ value: keyword })),
        teamSize: project.teamSize || undefined,
        durationMonths: project.durationMonths || undefined,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
        description: project.description || "",
        keyPoints: project.keyPoints.map(point => ({ value: point })),
        favorite: project.favorite,
        logoUrl: project.logoUrl || "",
        githubUrl: project.githubUrl || "",
        testProject: project.testProject,
        technologySlugs: project.technologies.map(tech => ({ value: tech.slug }))
      }
    }
    
    return {
      title: "",
      slug: "",
      keywords: [],
      teamSize: undefined,
      durationMonths: undefined,
      startDate: "",
      endDate: "",
      description: "",
      keyPoints: [],
      favorite: false,
      logoUrl: "",
      githubUrl: "",
      testProject: false,
      technologySlugs: []
    }
  }

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: getDefaultValues()
  })

  const { fields: keywordFields, append: appendKeyword, remove: removeKeyword } = useFieldArray({
    control,
    name: "keywords"
  })

  const { fields: keyPointFields, append: appendKeyPoint, remove: removeKeyPoint } = useFieldArray({
    control,
    name: "keyPoints"
  })

  const { fields: technologyFields, append: appendTechnology, remove: removeTechnology } = useFieldArray({
    control,
    name: "technologySlugs"
  })

  const watchTitle = watch("title")

  useEffect(() => {
    fetchTechnologies()
  }, [])

  // Auto-generate slug from title (only in creation mode)
  useEffect(() => {
    if (!isEditing && watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setValue("slug", slug)
    }
  }, [watchTitle, setValue, isEditing])

  const fetchTechnologies = async () => {
    try {
      const response = await fetch("/api/admin/technologies")
      if (response.ok) {
        const data = await response.json()
        setTechnologies(data)
      }
    } catch (err) {
      console.error("Erreur lors du chargement des technologies:", err)
    }
  }

  // Handle new tech name change and auto-generate slug
  const handleNewTechNameChange = (name: string) => {
    setNewTechForm(prev => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }))
  }

  const createNewTechnology = async () => {
    try {
      setNewTechLoading(true)
      const response = await fetch("/api/admin/technologies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTechForm.name,
          slug: newTechForm.slug,
          category: newTechForm.category || null
        })
      })
      if (!response.ok) {
        throw new Error("Erreur lors de la création de la technologie")
      }
      setShowNewTechModal(false)
      setNewTechForm({ name: "", slug: "", category: "" })
      await fetchTechnologies()
    } catch (err) {
      console.error("Erreur:", err)
    } finally {
      setNewTechLoading(false)
    }
  }

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setLoading(true)
      setError(null)

      const submitData = {
        title: data.title,
        slug: data.slug,
        keywords: data.keywords.map(k => k.value).filter(k => k.trim() !== ""),
        teamSize: data.teamSize,
        durationMonths: data.durationMonths,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        description: data.description || undefined,
        keyPoints: data.keyPoints.map(k => k.value).filter(k => k.trim() !== ""),
        favorite: data.favorite,
        logoUrl: data.logoUrl || undefined,
        githubUrl: data.githubUrl || undefined,
        testProject: data.testProject,
        technologySlugs: data.technologySlugs.map(t => t.value).filter(t => t !== "")
      }

      const url = isEditing 
        ? `/api/admin/projects/${project.id}`
        : "/api/admin/projects"
      
      const method = isEditing ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submitData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erreur lors de ${isEditing ? 'la modification' : 'la création'} du projet`)
      }

      router.push("/admin/projets")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite")
    } finally {
      setLoading(false)
    }
  }

  // Technologies disponibles (non sélectionnées)
  const selectedTechSlugs = technologyFields.map(field => field.value)
  const availableTechnologies = technologies.filter(tech => !selectedTechSlugs.includes(tech.slug))

  // Fonction pour ajouter une technologie
  const addTechnology = (techSlug: string) => {
    if (!selectedTechSlugs.includes(techSlug)) {
      appendTechnology({ value: techSlug })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Erreur</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Informations de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">Titre du projet *</Label>
          <Input
            id="title"
            placeholder="ex: Application de gestion de tâches"
            {...register("title")}
            className={errors.title ? "border-red-300" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="slug">Slug du projet *</Label>
          <Input
            id="slug"
            placeholder="ex: app-gestion-taches"
            {...register("slug")}
            className={errors.slug ? "border-red-300" : ""}
            readOnly={isEditing} // En mode édition, on ne peut pas modifier le slug
          />
          {errors.slug && (
            <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
          )}
          {isEditing && (
            <p className="text-sm text-gray-500 mt-1">Le slug ne peut pas être modifié après création</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          placeholder="Décrivez votre projet, ses objectifs et son fonctionnement..."
          rows={4}
          {...register("description")}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>

      {/* Méta-informations */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Label htmlFor="teamSize">Taille de l'équipe</Label>
          <Input
            id="teamSize"
            type="number"
            min="1"
            placeholder="ex: 3"
            {...register("teamSize", { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label htmlFor="durationMonths">Durée (mois)</Label>
          <Input
            id="durationMonths"
            type="number"
            min="1"
            placeholder="ex: 6"
            {...register("durationMonths", { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label htmlFor="startDate">Date de début</Label>
          <Input
            id="startDate"
            type="date"
            {...register("startDate")}
          />
        </div>

        <div>
          <Label htmlFor="endDate">Date de fin</Label>
          <Input
            id="endDate"
            type="date"
            {...register("endDate")}
          />
        </div>
      </div>

      {/* Logo URL, GitHub URL et options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="logoUrl">URL du logo (optionnel)</Label>
          <Input
            id="logoUrl"
            type="url"
            placeholder="https://example.com/logo.png"
            {...register("logoUrl")}
          />
        </div>

        <div>
          <Label htmlFor="githubUrl">URL GitHub (optionnel)</Label>
          <Input
            id="githubUrl"
            type="url"
            placeholder="https://github.com/username/repo"
            {...register("githubUrl")}
            className={errors.githubUrl ? "border-red-300" : ""}
          />
          {errors.githubUrl && (
            <p className="text-sm text-red-600 mt-1">{errors.githubUrl.message}</p>
          )}
        </div>
      </div>

      {/* Options projet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-2">
          <input
            id="favorite"
            type="checkbox"
            {...register("favorite")}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <Label htmlFor="favorite" className="text-sm font-medium">
            Marquer comme projet favori
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="testProject"
            type="checkbox"
            {...register("testProject")}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <Label htmlFor="testProject" className="text-sm font-medium">
            Projet testable en ligne
          </Label>
        </div>
      </div>

      {/* Mots-clés */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Mots-clés</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendKeyword({ value: "" })}
            className="flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </Button>
        </div>

        {keywordFields.map((field, index) => (
          <div key={field.id} className="flex items-start space-x-2">
            <div className="flex-1">
              <Input
                placeholder="ex: React, Node.js, MongoDB"
                {...register(`keywords.${index}.value`)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeKeyword(index)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Points clés */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Points clés du projet</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendKeyPoint({ value: "" })}
            className="flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </Button>
        </div>

        {keyPointFields.map((field, index) => (
          <div key={field.id} className="flex items-start space-x-2">
            <div className="flex-1">
              <Input
                placeholder="ex: Interface utilisateur intuitive et responsive"
                {...register(`keyPoints.${index}.value`)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeKeyPoint(index)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Technologies sélectionnées */}
      <div className="space-y-4">
        <Label>Technologies utilisées</Label>
        
        {technologyFields.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologyFields.map((field, index) => {
              const tech = technologies.find(t => t.slug === field.value)
              return (
                <div
                  key={field.id}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <span>{tech?.name || field.value}</span>
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Sélection de technologies */}
        {availableTechnologies.length > 0 && (
          <div className="space-y-2">
            <Label>Ajouter des technologies :</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
              {availableTechnologies.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => addTechnology(tech.slug)}
                  className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                >
                  {tech.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bouton pour créer une nouvelle technologie */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowNewTechModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une technologie</span>
        </Button>
      </div>

      {/* Modal nouvelle technologie */}
      {showNewTechModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nouvelle technologie</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="newTechName">Nom</Label>
                <Input
                  id="newTechName"
                  value={newTechForm.name}
                  onChange={(e) => handleNewTechNameChange(e.target.value)}
                  placeholder="ex: React"
                />
              </div>
              
              <div>
                <Label htmlFor="newTechSlug">Slug</Label>
                <Input
                  id="newTechSlug"
                  value={newTechForm.slug}
                  onChange={(e) => setNewTechForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="react"
                />
              </div>
              
              <div>
                <Label htmlFor="newTechCategory">Catégorie (optionnel)</Label>
                <Input
                  id="newTechCategory"
                  value={newTechForm.category}
                  onChange={(e) => setNewTechForm(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="ex: Frontend"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewTechModal(false)}
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={createNewTechnology}
                disabled={!newTechForm.name || newTechLoading}
              >
                {newTechLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Créer"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projets")}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSubmitting ? 'Traitement...' : (isEditing ? 'Modifier' : 'Créer')}</span>
        </Button>
      </div>
    </form>
  )
}