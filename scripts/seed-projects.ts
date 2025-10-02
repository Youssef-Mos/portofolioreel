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
  },
  // NOUVEAUX PROJETS DU STAGE
  {
    id: 6,
    title: "Système de Reporting Automatisé IXI",
    description: "Développement et gestion d'un système de reporting journalier, hebdomadaire et mensuel pour le groupe IXI.",
    longDescription: "Mise en place d'un système complet de reporting multi-niveau (journalier, hebdomadaire, mensuel et semestriel) regroupant des données clés sur l'ensemble des activités du groupe IXI. Les rapports sont destinés à plusieurs départements internes et aux compagnies partenaires, permettant un suivi quotidien des indicateurs de performance.",
    category: 'data-science',
    technologies: ['SQL', 'Power BI', 'Excel', 'Data Analysis', 'ETL', 'Reporting'],
    teamSize: 1,
    duration: '1 mois',
    year: '2025',
    featured: true,
    status: 'completed',
    image: '/projects/reporting-ixi.jpg',
    highlights: [
      'Reporting journalier IXI Global et Réseau Qualité V5',
      'Traitement de rapports hebdomadaires multi-compagnies',
      'Gestion des reporting mensuels et semestriels',
      'Extraction et transformation de données via SQL',
      'Actualisation automatique des dashboards Power BI',
      'Coordination avec IXI-REP pour analyses spécifiques'
    ],
    challenges: [
      'Adaptation aux différents processus par compagnie',
      'Gestion des saisies manuelles chronophages',
      'Coordination avec multiples départements'
    ]
  },
  {
    id: 7,
    title: "Dashboard Power BI Commercial",
    description: "Tableau de bord interactif pour le suivi commercial avec système de prévision intégré.",
    longDescription: "Projet majeur visant à offrir un tableau de bord complet pour suivre les KPI globaux, analyser la performance par client et par région, et détecter les clients à relancer. Intégration d'une fonctionnalité de prévision commerciale basée sur l'historique avec différents scénarios (optimiste, réaliste, pessimiste).",
    category: 'data-science',
    technologies: ['Power BI', 'DAX', 'Excel', 'SQL', 'Data Visualization', 'Predictive Analytics'],
    teamSize: 1,
    duration: '1 mois',
    year: '2025',
    featured: true,
    status: 'completed',
    image: '/projects/dashboard-commercial.jpg',
    highlights: [
      'KPI globaux avec analyse multi-dimensionnelle',
      'Système de prévision commerciale avec régression linéaire',
      'Détection automatique des clients à relancer',
      'Analyse de performance par région et par client',
      'Scénarios de projection (optimiste/réaliste/pessimiste)',
      'Interface interactive et intuitive'
    ],
    challenges: [
      'Communication complexe avec le secteur commercial',
      'Nombreuses modifications pendant le développement',
      'Implémentation de prédictions avec DAX uniquement',
      'Limitation des outils pour l\'analyse prédictive'
    ]
  },
  {
    id: 8,
    title: "Rapport PALM - Gestion des Compétences",
    description: "Outil de centralisation des compétences et parcours des collaborateurs du groupe IXI.",
    longDescription: "Développement d'un rapport Power BI permettant de centraliser et visualiser les compétences et parcours professionnels des collaborateurs. Le système comprend deux parties majeures : la gestion des compétences (cartes IRD, Construction, spécialités) et le suivi des études (diplômes, formations) avec cartographies et graphiques synthétiques.",
    category: 'data-science',
    technologies: ['Power BI', 'Excel', 'Data Cleaning', 'ETL', 'Data Visualization'],
    teamSize: 1,
    duration: '1 mois',
    year: '2025',
    featured: false,
    status: 'completed',
    image: '/projects/rapport-palm.jpg',
    highlights: [
      'Centralisation des compétences collaborateurs',
      'Cartes IRD et Construction interactives',
      'Suivi des parcours professionnels et ancienneté',
      'Cartographie des diplômes et formations',
      'Visualisations synthétiques par département',
      'Système de recherche par spécialité'
    ],
    challenges: [
      'Nettoyage intensif de la base de données Excel',
      'Restructuration complète des données non structurées',
      'Aplatissement et normalisation du fichier source'
    ]
  },
  {
    id: 9,
    title: "Rapport Carte Algo - Cartographie des Interventions",
    description: "Visualisation géographique des zones d'intervention des experts avec analyse comparative.",
    longDescription: "Développement d'un rapport Power BI pour représenter géographiquement les zones d'intervention des experts du groupe et comparer ces zones avec les informations présentes dans leurs chartes. Le projet visait à assurer la cohérence entre les périmètres d'intervention déclarés et réels.",
    category: 'data-science',
    technologies: ['Power BI', 'Cartographie', 'Data Visualization', 'Geospatial Analysis'],
    teamSize: 1,
    duration: '1 mois',
    year: '2025',
    featured: false,
    status: 'in-progress',
    image: '/projects/carte-algo.jpg',
    highlights: [
      'Cartographie interactive des zones d\'intervention',
      'Comparaison automatique avec les chartes experts',
      'Visualisation géographique des données',
      'Interface de navigation intuitive',
      'Analyse de cohérence territoriale'
    ],
    challenges: [
      'Compréhension initiale des objectifs du projet',
      'Clarification des exigences métier',
      'Projet interrompu pour priorités d\'automatisation'
    ]
  },
  {
    id: 10,
    title: "Automatisation Reporting Journalier",
    description: "Automatisation complète du processus de mise à jour des rapports quotidiens via Power Automate.",
    longDescription: "Projet d'automatisation en collaboration avec l'équipe IT pour éliminer les tâches manuelles de mise à jour des rapports journaliers. Exploration de solutions Python et Power Automate, avec implémentation finale via Power Automate pour simuler les actions utilisateur et actualiser automatiquement les dashboards Power BI.",
    category: 'automation',
    technologies: ['Power Automate', 'Python', 'SQL', 'Power BI', 'RPA'],
    teamSize: 2,
    duration: '1 mois',
    year: '2025',
    featured: true,
    status: 'completed',
    image: '/projects/automation-reporting.jpg',
    highlights: [
      'Automatisation complète du workflow journalier',
      'Élimination des tâches manuelles répétitives',
      'Simulation d\'interface via Power Automate',
      'Exploration de solutions Python alternatives',
      'Intégration avec Power BI et SQL',
      'Gain de temps significatif pour l\'équipe'
    ],
    challenges: [
      'Problèmes de format Excel avec scripts Python',
      'Incompatibilité des bibliothèques Python avec Power BI',
      'Bugs résiduels à résoudre pour autonomie 100%'
    ]
  },
  {
    id: 11,
    title: "Automatisation des Chartes - Yousign",
    description: "Système automatisé de génération et signature électronique des chartes experts via Python et Yousign API.",
    longDescription: "Développement complet d'un système d'automatisation des chartes en Python : publipostage automatique depuis template Word, alimentation par données Excel, conversion en PDF, et intégration avec l'API Yousign pour signatures électroniques. Solution complète de bout en bout éliminant toutes les étapes manuelles.",
    category: 'automation',
    technologies: ['Python', 'Yousign API', 'Word Automation', 'PDF Processing', 'Excel Integration'],
    teamSize: 2,
    duration: '1 mois',
    year: '2025',
    featured: true,
    status: 'completed',
    image: '/projects/automation-chartes.jpg',
    highlights: [
      'Publipostage automatique depuis template Word',
      'Liaison dynamique Excel-Word via balises',
      'Conversion automatique en PDF',
      'Intégration API Yousign pour signatures électroniques',
      'Élimination complète du processus manuel',
      'Code Python robuste et maintenable'
    ],
    challenges: [
      'Préservation de la mise en page lors du balisage',
      'Système de balisage automatique Yousign non fonctionnel',
      'Placement manuel des coordonnées de signature',
      'Limitation de l\'automatisation complète'
    ]
  },
  {
    id: 12,
    title: "Automatisation Export Power BI Commercial",
    description: "Automatisation de l'extraction et intégration de tableaux Power BI vers Excel pour le secteur commercial.",
    longDescription: "Projet visant à automatiser l'actualisation hebdomadaire de tableaux spécifiques du rapport commercial. Le processus extrait automatiquement les visualisations depuis Power BI vers Excel et les intègre dans les templates dédiés, éliminant les manipulations manuelles hebdomadaires.",
    category: 'automation',
    technologies: ['Power BI', 'Python', 'Excel', 'Power Automate', 'Data Export'],
    teamSize: 1,
    duration: '1 mois',
    year: '2025',
    featured: false,
    status: 'in-progress',
    image: '/projects/automation-export.jpg',
    highlights: [
      'Extraction automatique de tableaux Power BI',
      'Intégration dans templates Excel prédéfinis',
      'Élimination des copier-coller manuels',
      'Actualisation hebdomadaire automatisée',
      'Gain de temps pour le secteur commercial'
    ],
    challenges: [
      'Format brut complexe lors de l\'exportation Power BI',
      'Automatisation des opérations manuelles',
      'Projet non finalisé avant fin du stage'
    ]
  },
  {
    id: 13,
    title: "Portfolio Personnel Interactif",
    description: "Portfolio en ligne moderne avec interface admin pour gérer dynamiquement projets et expériences.",
    longDescription: "Développement complet d'un portfolio personnel avec Next.js 15, NextAuth pour l'authentification, Prisma comme ORM, et Tailwind CSS 4. Le portfolio comprend une interface publique moderne et un panel d'administration complet permettant de gérer les projets, expériences professionnelles, compétences et contenus de manière dynamique.",
    category: 'web',
    technologies: ['Next.js 15', 'NextAuth', 'Prisma', 'Tailwind CSS 4', 'TypeScript', 'PostgreSQL', 'Shadcn/ui', 'Framer Motion'],
    teamSize: 1,
    duration: '1 mois',
    year: '2025',
    featured: true,
    status: 'in-progress',
    githubUrl: 'https://github.com/youssef-mos/portfolio',
    image: '/projects/portfolio.jpg',
    highlights: [
      'Interface publique moderne et responsive',
      'Panel d\'administration complet et sécurisé',
      'Gestion dynamique des projets et expériences',
      'Authentification sécurisée avec NextAuth',
      'Base de données Prisma avec PostgreSQL',
      'Design épuré avec Tailwind CSS 4',
      'Animations fluides avec Framer Motion',
      'Composants UI modernes avec Shadcn/ui',
      'Architecture Next.js 15 optimisée'
    ],
    challenges: [
      'Mise en place de l\'architecture complète',
      'Intégration de NextAuth avec Prisma',
      'Design responsive et moderne',
      'Gestion des états et performances'
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
  'game': 'Game Development',
  'automation': 'Automation'
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
      if (['React', 'Next.js', 'Next.js 15', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML5 Canvas', 'CSS3', 'Tailwind CSS', 'Tailwind CSS 4', 'Shadcn/ui', 'Framer Motion'].includes(techName)) {
        category = 'Web Development';
      } else if (['Python', 'NumPy', 'Matplotlib', 'Pandas', 'Scikit-learn', 'SQL', 'Excel', 'Data Analysis', 'ETL', 'Data Cleaning', 'Data Visualization', 'Reporting', 'Geospatial Analysis', 'Predictive Analytics'].includes(techName)) {
        category = 'Data Science';
      } else if (['Machine Learning', 'Deep Learning', 'PyTorch', 'Computer Vision', 'NLP'].includes(techName)) {
        category = 'Artificial Intelligence';
      } else if (['Node.js', 'WebSocket', 'PostgreSQL', 'Prisma', 'NextAuth'].includes(techName)) {
        category = 'Backend';
      } else if (['Game Logic'].includes(techName)) {
        category = 'Game Development';
      } else if (['Power BI', 'DAX', 'Cartographie'].includes(techName)) {
        category = 'Business Intelligence';
      } else if (['Power Automate', 'RPA', 'Word Automation', 'PDF Processing', 'Excel Integration', 'Yousign API', 'Data Export'].includes(techName)) {
        category = 'Automation';
      } else if (['UX/UI Design', 'SEO'].includes(techName)) {
        category = 'Design';
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