// src/app/api/admin/technologies/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { technologyInput } from "@/lib/validators"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error
  
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: { name: "asc" },
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
    
    return NextResponse.json(technologies)
  } catch (error) {
    console.error("Erreur lors de la récupération des technologies:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des technologies" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error
  
  try {
    const json = await req.json()
    const parsed = technologyInput.safeParse(json)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { name, slug, category, iconUrl } = parsed.data

    // Vérifier si le slug existe déjà
    const existingTechnology = await prisma.technology.findUnique({
      where: { slug }
    })

    if (existingTechnology) {
      return NextResponse.json(
        { error: "Une technologie avec ce slug existe déjà" },
        { status: 409 }
      )
    }

    // Créer la technologie
    const technology = await prisma.technology.create({
      data: {
        name,
        slug,
        category,
        iconUrl
      }
    })

    return NextResponse.json(technology, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la technologie:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la technologie" },
      { status: 500 }
    )
  }
}