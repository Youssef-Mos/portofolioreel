// src/app/api/admin/technologies/[slug]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"

// GET - Récupérer une technologie spécifique
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    // Await les params car ils sont async dans Next.js 15
    const { slug } = await params
    
    // Chercher par ID ou par slug
    const technology = await prisma.technology.findFirst({
      where: {
        OR: [
          { id: slug },
          { slug: slug }
        ]
      },
      include: {
        _count: {
          select: {
            projects: true,
            experiences: true,
            engagements: true
          }
        },
        projects: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        experiences: {
          select: {
            id: true,
            title: true,
            place: true
          }
        },
        engagements: {
          select: {
            id: true,
            title: true,
            place: true
          }
        }
      }
    })

    if (!technology) {
      return NextResponse.json(
        { error: "Technologie non trouvée" },
        { status: 404 }
      )
    }

    return NextResponse.json(technology)
  } catch (error) {
    console.error("Erreur lors de la récupération de la technologie:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la technologie" },
      { status: 500 }
    )
  }
}

// PATCH - Modifier une technologie
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
    
    // Vérifier que la technologie existe
    const existingTechnology = await prisma.technology.findFirst({
      where: {
        OR: [
          { id: slug },
          { slug: slug }
        ]
      }
    })

    if (!existingTechnology) {
      return NextResponse.json(
        { error: "Technologie non trouvée" },
        { status: 404 }
      )
    }

    // Vérifier si le nouveau slug est unique (s'il est modifié)
    if (json.slug && json.slug !== existingTechnology.slug) {
      const slugExists = await prisma.technology.findUnique({
        where: { slug: json.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: "Une technologie avec ce slug existe déjà" },
          { status: 409 }
        )
      }
    }

    // Mettre à jour la technologie
    const updatedTechnology = await prisma.technology.update({
      where: { id: existingTechnology.id },
      data: {
        name: json.name || existingTechnology.name,
        slug: json.slug || existingTechnology.slug,
        category: json.category !== undefined ? json.category : existingTechnology.category,
        iconUrl: json.iconUrl !== undefined ? json.iconUrl : existingTechnology.iconUrl
      },
      include: {
        _count: {
          select: {
            projects: true,
            experiences: true,
            engagements: true
          }
        }
      }
    })

    return NextResponse.json(updatedTechnology)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la technologie:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la technologie" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une technologie
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error

  try {
    // Await les params car ils sont async dans Next.js 15
    const { slug } = await params
    
    // Vérifier que la technologie existe
    const existingTechnology = await prisma.technology.findFirst({
      where: {
        OR: [
          { id: slug },
          { slug: slug }
        ]
      },
      include: {
        _count: {
          select: {
            projects: true,
            experiences: true,
            engagements: true
          }
        }
      }
    })

    if (!existingTechnology) {
      return NextResponse.json(
        { error: "Technologie non trouvée" },
        { status: 404 }
      )
    }

    // Vérifier si la technologie est utilisée
    const totalUsage = existingTechnology._count.projects + 
                      existingTechnology._count.experiences + 
                      existingTechnology._count.engagements

    if (totalUsage > 0) {
      return NextResponse.json(
        { 
          error: "Impossible de supprimer cette technologie car elle est utilisée dans des projets, expériences ou engagements",
          details: {
            projects: existingTechnology._count.projects,
            experiences: existingTechnology._count.experiences,
            engagements: existingTechnology._count.engagements
          }
        },
        { status: 409 }
      )
    }

    // Supprimer la technologie
    await prisma.technology.delete({
      where: { id: existingTechnology.id }
    })

    return NextResponse.json(
      { message: "Technologie supprimée avec succès" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de la suppression de la technologie:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la technologie" },
      { status: 500 }
    )
  }
}