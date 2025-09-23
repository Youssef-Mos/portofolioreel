// src/app/api/admin/engagements/[slug]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"

// GET - Récupérer un engagement spécifique
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    // Await les params car ils sont async dans Next.js 15
    const { slug } = await params
    
    const engagement = await prisma.engagement.findUnique({
      where: { id: slug },
      include: { technologies: true }
    })

    if (!engagement) {
      return NextResponse.json(
        { error: "Engagement non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json(engagement)
  } catch (error) {
    console.error("Erreur lors de la récupération de l'engagement:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'engagement" },
      { status: 500 }
    )
  }
}

// PATCH - Modifier un engagement
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    // Await les params car ils sont async dans Next.js 15
    const { slug } = await params
    const json = await req.json()

    // Vérifier que l'engagement existe
    const existingEngagement = await prisma.engagement.findUnique({
      where: { id: slug }
    })

    if (!existingEngagement) {
      return NextResponse.json(
        { error: "Engagement non trouvé" },
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

    // Mettre à jour l'engagement
    const updatedEngagement = await prisma.engagement.update({
      where: { id: slug },
      data,
      include: { technologies: true }
    })

    return NextResponse.json(updatedEngagement)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'engagement:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'engagement" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un engagement
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    // Await les params car ils sont async dans Next.js 15
    const { slug } = await params

    // Vérifier que l'engagement existe
    const existingEngagement = await prisma.engagement.findUnique({
      where: { id: slug }
    })

    if (!existingEngagement) {
      return NextResponse.json(
        { error: "Engagement non trouvé" },
        { status: 404 }
      )
    }

    // Supprimer l'engagement
    await prisma.engagement.delete({
      where: { id: slug }
    })

    return NextResponse.json(
      { message: "Engagement supprimé avec succès" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de la suppression de l'engagement:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'engagement" },
      { status: 500 }
    )
  }
}