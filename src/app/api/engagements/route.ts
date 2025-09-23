// app/api/engagements/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const engagements = await prisma.engagement.findMany({
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
    const formattedEngagements = engagements.map(engagement => ({
      id: engagement.id,
      title: engagement.title,
      place: engagement.place,
      kind: engagement.kind,
      description: engagement.description,
      durationMonths: engagement.durationMonths,
      startDate: engagement.startDate,
      endDate: engagement.endDate,
      keyAchievements: engagement.keyAchievements,
      technologies: engagement.technologies.map(tech => ({
        id: tech.id,
        name: tech.name,
        slug: tech.slug,
        category: tech.category,
        iconUrl: tech.iconUrl
      })),
      createdAt: engagement.createdAt,
      updatedAt: engagement.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedEngagements,
      count: formattedEngagements.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des engagements:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des engagements' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}