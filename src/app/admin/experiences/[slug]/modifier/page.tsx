// src/app/admin/experiences/[slug]/modifier/page.tsx
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"
import { ExperienceForm } from "@/components/admin/ExperienceForm"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EditExperiencePage({ params }: PageProps) {
  const guard = await requireAdmin()
  if (!guard.ok) redirect("/auth/signin")

  const { slug } = await params

  try {
    const exp = await prisma.experience.findFirst({
      where: { id: slug },
      include: { technologies: true }
    })

    if (!exp) notFound()

    // DTO sérialisable pour le client
    const experience = {
      id: exp.id,
      title: exp.title,
      place: exp.place,
      kind: exp.kind as any, // ou mappe vers le type string union si nécessaire
      description: exp.description,
      durationMonths: exp.durationMonths,
      startDate: exp.startDate ? exp.startDate.toISOString() : null,
      endDate: exp.endDate ? exp.endDate.toISOString() : null,
      keyAchievements: exp.keyAchievements,
      technologies: exp.technologies.map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        category: t.category
      })),
      createdAt: exp.createdAt.toISOString(),
      updatedAt: exp.updatedAt.toISOString()
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Modifier l'expérience</h1>
            <p className="text-gray-600 mt-2">
              Modifiez les informations de l'expérience &quot;{experience.title}&quot;
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <ExperienceForm experience={experience} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Erreur lors du chargement de l'expérience:", error)
    notFound()
  }
}
