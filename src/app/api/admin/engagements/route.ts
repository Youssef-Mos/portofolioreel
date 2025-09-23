// src/app/api/admin/engagements/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { engagementInput } from "@/lib/validators"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error
  
  try {
    const engagements = await prisma.engagement.findMany({
      include: { 
        technologies: true 
      },
      orderBy: { 
        startDate: "desc" 
      }
    })
    
    return NextResponse.json(engagements)
  } catch (error) {
    console.error("Erreur lors de la récupération des engagements:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des engagements" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error
  
  try {
    const json = await req.json()
    const parsed = engagementInput.safeParse(json)
    
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

    // Créer l'engagement
    const engagement = await prisma.engagement.create({
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

    return NextResponse.json(engagement, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de l'engagement:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de l'engagement" },
      { status: 500 }
    )
  }
}