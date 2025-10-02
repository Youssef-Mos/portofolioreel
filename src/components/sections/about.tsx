// components/sections/About.tsx
"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { useStats, useTechnologies } from '@/hooks/useApi';
import { 
  GraduationCap, 
  Code, 
  Languages, 
  Award,
  Users,
  Briefcase,
  Heart,
  Target,
  Brain,
  MessageCircle,
  Lightbulb,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  MapPin,
  Book,
  Cpu,
  Database,
  BarChart3,
  Globe,
  Gamepad2,
  Dumbbell,
  Car,
  Medal,
  TrendingUp
} from 'lucide-react';
import { AboutSkeleton } from '../skeletons/AboutSkeleton';

interface SoftSkill {
  name: string;
  category: string;
  level: number;
  description: string;
  icon: React.ReactNode;
}

type ModalType = 'formation' | 'development' | 'languages' | 'other' | null;

export const About: React.FC = () => {
  const [activeSkillTab, setActiveSkillTab] = useState<'hard' | 'soft'>('hard');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const SKILLS_PER_PAGE = 4;
  
  // Hooks pour récupérer les données
  const { data: stats, loading: loadingStats } = useStats();
  const { data: technologies, loading: loadingTech } = useTechnologies();

  // Données des modals
  const modalData = {
    formation: {
      title: "Parcours de Formation",
      icon: <GraduationCap className="w-6 h-6" />,
      timeline: [
        {
          period: "2019 - 2021",
          title: "Baccalauréat Général",
          institution: "Lycée",
          specialties: ["Mathématiques", "Physique-Chimie"],
          description: "Mention Bien - Spécialités scientifiques",
          color: "bg-green-100 text-green-700"
        },
        {
          period: "2021 - 2023", 
          title: "Classe Préparatoire MP",
          institution: "Lycée Kléber",
          specialties: ["Mathématiques", "Physique", "Sciences de l'Ingénieur"],
          description: "Filière Mathématiques-Physique",
          color: "bg-blue-100 text-blue-700"
        },
        {
          period: "2023 - 2026",
          title: "Cycle Ingénieur",
          institution: "IMT Nord Europe",
          specialties: [
            "TSIO (Technologie des Sciences et Interface Ouvertes)",
            "ODATA (Outil pour la Data)",
            "SDATA (Science pour la Data)",
            "IMF (Ingénieur des Marchés Financiers) - En cours"
          ],
          description: "Formation d'ingénieur généraliste avec spécialisation Data Science",
          color: "bg-purple-100 text-purple-700"
        },
        {
          period: "Août 2025 - Janvier 2026",
          title: "Semestre d'Échange",
          institution: "PUC Rio (Brésil)",
          specialties: ["International Business", "Data Analytics", "Portuguese"],
          description: "Semestre international d'ouverture culturelle et académique",
          color: "bg-orange-100 text-orange-700"
        }
      ]
    },
    development: {
      title: "Compétences en Développement",
      icon: <Code className="w-6 h-6" />,
      categories: [
        {
          name: "Full-Stack Development",
          icon: <Globe className="w-5 h-5" />,
          skills: [
            { name: "React / Next.js", level: 90, experience: "2+ ans" },
            { name: "Node.js / Express", level: 85, experience: "1.5+ ans" },
            { name: "TypeScript", level: 88, experience: "1+ an" },
            { name: "Tailwind CSS", level: 92, experience: "2+ ans" }
          ]
        },
        {
          name: "Data Science & Analytics",
          icon: <BarChart3 className="w-5 h-5" />,
          skills: [
            { name: "Python", level: 92, experience: "3+ ans" },
            { name: "Pandas / NumPy", level: 88, experience: "2+ ans" },
            { name: "Scikit-learn", level: 85, experience: "1.5+ ans" },
            { name: "TensorFlow", level: 75, experience: "1+ an" }
          ]
        },
        {
          name: "Base de Données",
          icon: <Database className="w-5 h-5" />,
          skills: [
            { name: "PostgreSQL", level: 80, experience: "1+ an" },
            { name: "MongoDB", level: 75, experience: "1+ an" },
            { name: "Prisma ORM", level: 85, experience: "1+ an" },
            { name: "Redis", level: 70, experience: "6+ mois" }
          ]
        }
      ]
    },
    languages: {
      title: "Compétences Linguistiques",
      icon: <Languages className="w-6 h-6" />,
      languages: [
        { name: "Français", level: 100, status: "Natif", flag: "🇫🇷" },
        { name: "Arabe", level: 100, status: "Natif", flag: "🇹🇳" },
        { name: "Anglais", level: 85, status: "B2-C1 • TOEIC 850", flag: "🇬🇧" },
        { name: "Italien", level: 65, status: "B1 • Conversationnel", flag: "🇮🇹" },
        { name: "Allemand", level: 45, status: "A2 • Bases solides", flag: "🇩🇪" },
        { name: "Portugais", level: 35, status: "A1-A2 • En apprentissage", flag: "🇧🇷" }
      ],
      certifications: [
        { name: "TOEIC", score: 850, date: "2024", description: "Anglais professionnel" },
        { name: "Voltaire", score: 85, date: "2023", description: "Orthographe française" }
      ]
    },
    other: {
      title: "Centres d'Intérêt & Divers",
      icon: <Award className="w-6 h-6" />,
      sections: [
        {
          title: "Sport & Bien-être",
          icon: <Dumbbell className="w-5 h-5" />,
          items: [
            { name: "Football", description: "15 ans de pratique • Esprit d'équipe" },
            { name: "Fitness", description: "Discipline personnelle • Régularité" },
            { name: "Running", description: "Semi-marathons • Endurance" }
          ]
        },
        {
          title: "Technologie & Innovation",
          icon: <Cpu className="w-5 h-5" />,
          items: [
            { name: "Veille technologique", description: "IA, Web3, Fintech" },
            { name: "Open Source", description: "Contributions GitHub" },
            { name: "Hackathons", description: "Participations régulières" }
          ]
        },
        {
          title: "Mobilité & Permis",
          icon: <Car className="w-5 h-5" />,
          items: [
            { name: "Permis B", description: "Véhicule personnel • Mobile" },
            { name: "International", description: "Prêt pour missions à l'étranger" }
          ]
        },
        {
          title: "Certifications",
          icon: <Medal className="w-5 h-5" />,
          items: [
            { name: "PIX", description: "Compétences numériques certifiées" },
            { name: "GitHub", description: "Portfolio actif depuis 3 ans" },
            { name: "LinkedIn Learning", description: "Formations continues" }
          ]
        }
      ]
    }
  };

  // Soft skills
  const softSkills: SoftSkill[] = [
    { 
      name: 'Communication', 
      category: 'Relationnel',
      level: 90, 
      description: 'Pédagogie, vulgarisation technique',
      icon: <MessageCircle className="w-5 h-5" />
    },
    { 
      name: 'Travail en équipe', 
      category: 'Collaboration',
      level: 85, 
      description: 'Projets collaboratifs, leadership',
      icon: <Users className="w-5 h-5" />
    },
    { 
      name: 'Résolution de problèmes', 
      category: 'Analyse',
      level: 88, 
      description: 'Approche méthodique, créativité',
      icon: <Lightbulb className="w-5 h-5" />
    },
    { 
      name: 'Adaptabilité', 
      category: 'Flexibilité',
      level: 82, 
      description: 'Apprentissage rapide, polyvalence',
      icon: <Target className="w-5 h-5" />
    },
    { 
      name: 'Autonomie', 
      category: 'Organisation',
      level: 87, 
      description: 'Gestion de projet, initiative',
      icon: <Clock className="w-5 h-5" />
    },
    { 
      name: 'Esprit critique', 
      category: 'Analyse',
      level: 85, 
      description: 'Analyse de données, debugging',
      icon: <Brain className="w-5 h-5" />
    }
  ];

  // Hard skills depuis la BDD
  const hardSkills = technologies ? 
    Object.values(technologies).flat().slice(0, 20).map((tech: any) => ({
      name: tech.name,
      level: Math.min(95, 60 + (tech.usage?.total || 0) * 8),
      category: tech.category || 'Autres',
      usage: tech.usage?.total || 0
    })) : [];

  // Logique de pagination
  const currentSkills = activeSkillTab === 'hard' ? hardSkills : softSkills;
  const totalPages = Math.ceil(currentSkills.length / SKILLS_PER_PAGE);
  const startIndex = (currentPage - 1) * SKILLS_PER_PAGE;
  const displayedSkills = currentSkills.slice(startIndex, startIndex + SKILLS_PER_PAGE);

  // Reset page when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeSkillTab]);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Web': 'text-blue-600',
      'Data Science': 'text-purple-600',
      'Backend': 'text-green-600',
      'Database': 'text-orange-600',
      'Relationnel': 'text-blue-600',
      'Collaboration': 'text-green-600',
      'Analyse': 'text-purple-600',
      'Flexibilité': 'text-orange-600',
      'Organisation': 'text-indigo-600'
    };
    return colors[category as keyof typeof colors] || 'text-gray-600';
  };

  const renderModal = () => {
    if (!activeModal) return null;
    
    const data = modalData[activeModal];
    
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {data.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{data.title}</h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeModal === 'formation' && (
                <div className="space-y-6">
                  {modalData.formation.timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-8 border-l-2 border-blue-200 last:border-l-0"
                    >
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.color}`}>
                            {item.period}
                          </span>
                          <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600 mb-3 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {item.institution}
                        </p>
                        <p className="text-gray-700 mb-4">{item.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.specialties.map((specialty, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeModal === 'development' && (
                <div className="space-y-8">
                  {modalData.development.categories.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl p-6"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          {category.icon}
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900">{category.name}</h4>
                      </div>
                      <div className="grid gap-4">
                        {category.skills.map((skill, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium text-gray-700">{skill.name}</span>
                                <span className="text-sm text-gray-500">{skill.experience}</span>
                              </div>
                              <span className="text-sm text-gray-600">{skill.level}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                                className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeModal === 'languages' && (
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Langues parlées</h4>
                    <div className="grid gap-4">
                      {modalData.languages.languages.map((lang, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{lang.flag}</span>
                              <div>
                                <span className="font-medium text-gray-900">{lang.name}</span>
                                <p className="text-sm text-gray-600">{lang.status}</p>
                              </div>
                            </div>
                            <span className="text-sm text-gray-600">{lang.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${lang.level}%` }}
                              transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                              className={`h-3 rounded-full ${
                                lang.level === 100 ? 'bg-green-500' :
                                lang.level >= 80 ? 'bg-blue-500' :
                                lang.level >= 60 ? 'bg-yellow-500' :
                                'bg-orange-500'
                              }`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Certifications</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {modalData.languages.certifications.map((cert, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <Medal className="w-6 h-6 text-blue-600" />
                            <h5 className="font-semibold text-gray-900">{cert.name}</h5>
                          </div>
                          <div className="text-2xl font-bold text-blue-600 mb-1">{cert.score}</div>
                          <p className="text-sm text-gray-600">{cert.description}</p>
                          <p className="text-xs text-gray-500 mt-2">Obtenu en {cert.date}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'other' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {modalData.other.sections.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl p-6"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          {section.icon}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">{section.title}</h4>
                      </div>
                      <div className="space-y-3">
                        {section.items.map((item, i) => (
                          <div key={i} className="bg-white rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-1">{item.name}</h5>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  if (loadingStats || loadingTech) {
    return (
       <SectionWrapper id="about" className="bg-gradient-to-br from-blue-50/50 via-white/80 to-purple-50/50">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">À propos de moi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Passionné par la technologie et l'innovation
          </p>
        </div>

        {/* Skeleton Loading */}
        <AboutSkeleton />
      </div>
    </SectionWrapper>
  );
  }

  return (
    <SectionWrapper id="about" className="bg-gradient-to-br from-blue-50/50 via-white/80 to-purple-50/50">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">À propos de moi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Passionné par la technologie et l'innovation, je combine compétences techniques 
            et vision stratégique pour créer des solutions impactantes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Section gauche - Informations statiques */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div 
              className="flex items-start space-x-4 p-6 bg-blue-50 rounded-2xl cursor-pointer group hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveModal('formation')}
            >
              <GraduationCap className="w-8 h-8 text-blue-600 mt-1 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Formation</h3>
                <p className="text-gray-600">IMT Nord Europe - Ingénieur généraliste</p>
                <p className="text-sm text-gray-500">Spécialisation Data Science & Marchés Financiers</p>
                <p className="text-xs text-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Cliquez pour voir le détail →</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-start space-x-4 p-6 bg-purple-50 rounded-2xl cursor-pointer group hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveModal('development')}
            >
              <Code className="w-8 h-8 text-purple-600 mt-1 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Développement</h3>
                <p className="text-gray-600">Full-Stack & Data Science</p>
                <p className="text-sm text-gray-500">React, Python, Machine Learning</p>
                <p className="text-xs text-purple-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Cliquez pour voir le détail →</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-start space-x-4 p-6 bg-green-50 rounded-2xl cursor-pointer group hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveModal('languages')}
            >
              <Languages className="w-8 h-8 text-green-600 mt-1 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Langues</h3>
                <p className="text-gray-600">Français, Arabe (Natif)</p>
                <p className="text-sm text-gray-500">Anglais (B2-C1), Italien (B1), Allemand (A2)</p>
                <p className="text-xs text-green-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Cliquez pour voir le détail →</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-start space-x-4 p-6 bg-orange-50 rounded-2xl cursor-pointer group hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveModal('other')}
            >
              <Award className="w-8 h-8 text-orange-600 mt-1 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">Divers</h3>
                <p className="text-gray-600">Permis B, Football, PIX</p>
                <p className="text-sm text-gray-500">Mobilité, sport en équipe, compétences numériques</p>
                <p className="text-xs text-orange-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Cliquez pour voir le détail →</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Section droite - Compétences et Statistiques */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Statistiques dynamiques */}
            {stats && (
              <div className="grid grid-cols-3 gap-4 text-center mb-8">
                <motion.div 
                  className="p-4 bg-gray-50 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.general?.totalProjects || 0}
                  </div>
                  <div className="text-sm text-gray-600">Projets</div>
                </motion.div>
                <motion.div 
                  className="p-4 bg-gray-50 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.general?.totalExperiences || 0}
                  </div>
                  <div className="text-sm text-gray-600">Expériences</div>
                </motion.div>
                <motion.div 
                  className="p-4 bg-gray-50 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-2xl font-bold text-green-600">
                    {stats.general?.totalEngagements || 0}
                  </div>
                  <div className="text-sm text-gray-600">Engagements</div>
                </motion.div>
              </div>
            )}

            {/* Onglets Compétences */}
            <div>
              {/* Tabs */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setActiveSkillTab('hard')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeSkillTab === 'hard'
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Hard Skills
                  </button>
                  <button
                    onClick={() => setActiveSkillTab('soft')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeSkillTab === 'soft'
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Soft Skills
                  </button>
                </div>
              </div>

              {/* Skills avec pagination */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {activeSkillTab === 'hard' ? 'Compétences techniques' : 'Compétences transversales'}
                </h3>
                
                <div className="space-y-4">
                  {displayedSkills.map((skill: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          {activeSkillTab === 'soft' && (
                            <div className={getCategoryColor(skill.category)}>
                              {skill.icon}
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700">{skill.name}</span>
                            {skill.category && (
                              <span className={`ml-2 text-sm font-medium ${getCategoryColor(skill.category)}`}>
                                {skill.category}
                              </span>
                            )}
                            {activeSkillTab === 'soft' && skill.description && (
                              <p className="text-xs text-gray-500">{skill.description}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-500 text-sm">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className={`h-3 rounded-full ${
                            activeSkillTab === 'hard' 
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                              : skill.category === 'Relationnel' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                skill.category === 'Collaboration' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                skill.category === 'Analyse' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                                skill.category === 'Flexibilité' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                skill.category === 'Organisation' ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' :
                                'bg-gradient-to-r from-gray-500 to-gray-600'
                          }`}
                        />
                      </div>
                      {activeSkillTab === 'hard' && skill.usage && (
                        <p className="text-xs text-gray-500">
                          Utilisé dans {skill.usage} projet{skill.usage > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination simple */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-4 mt-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg ${
                        currentPage === 1 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className="text-sm text-gray-600">
                      Page {currentPage} sur {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg ${
                        currentPage === totalPages 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section footer avec statistiques supplémentaires */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl"
          >
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {stats.general?.totalTechnologies || 0}
                </div>
                <div className="text-sm text-gray-600">Technologies maîtrisées</div>
              </div>
              <div>
                <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round((stats.duration?.totalExperienceMonths || 0) / 12 * 10) / 10}
                </div>
                <div className="text-sm text-gray-600">Années d'expérience</div>
              </div>
              <div>
                <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {stats.general?.favoriteProjects || 0}
                </div>
                <div className="text-sm text-gray-600">Projets phares</div>
              </div>
              <div>
                <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">850</div>
                <div className="text-sm text-gray-600">Score TOEIC</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {renderModal()}
    </SectionWrapper>
  );
};