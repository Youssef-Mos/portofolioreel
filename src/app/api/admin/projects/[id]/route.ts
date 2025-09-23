// src/app/api/admin/projects/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"

// GET - Récupérer un projet spécifique
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    // Await les params car ils sont async dans Next.js 15
    const { id } = await params
    
    const project = await prisma.project.findUnique({
      where: { id: id },
      include: { technologies: true }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération du projet" },
      { status: 500 }
    )
  }
}

// PATCH - Modifier un projet
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    // Await les params car ils sont async dans Next.js 15
    const { id } = await params
    const json = await req.json()

    // Vérifier que le projet existe
    const existingProject = await prisma.project.findUnique({
      where: { id: id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      )
    }

    // Séparer les technologies du reste des données
    const { technologySlugs, startDate, endDate, ...updateData } = json

    // Préparer les données de mise à jour
    const data: any = {
      ...updateData,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    }

    // Gérer les technologies si elles sont fournies
    if (technologySlugs && Array.isArray(technologySlugs)) {
      const technologies = await prisma.technology.findMany({
        where: { slug: { in: technologySlugs } },
        select: { id: true }
      })
      
      data.technologies = {
        set: technologies.map(t => ({ id: t.id }))
      }
    }

    // Mettre à jour le projet
    const updatedProject = await prisma.project.update({
      where: { id: id },
      data,
      include: { technologies: true }
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du projet" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un projet
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    // Await les params car ils sont async dans Next.js 15
    const { id } = await params

    // Vérifier que le projet existe
    const existingProject = await prisma.project.findUnique({
      where: { id: id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      )
    }

    // Supprimer le projet (les relations many-to-many sont automatiquement supprimées)
    await prisma.project.delete({
      where: { id: id }
    })

    return NextResponse.json(
      { message: "Projet supprimé avec succès" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression du projet" },
      { status: 500 }
    )
  }
}