// scripts/seed-projects.ts
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

// Données des projets à insérer
const projectsData = [
  {
    id: 1,
    title: "Classification Musicale Spotify",
    description: "Système de classification automatique de genres musicaux utilisant l'API Spotify et des algorithmes de Machine Learning.",
    longDescription: "Projet SDATA 2025 utilisant un dataset de 25492 chansons pour prédire automatiquement le genre musical parmi 23 catégories. Implémentation de plusieurs algorithmes de classification supervisée avec analyse comparative des performances.",
    category: 'data-science',
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'Spotify API', 'Machine Learning', 'Data Analysis'],
    teamSize: 3,
    duration: '3 mois',
    year: '2025',
    featured: true,
    status: 'completed',
    demoUrl: '/projects/spotify-demo',
    documentUrl: '/docs/spotify-project.pdf',
    githubUrl: 'https://github.com/youssef-mos/spotify-classification',
    image: '/projects/spotify-classification.jpg',
    highlights: [
      'Classification sur 23 genres musicaux différents',
      'Dataset de 25,492 chansons avec features audio',
      'Analyse comparative de multiple algorithmes ML',
      'Optimisation des hyperparamètres',
      'Évaluation par F1-score micro average'
    ],
    challenges: [
      'Gestion des classes déséquilibrées',
      'Feature engineering sur données audio',
      'Optimisation des performances de classification'
    ]
  },
  {
    id: 2,
    title: "HumanML3D - Animation Humaine",
    description: "Projet de Machine Learning pour la génération d'animations 3D humaines réalistes à partir de descriptions textuelles.",
    longDescription: "Implémentation d'un modèle de deep learning pour générer des mouvements humains 3D à partir de descriptions en langage naturel. Utilisation du dataset HumanML3D et techniques avancées de génération de séquences.",
    category: 'ai',
    technologies: ['Python', 'PyTorch', 'Computer Vision', 'NLP', 'Animation 3D', 'Deep Learning'],
    teamSize: 2,
    duration: '2 mois',
    year: '2024',
    featured: true,
    status: 'completed',
    demoUrl: '/projects/humanml3d-demo',
    githubUrl: 'https://github.com/youssef-mos/humanml3d',
    image: '/projects/humanml3d.jpg',
    highlights: [
      'Génération d\'animations 3D depuis du texte',
      'Modèle de deep learning avancé',
      'Dataset HumanML3D avec 14k+ animations',
      'Interface de démonstration interactive',
      'Évaluation sur métriques FID et R-precision'
    ],
    challenges: [
      'Complexité des mouvements humains',
      'Alignement texte-mouvement',
      'Optimisation des performances GPU'
    ]
  },
  {
    id: 3,
    title: "Simulation Monte-Carlo - Criticité Uranium",
    description: "Simulation de criticité nucléaire utilisant les méthodes Monte-Carlo pour analyser le comportement de l'uranium.",
    longDescription: "Projet de physique nucléaire appliquée utilisant les méthodes de Monte-Carlo pour simuler et analyser la criticité de systèmes contenant de l'uranium. Modélisation mathématique complexe avec visualisations interactives.",
    category: 'data-science',
    technologies: ['Python', 'NumPy', 'Matplotlib', 'Monte-Carlo', 'Physique Nucléaire', 'Simulation'],
    teamSize: 4,
    duration: '4 mois',
    year: '2024',
    featured: true,
    status: 'completed',
    demoUrl: '/projects/monte-carlo-demo',
    githubUrl: 'https://github.com/youssef-mos/monte-carlo-uranium',
    image: '/projects/monte-carlo.jpg',
    highlights: [
      'Simulation de réactions nucléaires',
      'Algorithmes Monte-Carlo optimisés',
      'Visualisation 3D des résultats',
      'Analyse statistique avancée',
      'Interface utilisateur interactive'
    ],
    challenges: [
      'Complexité des calculs physiques',
      'Optimisation des performances de simulation',
      'Validation des modèles mathématiques'
    ]
  },
  {
    id: 4,
    title: "Jeu Mahjong Interactif",
    description: "Implémentation complète du jeu traditionnel Mahjong avec interface moderne et mode multijoueur.",
    longDescription: "Développement d'un jeu Mahjong complet avec règles traditionnelles, interface utilisateur moderne, système de score, et possibilité de jeu en ligne. Architecture modulaire avec AI pour joueurs virtuels.",
    category: 'game',
    technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'WebSocket', 'Node.js', 'Game Logic'],
    teamSize: 3,
    duration: '2 mois',
    year: '2024',
    featured: false,
    status: 'completed',
    demoUrl: '/projects/mahjong-game',
    githubUrl: 'https://github.com/youssef-mos/mahjong-game',
    image: '/projects/mahjong.jpg',
    highlights: [
      'Logique de jeu Mahjong complète',
      'Interface utilisateur intuitive',
      'Mode multijoueur en temps réel',
      'IA pour joueurs virtuels',
      'Système de scoring traditionnel'
    ],
    challenges: [
      'Implémentation des règles complexes',
      'Synchronisation multijoueur',
      'Optimisation des performances graphiques'
    ]
  },
  {
    id: 5,
    title: "Site Web Omegup",
    description: "Refonte complète du site web d'entreprise avec focus sur l'expérience utilisateur et les performances.",
    longDescription: "Projet de stage chez Omegup : refonte complète du site web de l'entreprise avec amélioration du design, optimisation des performances, et développement de nouvelles fonctionnalités. Approche moderne avec Next.js et focus UX/UI.",
    category: 'web',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'UX/UI Design', 'SEO'],
    teamSize: 3,
    duration: '4 mois',
    year: '2024',
    featured: true,
    status: 'completed',
    demoUrl: 'https://omegup.tn',
    githubUrl: 'https://github.com/youssef-mos/omegup-website',
    image: '/projects/omegup.jpg',
    highlights: [
      'Refonte complète du design',
      'Amélioration des performances (90+ Lighthouse)',
      'Interface responsive moderne',
      'Optimisation SEO avancée',
      'Architecture Next.js scalable'
    ],
    challenges: [
      'Migration depuis l\'ancien système',
      'Optimisation des performances',
      'Intégration avec les systèmes existants'
    ]
  }
];

