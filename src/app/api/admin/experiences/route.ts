// src/app/api/admin/experiences/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { experienceInput } from "@/lib/validators"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error
  
  try {
    const experiences = await prisma.experience.findMany({
      include: { 
        technologies: true 
      },
      orderBy: { 
        startDate: "desc" 
      }
    })
    
    return NextResponse.json(experiences)
  } catch (error) {
    console.error("Erreur lors de la récupération des expériences:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des expériences" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error
  
  try {
    const json = await req.json()
    const parsed = experienceInput.safeParse(json)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { technologySlugs, startDate, endDate, ...data } = parsed.data

    // Récupérer les technologies
    const technologies = await prisma.technology.findMany({
      where: { slug: { in: technologySlugs || [] } },
      select: { id: true }
    })

    // Créer l'expérience
    const experience = await prisma.experience.create({
      data: {
        ...data,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        technologies: {
          connect: technologies.map(t => ({ id: t.id }))
        }
      },
      include: {
        technologies: true
      }
    })

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de l'expérience:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de l'expérience" },
      { status: 500 }
    )
  }
}

