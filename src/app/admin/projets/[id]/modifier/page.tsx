// src/app/admin/projets/[id]/modifier/page.tsx
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { ProjectForm } from "@/components/admin/ProjectForm"

interface PageProps {
  params: Promise<{ id: string }> // <- params est une Promise ici
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params // <- on attend params

  const h = await headers()
  const protocol = h.get("x-forwarded-proto") ?? "http"
  const host = h.get("x-forwarded-host") ?? h.get("host")
  if (!host) {
    // Sécurité : si pas d'host, on renvoie 404 proprement
    notFound()
  }
  const baseUrl = `${protocol}://${host}`

  try {
    const response = await fetch(`${baseUrl}/api/admin/projects/${id}`, {
      cache: "no-store",
      headers: {
        // forward cookies pour que ton middleware / NextAuth te reconnaisse
        cookie: h.get("cookie") ?? ""
      }
    })

    if (!response.ok) {
      if (response.status === 404) notFound()
      throw new Error(`Erreur ${response.status}`)
    }

    const project = await response.json()

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Modifier le projet</h1>
            <p className="text-gray-600 mt-2">
              Modifiez les informations du projet &quot;{project.title}&quot;
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <ProjectForm project={project} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Erreur lors du chargement du projet:", error)
    notFound()
  }
}
