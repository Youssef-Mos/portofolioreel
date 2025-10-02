// src/app/api/projects/[slug]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Récupérer un projet spécifique (route publique)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const project = await prisma.project.findUnique({
      where: { slug: slug },
      include: { 
        technologies: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            iconUrl: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      )
    }

    // Formatter les données pour le frontend
    const formattedProject = {
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      keyPoints: project.keyPoints,
      keywords: project.keywords,
      teamSize: project.teamSize,
      durationMonths: project.durationMonths,
      startDate: project.startDate,
      endDate: project.endDate,
      favorite: project.favorite,
      logoUrl: project.logoUrl,
      githubUrl: project.githubUrl,
      testProject: project.testProject,
      technologies: project.technologies,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }

    return NextResponse.json(formattedProject)
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération du projet" },
      { status: 500 }
    )
  }
}