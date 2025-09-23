// src/components/admin/ExperienceForm.tsx
"use client"
import { useState, useEffect, useMemo } from "react"
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
  Briefcase,
  FileText,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/* ----------------------------- Types & helpers ----------------------------- */

export type UiTechnology = {
  id: string
  name: string
  slug: string
  category: string | null
}

export type ExperienceType =
  | "FULL_TIME"
  | "PART_TIME"
  | "INTERNSHIP"
  | "APPRENTICESHIP"
  | "FREELANCE"
  | "VOLUNTEER"
  | "OTHER"

// Props envoyés par la page : en édition, on reçoit l'expérience
export interface ExperienceFormProps {
  experience?: {
    id: string
    title: string
    place: string | null
    kind: ExperienceType
    description: string | null
    durationMonths: number | null
    startDate: string | null // ISO string côté client
    endDate: string | null   // ISO string côté client
    keyAchievements: string[]
    technologies: UiTechnology[] // doit contenir slug
    createdAt: string
    updatedAt: string
  }
}

const EXPERIENCE_TYPES: Record<
  ExperienceType,
  { label: string; color: string }
> = {
  FULL_TIME: { label: "Temps plein", color: "bg-green-100 text-green-800" },
  PART_TIME: { label: "Temps partiel", color: "bg-blue-100 text-blue-800" },
  INTERNSHIP: { label: "Stage", color: "bg-purple-100 text-purple-800" },
  APPRENTICESHIP: { label: "Alternance", color: "bg-orange-100 text-orange-800" },
  FREELANCE: { label: "Freelance", color: "bg-cyan-100 text-cyan-800" },
  VOLUNTEER: { label: "Bénévolat", color: "bg-pink-100 text-pink-800" },
  OTHER: { label: "Autre", color: "bg-gray-100 text-gray-800" },
}

// yyyy-mm-dd pour <input type="date">
const toInputDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toISOString().slice(0, 10) : ""

/* ---------------------------------- Zod ----------------------------------- */

const experienceSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  place: z.string().optional(),
  kind: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "INTERNSHIP",
    "APPRENTICESHIP",
    "FREELANCE",
    "VOLUNTEER",
    "OTHER",
  ]),
  description: z.string().optional(),
  durationMonths: z
    .number({ message: "La durée doit être un nombre" })
    .min(1, "La durée doit être supérieure à 0")
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  keyAchievements: z.array(z.object({ value: z.string() })),
  technologySlugs: z.array(z.object({ value: z.string() })),
})

type ExperienceFormData = z.infer<typeof experienceSchema>

/* --------------------------------- Form UI -------------------------------- */

export function ExperienceForm({ experience }: ExperienceFormProps) {
  const router = useRouter()
  const [technologies, setTechnologies] = useState<UiTechnology[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal "nouvelle techno"
  const [showNewTechModal, setShowNewTechModal] = useState(false)
  const [newTechForm, setNewTechForm] = useState({ name: "", slug: "", category: "" })
  const [newTechLoading, setNewTechLoading] = useState(false)

  // Mode édition ?
  const isEdit = Boolean(experience?.id)

  // Default values (création vs édition)
  const defaultValues: ExperienceFormData = useMemo(
    () => ({
      title: experience?.title ?? "",
      place: experience?.place ?? "",
      kind: (experience?.kind ?? "OTHER") as ExperienceType,
      description: experience?.description ?? "",
      durationMonths: experience?.durationMonths ?? undefined,
      startDate: toInputDate(experience?.startDate),
      endDate: toInputDate(experience?.endDate),
      keyAchievements:
        experience?.keyAchievements?.map((v) => ({ value: v })) ?? [],
      technologySlugs:
        experience?.technologies?.map((t) => ({ value: t.slug })) ?? [],
    }),
    [experience]
  )

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues,
  })

  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } =
    useFieldArray({ control, name: "keyAchievements" })

  const { fields: technologyFields, append: appendTechnology, remove: removeTechnology } =
    useFieldArray({ control, name: "technologySlugs" })

  const watchKind = watch("kind")

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/admin/technologies")
        if (res.ok) {
          const data = await res.json()
          setTechnologies(data) // doit contenir {id,name,slug,category}
        }
      } catch (e) {
        console.error("Erreur lors du chargement des technologies:", e)
      }
    })()
  }, [])

  /* ------------------------------- Handlers ------------------------------- */

  const handleNewTechNameChange = (name: string) => {
    setNewTechForm((prev) => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim(),
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
          category: newTechForm.category || null,
        }),
      })
      if (!response.ok) throw new Error("Erreur lors de la création de la technologie")
      setShowNewTechModal(false)
      setNewTechForm({ name: "", slug: "", category: "" })
      // Refresh liste
      const res2 = await fetch("/api/admin/technologies")
      if (res2.ok) setTechnologies(await res2.json())
    } catch (err) {
      console.error("Erreur:", err)
    } finally {
      setNewTechLoading(false)
    }
  }

  const addAchievement = () => appendAchievement({ value: "" })

  const addTechnology = (slug: string) => {
    const exists = technologyFields.some((f) => f.value === slug)
    if (!exists) appendTechnology({ value: slug })
  }

  const selectedTechnologySlugs = technologyFields.map((f) => f.value)
  const availableTechnologies = technologies.filter((t) => !selectedTechnologySlugs.includes(t.slug))

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      setLoading(true)
      setError(null)

      const payload = {
        title: data.title,
        place: data.place || undefined,
        kind: data.kind,
        description: data.description || undefined,
        durationMonths: data.durationMonths,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        keyAchievements: data.keyAchievements.map((k) => k.value).filter((k) => k.trim() !== ""),
        technologySlugs: data.technologySlugs.map((t) => t.value).filter((t) => t !== ""),
      }

      const res = await fetch(
        isEdit ? `/api/admin/experiences/${experience!.id}` : "/api/admin/experiences",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        let msg = "Erreur lors de l'enregistrement de l'expérience"
        try {
          const errJson = await res.json()
          msg = errJson?.error ?? msg
        } catch {}
        throw new Error(msg)
      }

      router.push("/admin/experiences")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  /* --------------------------------- Render -------------------------------- */

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Informations de base */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Briefcase className="w-5 h-5" />
          <span>Informations de base</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title">Titre du poste *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Ex: Développeur Full-Stack"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="place">Entreprise / Organisation</Label>
            <Input
              id="place"
              {...register("place")}
              placeholder="Ex: Google, Microsoft..."
            />
          </div>
        </div>

        {/* Type d'expérience */}
        <div>
          <Label htmlFor="kind">Type d'expérience *</Label>
          <select
            id="kind"
            {...register("kind")}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(EXPERIENCE_TYPES).map(([value, type]) => (
              <option key={value} value={value}>
                {type.label}
              </option>
            ))}
          </select>
          {watchKind && (
            <div className="mt-2">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${EXPERIENCE_TYPES[watchKind as ExperienceType].color}`}
              >
                {EXPERIENCE_TYPES[watchKind as ExperienceType].label}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Période et durée */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Période et durée</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="startDate">Date de début</Label>
            <Input id="startDate" type="date" {...register("startDate")} />
          </div>

          <div>
            <Label htmlFor="endDate">Date de fin</Label>
            <Input id="endDate" type="date" {...register("endDate")} />
          </div>

          <div>
            <Label htmlFor="durationMonths">Durée (en mois)</Label>
            <Input
              id="durationMonths"
              type="number"
              min="1"
              {...register("durationMonths", { valueAsNumber: true })}
              placeholder="Ex: 12"
              className={errors.durationMonths ? "border-red-500" : ""}
            />
            {errors.durationMonths && (
              <p className="text-sm text-red-600 mt-1">{errors.durationMonths.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Description</span>
        </h3>

        <div>
          <Label htmlFor="description">Description de l'expérience</Label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            placeholder="Décrivez votre rôle, vos responsabilités et le contexte..."
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Réalisations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Réalisations clés</span>
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={addAchievement}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-3">
          {achievementFields.map((field, index) => (
            <div key={field.id} className="flex items-start space-x-2">
              <textarea
                {...register(`keyAchievements.${index}.value`)}
                rows={2}
                placeholder="Ex: Développement d'une API REST utilisée par 10k+ utilisateurs"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeAchievement(index)}
                className="mt-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Technologies utilisées</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowNewTechModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle technologie
          </Button>
        </div>

        {/* Sélectionnées */}
        {technologyFields.length > 0 && (
          <div className="space-y-2">
            <Label>Technologies sélectionnées :</Label>
            <div className="flex flex-wrap gap-2">
              {technologyFields.map((field, index) => {
                const tech = technologies.find((t) => t.slug === field.value)
                return (
                  <div
                    key={field.id}
                    className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
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
          </div>
        )}

        {/* Disponibles */}
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
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/experiences")}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting || loading} className="flex items-center space-x-2">
          {isSubmitting || loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isEdit ? "Enregistrer les modifications" : "Créer l'expérience"}</span>
        </Button>
      </div>

      {/* Modal Nouvelle Technologie */}
      {showNewTechModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Nouvelle technologie</h3>
              <button
                type="button"
                onClick={() => setShowNewTechModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="newTechName">Nom de la technologie *</Label>
                <Input
                  id="newTechName"
                  value={newTechForm.name}
                  onChange={(e) => handleNewTechNameChange(e.target.value)}
                  placeholder="Ex: React Native"
                />
              </div>

              <div>
                <Label htmlFor="newTechSlug">Slug (généré automatiquement)</Label>
                <Input
                  id="newTechSlug"
                  value={newTechForm.slug}
                  onChange={(e) => setNewTechForm((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="react-native"
                />
              </div>

              <div>
                <Label htmlFor="newTechCategory">Catégorie</Label>
                <Input
                  id="newTechCategory"
                  value={newTechForm.category}
                  onChange={(e) => setNewTechForm((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Ex: Mobile Development"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowNewTechModal(false)}>
                  Annuler
                </Button>
                <Button type="button" onClick={createNewTechnology} disabled={!newTechForm.name || newTechLoading}>
                  {newTechLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Créer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