// Fonction utilitaire pour créer un slug
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Supprimer les tirets multiples
    .trim();
}

// Fonction pour parser la durée en mois
function parseDurationToMonths(duration: string): number {
  const match = duration.match(/(\d+)\s*(mois|an|année)/i);
  if (!match) return 1;
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  if (unit.startsWith('an')) {
    return value * 12;
  }
  return value;
}

// Fonction pour créer des dates approximatives
function createProjectDates(year: string, durationMonths: number) {
  const yearNum = parseInt(year);
  const startDate = new Date(yearNum, 0, 1); // 1er janvier de l'année
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + durationMonths);
  
  return { startDate, endDate };
}

// Mapping des catégories vers les catégories de technologies
const categoryMapping: Record<string, string> = {
  'web': 'Web Development',
  'data-science': 'Data Science',
  'ai': 'Artificial Intelligence', 
  'game': 'Game Development'
};

async function seedProjects() {
  try {
    console.log('🌱 Début du seed des projets...');

    // 1. Collecter toutes les technologies uniques
    const allTechnologies = new Set<string>();
    projectsData.forEach(project => {
      project.technologies.forEach(tech => allTechnologies.add(tech));
    });

    console.log(`📦 Création de ${allTechnologies.size} technologies...`);

    // 2. Créer ou récupérer toutes les technologies
    const techMap = new Map<string, any>();
    
    for (const techName of allTechnologies) {
      // Déterminer la catégorie de la technologie
      let category = 'Other';
      if (['React', 'Next.js', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML5 Canvas', 'CSS3', 'Tailwind CSS'].includes(techName)) {
        category = 'Web Development';
      } else if (['Python', 'NumPy', 'Matplotlib', 'Pandas', 'Scikit-learn'].includes(techName)) {
        category = 'Data Science';
      } else if (['Machine Learning', 'Deep Learning', 'PyTorch', 'Computer Vision', 'NLP'].includes(techName)) {
        category = 'Artificial Intelligence';
      } else if (['Node.js', 'WebSocket'].includes(techName)) {
        category = 'Backend';
      } else if (['Game Logic'].includes(techName)) {
        category = 'Game Development';
      }

      const technology = await prisma.technology.upsert({
        where: { slug: createSlug(techName) },
        update: {},
        create: {
          name: techName,
          slug: createSlug(techName),
          category: category,
          iconUrl: null // Vous pouvez ajouter des URLs d'icônes plus tard
        }
      });
      
      techMap.set(techName, technology);
      console.log(`✅ Technologie créée/trouvée: ${techName} (${category})`);
    }

    console.log('🚀 Création des projets...');

    // 3. Créer les projets
    for (const projectData of projectsData) {
      const slug = createSlug(projectData.title);
      const durationMonths = parseDurationToMonths(projectData.duration);
      const { startDate, endDate } = createProjectDates(projectData.year, durationMonths);
      
      // Préparer les technologies pour la relation
      const projectTechnologies = projectData.technologies.map(techName => ({
        id: techMap.get(techName)!.id
      }));

      // Combiner highlights et challenges pour keyPoints
      const keyPoints = [
        ...projectData.highlights,
        ...projectData.challenges.map(c => `Défi: ${c}`)
      ];

      // Créer des mots-clés à partir de la description et des technologies
      const keywords = [
        ...projectData.technologies.map(t => t.toLowerCase()),
        projectData.category,
        projectData.year,
        'projet',
        'développement'
      ];

      const project = await prisma.project.upsert({
        where: { slug },
        update: {
          title: projectData.title,
          description: projectData.description,
          keyPoints: keyPoints,
          keywords: keywords,
          teamSize: projectData.teamSize,
          durationMonths: durationMonths,
          startDate: startDate,
          endDate: endDate,
          favorite: projectData.featured,
          logoUrl: projectData.image,
          technologies: {
            set: projectTechnologies
          }
        },
        create: {
          title: projectData.title,
          slug: slug,
          description: projectData.description,
          keyPoints: keyPoints,
          keywords: keywords,
          teamSize: projectData.teamSize,
          durationMonths: durationMonths,
          startDate: startDate,
          endDate: endDate,
          favorite: projectData.featured,
          logoUrl: projectData.image,
          technologies: {
            connect: projectTechnologies
          }
        },
        include: {
          technologies: true
        }
      });

      console.log(`✅ Projet créé/mis à jour: ${project.title}`);
      console.log(`   - Slug: ${project.slug}`);
      console.log(`   - Technologies: ${project.technologies.map(t => t.name).join(', ')}`);
      console.log(`   - Durée: ${project.durationMonths} mois`);
      console.log(`   - Favori: ${project.favorite ? 'Oui' : 'Non'}`);
      console.log('');
    }

    console.log('🎉 Seed des projets terminé avec succès !');
    
    // Afficher un résumé
    const totalProjects = await prisma.project.count();
    const totalTechnologies = await prisma.technology.count();
    const favoriteProjects = await prisma.project.count({ where: { favorite: true } });
    
    console.log('\n📊 Résumé:');
    console.log(`   - Projets total: ${totalProjects}`);
    console.log(`   - Technologies total: ${totalTechnologies}`);
    console.log(`   - Projets favoris: ${favoriteProjects}`);

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
if (require.main === module) {
  seedProjects()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedProjects;