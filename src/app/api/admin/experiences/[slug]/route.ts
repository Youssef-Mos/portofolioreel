// src/app/api/admin/experiences/[slug]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"

// GET - Récupérer une expérience spécifique
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    // Await les params car ils sont async dans Next.js 15
    const { slug } = await params
    
    // Chercher par ID (si c'est un cuid)
    const experience = await prisma.experience.findUnique({
      where: { id: slug },
      include: { technologies: true }
    })

    if (!experience) {
      return NextResponse.json(
        { error: "Expérience non trouvée" },
        { status: 404 }
      )
    }

    return NextResponse.json(experience)
  } catch (error) {
    console.error("Erreur lors de la récupération de l'expérience:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'expérience" },
      { status: 500 }
    )
  }
}

// PATCH - Modifier une expérience
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

    // Vérifier que l'expérience existe
    const existingExperience = await prisma.experience.findUnique({
      where: { id: slug }
    })

    if (!existingExperience) {
      return NextResponse.json(
        { error: "Expérience non trouvée" },
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

    // Mettre à jour l'expérience
    const updatedExperience = await prisma.experience.update({
      where: { id: slug },
      data,
      include: { technologies: true }
    })

    return NextResponse.json(updatedExperience)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'expérience:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'expérience" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une expérience
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    // Await les params car ils sont async dans Next.js 15
    const { slug } = await params

    // Vérifier que l'expérience existe
    const existingExperience = await prisma.experience.findUnique({
      where: { id: slug }
    })

    if (!existingExperience) {
      return NextResponse.json(
        { error: "Expérience non trouvée" },
        { status: 404 }
      )
    }

    // Supprimer l'expérience
    await prisma.experience.delete({
      where: { id: slug }
    })

    return NextResponse.json(
      { message: "Expérience supprimée avec succès" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de la suppression de l'expérience:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'expérience" },
      { status: 500 }
    )
  }
}