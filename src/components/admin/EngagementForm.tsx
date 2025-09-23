// src/components/admin/EngagementForm.tsx (VERSION MISE À JOUR)
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
  MapPin,
  Heart,
  FileText,
  Trophy,
  Clock,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Schema de validation
const engagementSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  place: z.string().optional(),
  kind: z.enum(["ASSOCIATION", "VOLUNTEER", "LEADERSHIP", "EVENT", "COMMUNITY", "OTHER"]),
  description: z.string().optional(),
  durationMonths: z.number().min(1, "La durée doit être supérieure à 0").optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  keyAchievements: z.array(z.object({ value: z.string() })),
  technologySlugs: z.array(z.object({ value: z.string() }))
})

type EngagementFormData = z.infer<typeof engagementSchema>

interface Technology {
  id: string
  name: string
  slug: string
  category: string | null
}

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
  technologies: Technology[]
}

interface EngagementFormProps {
  engagement?: Engagement // Optionnel pour le mode création
}

// Types d'engagement avec labels
const ENGAGEMENT_TYPES = {
  "ASSOCIATION": { label: "Association", color: "bg-blue-100 text-blue-800" },
  "VOLUNTEER": { label: "Bénévolat", color: "bg-green-100 text-green-800" },
  "LEADERSHIP": { label: "Leadership", color: "bg-purple-100 text-purple-800" },
  "EVENT": { label: "Événement", color: "bg-orange-100 text-orange-800" },
  "COMMUNITY": { label: "Communauté", color: "bg-cyan-100 text-cyan-800" },
  "OTHER": { label: "Autre", color: "bg-gray-100 text-gray-800" }
}

export function EngagementForm({ engagement }: EngagementFormProps) {
  const router = useRouter()
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!engagement

  // État pour le modal nouvelle technologie
  const [showNewTechModal, setShowNewTechModal] = useState(false)
  const [newTechForm, setNewTechForm] = useState({ name: "", slug: "", category: "" })
  const [newTechLoading, setNewTechLoading] = useState(false)

  // Préparer les valeurs par défaut en fonction du mode
  const getDefaultValues = (): EngagementFormData => {
    if (engagement) {
      return {
        title: engagement.title,
        place: engagement.place || "",
        kind: engagement.kind as any,
        description: engagement.description || "",
        durationMonths: engagement.durationMonths || undefined,
        startDate: engagement.startDate ? new Date(engagement.startDate).toISOString().split('T')[0] : "",
        endDate: engagement.endDate ? new Date(engagement.endDate).toISOString().split('T')[0] : "",
        keyAchievements: engagement.keyAchievements.map(achievement => ({ value: achievement })),
        technologySlugs: engagement.technologies.map(tech => ({ value: tech.slug }))
      }
    }
    
    return {
      title: "",
      place: "",
      kind: "OTHER",
      description: "",
      durationMonths: undefined,
      startDate: "",
      endDate: "",
      keyAchievements: [],
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
  } = useForm<EngagementFormData>({
    resolver: zodResolver(engagementSchema),
    defaultValues: getDefaultValues()
  })

  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
    control,
    name: "keyAchievements"
  })

  const { fields: technologyFields, append: appendTechnology, remove: removeTechnology } = useFieldArray({
    control,
    name: "technologySlugs"
  })

  const watchKind = watch("kind")

  useEffect(() => {
    fetchTechnologies()
  }, [])

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

  const onSubmit = async (data: EngagementFormData) => {
    try {
      setLoading(true)
      setError(null)

      const submitData = {
        title: data.title,
        place: data.place || undefined,
        kind: data.kind,
        description: data.description || undefined,
        durationMonths: data.durationMonths,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        keyAchievements: data.keyAchievements.map(k => k.value).filter(k => k.trim() !== ""),
        technologySlugs: data.technologySlugs.map(t => t.value).filter(t => t !== "")
      }

      const url = isEditing 
        ? `/api/admin/engagements/${engagement.id}`
        : "/api/admin/engagements"
      
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
        throw new Error(errorData.error || `Erreur lors de ${isEditing ? 'la modification' : 'la création'} de l'engagement`)
      }

      router.push("/admin/engagements")
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
        <div className="md:col-span-2">
          <Label htmlFor="title">Titre de l'engagement *</Label>
          <Input
            id="title"
            placeholder="ex: Président de l'association XYZ"
            {...register("title")}
            className={errors.title ? "border-red-300" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="place">Organisation / Lieu</Label>
          <Input
            id="place"
            placeholder="ex: Association ABC"
            {...register("place")}
          />
        </div>

        <div>
          <Label htmlFor="kind">Type d'engagement *</Label>
          <select
            id="kind"
            {...register("kind")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {Object.entries(ENGAGEMENT_TYPES).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          placeholder="Décrivez votre engagement, vos responsabilités et missions..."
          rows={4}
          {...register("description")}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>

      {/* Dates et durée */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div>
          <Label htmlFor="durationMonths">Durée (mois)</Label>
          <Input
            id="durationMonths"
            type="number"
            min="1"
            placeholder="ex: 12"
            {...register("durationMonths", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Réalisations clés */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Réalisations clés</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendAchievement({ value: "" })}
            className="flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </Button>
        </div>

        {achievementFields.map((field, index) => (
          <div key={field.id} className="flex items-start space-x-2">
            <div className="flex-1">
              <Input
                placeholder="ex: Augmentation de 30% du nombre d'adhérents"
                {...register(`keyAchievements.${index}.value`)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeAchievement(index)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Technologies sélectionnées */}
      <div className="space-y-4">
        <Label>Technologies et compétences utilisées</Label>
        
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
          onClick={() => router.push("/admin/engagements")}
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