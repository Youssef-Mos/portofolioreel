// src/app/admin/engagements/[slug]/modifier/page.tsx
import { notFound, redirect } from "next/navigation"
import { EngagementForm } from "@/components/admin/EngagementForm"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EditEngagementPage({ params }: PageProps) {
  // Vérifier l'authentification admin
  const guard = await requireAdmin()
  if (!guard.ok) {
    redirect('/auth/signin')
  }

  const { slug } = await params

  try {
    // Récupérer l'engagement directement via Prisma (slug = ID)
    const engagement = await prisma.engagement.findUnique({
      where: { id: slug },
      include: { technologies: true }
    })

    if (!engagement) {
      notFound()
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Modifier l'engagement</h1>
            <p className="text-gray-600 mt-2">
              Modifiez les informations de l'engagement "{engagement.title}"
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <EngagementForm engagement={{
            ...engagement,
            startDate: engagement.startDate?.toISOString().split('T')[0] || null,
            endDate: engagement.endDate?.toISOString().split('T')[0] || null
          }} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Erreur lors du chargement de l'engagement:", error)
    notFound()
  }
}