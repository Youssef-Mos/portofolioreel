// scripts/seed-experiences.ts
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

// Données des expériences professionnelles
const experiencesData = [
  {
    title: "Assistant Ingénieur",
    place: "IXI Groupe",
    kind: "INTERNSHIP" as const,
    description: "Entreprise d'expertise spécialisée dans l'ingénierie et l'analyse de données. Travail sur plusieurs projets d'automatisation et d'analyse prédictive.",
    period: "Avril - Août 2025",
    location: "France",
    durationMonths: 4,
    startDate: new Date(2025, 3, 1), // Avril 2025
    endDate: new Date(2025, 7, 31), // Août 2025
    keyAchievements: [
      "Développement de tableaux de bord Power BI pour l'analyse de données",
      "Automatisation de processus avec Power Automate",
      "Création de modèles prédictifs en Python",
      "Analyse de données complexes avec Excel",
      "Participation à plusieurs projets d'automatisation",
      "Amélioration des workflows de traitement de données"
    ],
    technologies: ["Power BI", "Python", "Excel", "Power Automate", "Data Analysis", "Machine Learning"],
    featured: true
  },
  {
    title: "Stagiaire Développeur Full-Stack",
    place: "Omegup",
    kind: "INTERNSHIP" as const,
    description: "Entreprise internationale spécialisée dans la vente de services informatiques. L'entreprise accompagne ses clients dans la réalisation de projets sur mesure.",
    period: "Mai - Août 2024",
    location: "Tunisie",
    durationMonths: 4,
    startDate: new Date(2024, 4, 1), // Mai 2024
    endDate: new Date(2024, 7, 31), // Août 2024
    keyAchievements: [
      "Refonte complète du site web de l'entreprise avec focus sur l'amélioration du design et des performances",
      "Développement d'une nouvelle fonctionnalité pour une application en cours de création",
      "Respect des besoins clients et des spécifications techniques",
      "Amélioration significative de l'expérience utilisateur",
      "Optimisation des performances (90+ Lighthouse score)",
      "Mise en place d'une architecture scalable"
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "UX/UI Design"],
    featured: true
  },
  {
    title: "Professeur Particulier",
    place: "Les Sherpas",
    kind: "PART_TIME" as const,
    description: "Cours particuliers et soutien scolaire pour élèves de la primaire aux classes préparatoires aux grandes écoles.",
    period: "Septembre 2023 - Présent",
    location: "Paris",
    durationMonths: 12, // Plus de 12 mois en fait
    startDate: new Date(2023, 8, 1), // Septembre 2023
    endDate: null, // Toujours en cours
    keyAchievements: [
      "Accompagnement de plus de 20 élèves du collège aux classes préparatoires",
      "Développement de compétences en pédagogie individualisée",
      "Gestion efficace de travaux de groupe",
      "Amélioration significative de la réussite académique et de l'autonomie des élèves",
      "Création de supports pédagogiques personnalisés",
      "Suivi régulier et adaptation des méthodes d'enseignement"
    ],
    technologies: ["Pédagogie", "Communication", "Management", "Mathématiques"],
    featured: false
  }
];

