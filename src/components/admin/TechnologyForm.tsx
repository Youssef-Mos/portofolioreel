// src/components/admin/TechnologyForm.tsx
"use client"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Save,
  Loader2,
  AlertCircle,
  Tag,
  Image as ImageIcon,
  Users,
  Briefcase,
  Heart,
  Zap,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/* ----------------------------- Types & constants ----------------------------- */

const technologySchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  slug: z.string().min(1, "Le slug est requis").max(100, "Le slug est trop long"),
  category: z.string().optional(),
  iconUrl: z.string().url("URL invalide").optional().or(z.literal(""))
})
type TechnologyFormData = z.infer<typeof technologySchema>

export interface TechnologyFormProps {
  technology?: {
    id: string
    name: string
    slug: string
    category: string
    iconUrl: string
    createdAt: string
    updatedAt: string
  }
}

const TECHNOLOGY_CATEGORIES = {
  "Compétences Techniques": {
    icon: <span className="inline-block w-4 h-4">{"</>"}</span>,
    color: "bg-blue-100 text-blue-800",
    categories: [
      "Web Development","Programming","Data Science","Artificial Intelligence","Design",
      "DevOps","Mobile Development","Database","Security"
    ]
  },
  "Soft Skills": {
    icon: <Users className="w-4 h-4" />,
    color: "bg-green-100 text-green-800",
    categories: [
      "Soft Skills","Leadership","Communication","Problem Solving",
      "Project Management","Teamwork","Creativity","Critical Thinking"
    ]
  },
  "Domaines d'Expertise": {
    icon: <Briefcase className="w-4 h-4" />,
    color: "bg-purple-100 text-purple-800",
    categories: [
      "Marketing","Healthcare","Education","Finance","Operations","Consulting","Research","Sales"
    ]
  },
  "Autres": {
    icon: <Heart className="w-4 h-4" />,
    color: "bg-gray-100 text-gray-800",
    categories: ["Languages","Tools","Frameworks","Certifications","Other"]
  }
} as const

const POPULAR_ICONS = [
  { name: "React", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Vue.js", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
  { name: "Angular", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
  { name: "Node.js", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Python", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "JavaScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Java", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "C#", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
  { name: "PHP", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "Docker", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Kubernetes", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" }
]

/* --------------------------------- Component -------------------------------- */

export function TechnologyForm({ technology }: TechnologyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showIconSuggestions, setShowIconSuggestions] = useState(false)
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string>("")

  const isEdit = Boolean(technology?.id)

  const defaultValues: TechnologyFormData = useMemo(() => ({
    name: technology?.name ?? "",
    slug: technology?.slug ?? "",
    category: technology?.category ?? "",
    iconUrl: technology?.iconUrl ?? ""
  }), [technology])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues
  })

  const watchName = watch("name")
  const watchCategory = watch("category")
  const watchIconUrl = watch("iconUrl")

  // Auto-slug uniquement en création
  useEffect(() => {
    if (!isEdit && watchName) {
      const slug = watchName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setValue("slug", slug, { shouldValidate: true })
    }
  }, [watchName, setValue, isEdit])

  // Déterminer le groupe de catégorie sélectionné
  useEffect(() => {
    if (watchCategory) {
      for (const [groupName, group] of Object.entries(TECHNOLOGY_CATEGORIES)) {
        if (group.categories.includes(watchCategory as never)) {
          setSelectedCategoryGroup(groupName)
          break
        }
      }
    } else {
      setSelectedCategoryGroup("")
    }
  }, [watchCategory])

  const onSubmit = async (data: TechnologyFormData) => {
    try {
      setLoading(true)
      setError(null)

      const payload = {
        name: data.name.trim(),
        slug: data.slug.trim(),
        category: data.category || undefined,
        iconUrl: data.iconUrl?.trim() || undefined
      }

      const res = await fetch(
        isEdit ? `/api/admin/technologies/${technology!.id}` : "/api/admin/technologies",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      )

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        if (res.status === 400) throw new Error("Données invalides. Vérifiez les champs requis.")
        if (res.status === 409) throw new Error("Une technologie avec ce nom ou ce slug existe déjà.")
        throw new Error(errorData.error || "Erreur lors de l'enregistrement de la technologie")
      }

      router.push("/admin/technologies")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const selectIcon = (iconUrl: string) => {
    setValue("iconUrl", iconUrl, { shouldValidate: true })
    setShowIconSuggestions(false)
  }

  const selectCategory = (category: string) => {
    setValue("category", category, { shouldValidate: true })
  }

  const getCategoryGroupColor = (groupName: string) =>
    (TECHNOLOGY_CATEGORIES as any)[groupName]?.color || "bg-gray-100 text-gray-800"

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
          <Tag className="w-5 h-5" />
          <span>Informations de base</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Nom de la technologie *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ex: React, Python, Leadership..."
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              {...register("slug")}
              placeholder="react, python, leadership..."
              className={errors.slug ? "border-red-500" : ""}
            />
            {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>}
          </div>
        </div>
      </div>

      {/* Catégorie */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Briefcase className="w-5 h-5" />
          <span>Catégorie</span>
        </h3>

        <div className="space-y-4">
          {Object.entries(TECHNOLOGY_CATEGORIES).map(([groupName, group]) => (
            <div key={groupName} className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className={`p-1 rounded ${group.color}`}>{group.icon}</div>
                <h4 className="font-medium text-gray-900">{groupName}</h4>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ml-7">
                {group.categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => selectCategory(category)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                      watchCategory === category
                        ? `${group.color} border-current`
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {watchCategory && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <strong>Catégorie sélectionnée :</strong> {watchCategory}
              {selectedCategoryGroup && (
                <span className="ml-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryGroupColor(
                      selectedCategoryGroup
                    )}`}
                  >
                    {selectedCategoryGroup}
                  </span>
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Icône */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <ImageIcon className="w-5 h-5" />
          <span>Icône (optionnel)</span>
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="iconUrl">URL de l'icône</Label>
            <div className="flex space-x-2">
              <Input
                id="iconUrl"
                {...register("iconUrl")}
                placeholder="https://..."
                className={errors.iconUrl ? "border-red-500 flex-1" : "flex-1"}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowIconSuggestions((v) => !v)}
                className="flex items-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Suggestions</span>
              </Button>
            </div>
            {errors.iconUrl && <p className="text-sm text-red-600 mt-1">{errors.iconUrl.message}</p>}
          </div>

          {/* Aperçu de l'icône */}
          {watchIconUrl && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-white rounded border flex items-center justify-center">
                <img
                  src={watchIconUrl}
                  alt="Aperçu"
                  className="w-6 h-6 object-contain"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Aperçu de l'icône</p>
                <p className="text-xs text-gray-500">L'icône s'affichera ainsi dans le portfolio</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setValue("iconUrl", "")}
                className="ml-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Suggestions d'icônes */}
          {showIconSuggestions && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Icônes populaires</h4>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowIconSuggestions(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                {POPULAR_ICONS.map((icon) => (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => selectIcon(icon.url)}
                    className="p-2 bg-white border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                    title={icon.name}
                  >
                    <img src={icon.url} alt={icon.name} className="w-6 h-6 object-contain mx-auto" />
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Cliquez sur une icône pour la sélectionner, ou entrez votre propre URL ci-dessus.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/technologies")}
          disabled={isSubmitting || loading}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting || loading} className="flex items-center space-x-2">
          {isSubmitting || loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isEdit ? "Enregistrer les modifications" : "Créer la technologie"}</span>
        </Button>
      </div>
    </form>
  )
}
