// src/app/admin/technologies/[slug]/modifier/page.tsx
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"
import { TechnologyForm } from "@/components/admin/TechnologyForm"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EditTechnologyPage({ params }: PageProps) {
  const guard = await requireAdmin()
  if (!guard.ok) redirect("/auth/signin")

  const { slug } = await params

  const tech = await prisma.technology.findFirst({
    where: { OR: [{ id: slug }, { slug }] },
  })

  if (!tech) notFound()

  const technology = {
    id: tech.id,
    name: tech.name,
    slug: tech.slug,
    category: tech.category ?? "",
    iconUrl: tech.iconUrl ?? "",
    createdAt: tech.createdAt.toISOString(),
    updatedAt: tech.updatedAt.toISOString(),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modifier la technologie</h1>
          <p className="text-gray-600 mt-2">
            Modifiez les informations de &quot;{technology.name}&quot;
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <TechnologyForm technology={technology} />
      </div>
    </div>
  )
}