// Données des engagements associatifs
const engagementsData = [
  {
    title: "Responsable Communication",
    place: "Weski - Comité Ski",
    kind: "VOLUNTEER" as const,
    description: "Comité d'organisation de la sortie ski annuelle pour l'année 2024-2025. Gestion complète de la stratégie de communication et création de contenu multimédia.",
    period: "Septembre 2024 - Mars 2025",
    location: "Douai",
    durationMonths: 7,
    startDate: new Date(2024, 8, 1), // Septembre 2024
    endDate: new Date(2025, 2, 31), // Mars 2025
    keyAchievements: [
      "Réalisation du film de révélation de la destination ski",
      "Gestion complète de la communication sur les réseaux sociaux",
      "Création de contenus visuels et vidéos promotionnelles",
      "Développement de supports digitaux pour l'événement",
      "Coordination avec l'équipe d'organisation",
      "Animation de la communauté et engagement des participants"
    ],
    skills: ["Communication", "Vidéo", "Réseaux sociaux", "Marketing", "Création de contenu", "Web Development"],
    featured: true
  },
  {
    title: "Membre Pôle Animation",
    place: "BDE IMT Nord Europe",
    kind: "VOLUNTEER" as const,
    description: "Bureau Des Étudiants - Pôle Animation. Rejoins en cours d'année pour participer à l'organisation d'activités et de sorties pour les étudiants de l'école.",
    period: "Janvier 2024 - Juin 2024",
    location: "Douai",
    durationMonths: 6,
    startDate: new Date(2024, 0, 1), // Janvier 2024
    endDate: new Date(2024, 5, 30), // Juin 2024
    keyAchievements: [
      "Organisation d'activités et événements étudiants",
      "Planification et coordination de sorties collectives",
      "Développement de solutions digitales pour la gestion des événements",
      "Animation de la vie étudiante",
      "Gestion logistique des activités",
      "Contribution au développement d'outils numériques pour le BDE"
    ],
    skills: ["Organisation", "Événementiel", "Animation", "Logistique", "Web Development", "Travail d'équipe"],
    featured: true
  },
  {
    title: "Responsable Communication",
    place: "Sport Pour Tous (SPT)",
    kind: "VOLUNTEER" as const,
    description: "Projet multifacette comprenant la conception d'un objet pour le basket fauteuil, une journée événementielle et une partie pédagogique - Projet Ouvert Basket Fauteuil.",
    period: "Octobre 2023 - Avril 2024",
    location: "Douai",
    durationMonths: 7,
    startDate: new Date(2023, 9, 1), // Octobre 2023
    endDate: new Date(2024, 3, 30), // Avril 2024
    keyAchievements: [
      "Création et réalisation de supports de communication (banderoles, prospectus)",
      "Gestion des réseaux sociaux du projet",
      "Coordination avec les équipes de conception et d'événementiel",
      "Sensibilisation du public au sport adapté",
      "Organisation d'événements de sensibilisation",
      "Développement de la stratégie de communication digitale"
    ],
    skills: ["Communication", "Design graphique", "Réseaux sociaux", "Événementiel"],
    featured: false
  },
  {
    title: "Bénévole - Aide alimentaire",
    place: "Univers Culture et Sport (UCS)",
    kind: "VOLUNTEER" as const,
    description: "Association d'aide aux personnes démunies et d'accompagnement des enfants dans le besoin. Participation active aux actions d'aide alimentaire.",
    period: "Septembre - Octobre 2022",
    location: "Colmar",
    durationMonths: 2,
    startDate: new Date(2022, 8, 1), // Septembre 2022
    endDate: new Date(2022, 9, 31), // Octobre 2022
    keyAchievements: [
      "Préparation et distribution de colis alimentaires",
      "Organisation de collectes alimentaires dans les supermarchés",
      "Accompagnement des familles en difficulté",
      "Sensibilisation communautaire aux enjeux sociaux",
      "Coordination des équipes de bénévoles",
      "Gestion logistique des distributions"
    ],
    skills: ["Solidarité", "Organisation", "Contact humain", "Logistique"],
    featured: false
  },
  {
    title: "Bénévole - Campagne de vaccination COVID-19",
    place: "Le Croissant Rouge",
    kind: "VOLUNTEER" as const,
    description: "Association généraliste d'aide aux plus démunis avec intervention spéciale pendant la pandémie. Assistance lors de la campagne nationale de vaccination.",
    period: "Juin - Juillet 2021",
    location: "Tunisie",
    durationMonths: 2,
    startDate: new Date(2021, 5, 1), // Juin 2021
    endDate: new Date(2021, 6, 31), // Juillet 2021
    keyAchievements: [
      "Assistance aux équipes médicales pour la vaccination",
      "Organisation des files d'attente et gestion des flux",
      "Information et rassurance des patients",
      "Contribution à l'effort national de santé publique",
      "Gestion de l'accueil et de l'orientation du public",
      "Support logistique aux équipes soignantes"
    ],
    skills: ["Santé publique", "Organisation", "Communication", "Empathie"],
    featured: false
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

// Mapping des technologies/compétences vers les catégories
const technologyMapping: Record<string, string> = {
  // Data & Analytics
  'Power BI': 'Data Analysis',
  'Python': 'Programming',
  'Excel': 'Data Analysis',
  'Power Automate': 'Automation',
  'Data Analysis': 'Data Science',
  'Machine Learning': 'Artificial Intelligence',
  
  // Web Development
  'Next.js': 'Web Development',
  'React': 'Web Development',
  'TypeScript': 'Programming',
  'Tailwind CSS': 'Web Development',
  'UX/UI Design': 'Design',
  'Web Development': 'Web Development',
  
  // Soft Skills & Communication
  'Pédagogie': 'Education',
  'Communication': 'Soft Skills',
  'Management': 'Leadership',
  'Mathématiques': 'Education',
  'Design graphique': 'Design',
  'Réseaux sociaux': 'Marketing',
  'Événementiel': 'Event Management',
  'Solidarité': 'Social Impact',
  'Organisation': 'Project Management',
  'Contact humain': 'Soft Skills',
  'Logistique': 'Operations',
  'Santé publique': 'Healthcare',
  'Empathie': 'Soft Skills',
  
  // Nouvelles compétences
  'Vidéo': 'Media Production',
  'Marketing': 'Marketing',
  'Création de contenu': 'Content Creation',
  'Animation': 'Event Management',
  'Travail d\'équipe': 'Soft Skills'
};

async function seedExperiencesAndEngagements() {
  try {
    console.log('🌱 Début du seed des expériences et engagements...');

    // 1. Collecter toutes les technologies/compétences uniques
    const allTechnologies = new Set<string>();
    
    experiencesData.forEach(exp => {
      exp.technologies.forEach(tech => allTechnologies.add(tech));
    });
    
    engagementsData.forEach(eng => {
      eng.skills.forEach(skill => allTechnologies.add(skill));
    });

    console.log(`📦 Création de ${allTechnologies.size} technologies/compétences...`);

    // 2. Créer ou récupérer toutes les technologies
    const techMap = new Map<string, { id: string; name: string; slug: string; category: string | null }>();
    
    for (const techName of allTechnologies) {
      const category = technologyMapping[techName] || 'Other';

      const technology = await prisma.technology.upsert({
        where: { slug: createSlug(techName) },
        update: {},
        create: {
          name: techName,
          slug: createSlug(techName),
          category: category,
          iconUrl: null
        }
      });
      
      techMap.set(techName, technology);
      console.log(`✅ Technologie créée/trouvée: ${techName} (${category})`);
    }

    console.log('🚀 Création des expériences professionnelles...');

    // 3. Créer les expériences professionnelles
    for (const expData of experiencesData) {
      // Préparer les technologies pour la relation
      const expTechnologies = expData.technologies.map(techName => ({
        id: techMap.get(techName)!.id
      }));

      // Chercher si l'expérience existe déjà
      const existingExp = await prisma.experience.findFirst({
        where: {
          title: expData.title,
          place: expData.place
        },
        include: { technologies: true }
      });

      let experience;
      if (existingExp) {
        // Mettre à jour l'expérience existante
        experience = await prisma.experience.update({
          where: { id: existingExp.id },
          data: {
            kind: expData.kind,
            description: expData.description,
            durationMonths: expData.durationMonths,
            startDate: expData.startDate,
            endDate: expData.endDate,
            keyAchievements: expData.keyAchievements,
            technologies: {
              set: expTechnologies
            }
          },
          include: { technologies: true }
        });
      } else {
        // Créer une nouvelle expérience
        experience = await prisma.experience.create({
          data: {
            title: expData.title,
            place: expData.place,
            kind: expData.kind,
            description: expData.description,
            durationMonths: expData.durationMonths,
            startDate: expData.startDate,
            endDate: expData.endDate,
            keyAchievements: expData.keyAchievements,
            technologies: {
              connect: expTechnologies
            }
          },
          include: { technologies: true }
        });
      }

      console.log(`✅ Expérience créée/mise à jour: ${experience.title} chez ${experience.place}`);
      console.log(`   - Type: ${experience.kind}`);
      console.log(`   - Durée: ${experience.durationMonths} mois`);
      console.log(`   - Technologies: ${experience.technologies.map(t => t.name).join(', ')}`);
      console.log(`   - Réalisations: ${experience.keyAchievements.length} points clés`);
      console.log('');
    }

    console.log('🎯 Création des engagements associatifs...');

    // 4. Créer les engagements associatifs
    for (const engData of engagementsData) {
      // Préparer les compétences pour la relation
      const engSkills = engData.skills.map(skillName => ({
        id: techMap.get(skillName)!.id
      }));

      // Chercher si l'engagement existe déjà
      const existingEng = await prisma.engagement.findFirst({
        where: {
          title: engData.title,
          place: engData.place
        },
        include: { technologies: true }
      });

      let engagement;
      if (existingEng) {
        // Mettre à jour l'engagement existant
        engagement = await prisma.engagement.update({
          where: { id: existingEng.id },
          data: {
            kind: engData.kind,
            description: engData.description,
            durationMonths: engData.durationMonths,
            startDate: engData.startDate,
            endDate: engData.endDate,
            keyAchievements: engData.keyAchievements,
            technologies: {
              set: engSkills
            }
          },
          include: { technologies: true }
        });
      } else {
        // Créer un nouvel engagement
        engagement = await prisma.engagement.create({
          data: {
            title: engData.title,
            place: engData.place,
            kind: engData.kind,
            description: engData.description,
            durationMonths: engData.durationMonths,
            startDate: engData.startDate,
            endDate: engData.endDate,
            keyAchievements: engData.keyAchievements,
            technologies: {
              connect: engSkills
            }
          },
          include: { technologies: true }
        });
      }

      console.log(`✅ Engagement créé/mis à jour: ${engagement.title} chez ${engagement.place}`);
      console.log(`   - Type: ${engagement.kind}`);
      console.log(`   - Durée: ${engagement.durationMonths} mois`);
      console.log(`   - Compétences: ${engagement.technologies.map(t => t.name).join(', ')}`);
      console.log(`   - Réalisations: ${engagement.keyAchievements.length} points clés`);
      console.log('');
    }

    console.log('🎉 Seed des expériences et engagements terminé avec succès !');
    
    // Afficher un résumé
    const totalExperiences = await prisma.experience.count();
    const totalEngagements = await prisma.engagement.count();
    const totalTechnologies = await prisma.technology.count();
    
    console.log('\n📊 Résumé:');
    console.log(`   - Expériences professionnelles: ${totalExperiences}`);
    console.log(`   - Engagements associatifs: ${totalEngagements}`);
    console.log(`   - Technologies/Compétences total: ${totalTechnologies}`);

    // Afficher les statistiques par type
    const internshipCount = await prisma.experience.count({ where: { kind: 'INTERNSHIP' } });
    const partTimeCount = await prisma.experience.count({ where: { kind: 'PART_TIME' } });
    const volunteerCount = await prisma.engagement.count({ where: { kind: 'VOLUNTEER' } });
    
    console.log('\n📈 Détail par type:');
    console.log(`   - Stages: ${internshipCount}`);
    console.log(`   - Temps partiel: ${partTimeCount}`);
    console.log(`   - Bénévolat: ${volunteerCount}`);

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
if (require.main === module) {
  seedExperiencesAndEngagements()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedExperiencesAndEngagements;