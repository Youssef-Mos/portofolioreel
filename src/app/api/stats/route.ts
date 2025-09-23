// app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Récupérer les statistiques en parallèle
    const [
      projectsCount,
      experiencesCount,
      engagementsCount,
      technologiesCount,
      favoriteProjectsCount,
      recentProjectsCount,
      totalDurationExperiences,
      totalDurationEngagements
    ] = await Promise.all([
      prisma.project.count(),
      prisma.experience.count(),
      prisma.engagement.count(),
      prisma.technology.count(),
      prisma.project.count({ where: { favorite: true } }),
      prisma.project.count({ 
        where: { 
          createdAt: { 
            gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) // 6 derniers mois
          } 
        } 
      }),
      prisma.experience.aggregate({
        _sum: { durationMonths: true }
      }),
      prisma.engagement.aggregate({
        _sum: { durationMonths: true }
      })
    ]);

    // Récupérer les technologies les plus utilisées
    const topTechnologies = await prisma.technology.findMany({
      include: {
        _count: {
          select: {
            projects: true,
            experiences: true,
            engagements: true
          }
        }
      },
      orderBy: {
        projects: {
          _count: 'desc'
        }
      },
      take: 5
    });

    // Récupérer les types d'expériences
    const experienceTypes = await prisma.experience.groupBy({
      by: ['kind'],
      _count: {
        kind: true
      }
    });

    // Récupérer les types d'engagements
    const engagementTypes = await prisma.engagement.groupBy({
      by: ['kind'],
      _count: {
        kind: true
      }
    });

    const stats = {
      general: {
        totalProjects: projectsCount,
        totalExperiences: experiencesCount,
        totalEngagements: engagementsCount,
        totalTechnologies: technologiesCount,
        favoriteProjects: favoriteProjectsCount,
        recentProjects: recentProjectsCount
      },
      duration: {
        totalExperienceMonths: totalDurationExperiences._sum.durationMonths || 0,
        totalEngagementMonths: totalDurationEngagements._sum.durationMonths || 0,
        averageProjectDuration: projectsCount > 0 ? 
          Math.round((totalDurationExperiences._sum.durationMonths || 0) / projectsCount) : 0
      },
      topTechnologies: topTechnologies.map(tech => ({
        name: tech.name,
        category: tech.category,
        iconUrl: tech.iconUrl,
        totalUsage: tech._count.projects + tech._count.experiences + tech._count.engagements,
        projects: tech._count.projects,
        experiences: tech._count.experiences,
        engagements: tech._count.engagements
      })),
      experienceTypes: experienceTypes.map(type => ({
        type: type.kind,
        count: type._count.kind
      })),
      engagementTypes: engagementTypes.map(type => ({
        type: type.kind,
        count: type._count.kind
      })),
      activity: {
        hasProjects: projectsCount > 0,
        hasExperiences: experiencesCount > 0,
        hasEngagements: engagementsCount > 0,
        isActive: recentProjectsCount > 0
      }
    };

    return NextResponse.json({
      success: true,
      data: stats,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des statistiques' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}