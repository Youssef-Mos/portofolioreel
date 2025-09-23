// app/api/experiences/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
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
        { startDate: 'desc' } // Par date décroissante
      ]
    });

    // Formatter les données pour le frontend
    const formattedExperiences = experiences.map(experience => ({
      id: experience.id,
      title: experience.title,
      place: experience.place,
      kind: experience.kind,
      description: experience.description,
      durationMonths: experience.durationMonths,
      startDate: experience.startDate,
      endDate: experience.endDate,
      keyAchievements: experience.keyAchievements,
      technologies: experience.technologies.map(tech => ({
        id: tech.id,
        name: tech.name,
        slug: tech.slug,
        category: tech.category,
        iconUrl: tech.iconUrl
      })),
      createdAt: experience.createdAt,
      updatedAt: experience.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedExperiences,
      count: formattedExperiences.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des expériences:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des expériences' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}