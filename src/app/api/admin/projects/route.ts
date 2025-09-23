// src/app/api/admin/projects/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { projectInput } from "@/lib/validators"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error
  
  try {
    const projects = await prisma.project.findMany({
      include: { 
        technologies: true 
      },
      orderBy: { 
        createdAt: "desc" 
      }
    })
    
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des projets" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.error
  
  try {
    const json = await req.json()
    const parsed = projectInput.safeParse(json)
    
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

    // Créer le projet
    const project = await prisma.project.create({
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

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du projet" },
      { status: 500 }
    )
  }
}