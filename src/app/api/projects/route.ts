// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
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
      },
      orderBy: [
        { favorite: 'desc' }, // Projets favoris en premier
        { startDate: 'desc' }  // Puis par date décroissante
      ]
    });

    // Formatter les données pour le frontend
    const formattedProjects = projects.map(project => ({
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
      technologies: project.technologies.map(tech => ({
        id: tech.id,
        name: tech.name,
        slug: tech.slug,
        category: tech.category,
        iconUrl: tech.iconUrl
      })),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedProjects,
      count: formattedProjects.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des projets' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}