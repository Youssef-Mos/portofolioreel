// app/api/technologies/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const whereClause = category ? { category } : {};

    const technologies = await prisma.technology.findMany({
      where: whereClause,
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
        name: 'asc'
      }
    });

    // Formatter les données avec les compteurs d'utilisation
    const formattedTechnologies = technologies.map(tech => ({
      id: tech.id,
      name: tech.name,
      slug: tech.slug,
      category: tech.category,
      iconUrl: tech.iconUrl,
      usage: {
        projects: tech._count.projects,
        experiences: tech._count.experiences,
        engagements: tech._count.engagements,
        total: tech._count.projects + tech._count.experiences + tech._count.engagements
      },
      createdAt: tech.createdAt,
      updatedAt: tech.updatedAt
    }));

    // Grouper par catégorie si demandé
    const groupedByCategory = category ? formattedTechnologies : 
      formattedTechnologies.reduce((acc, tech) => {
        const cat = tech.category || 'Autres';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(tech);
        return acc;
      }, {} as Record<string, typeof formattedTechnologies>);

    return NextResponse.json({
      success: true,
      data: category ? formattedTechnologies : groupedByCategory,
      count: formattedTechnologies.length,
      categories: category ? null : Object.keys(groupedByCategory)
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des technologies:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des technologies' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}