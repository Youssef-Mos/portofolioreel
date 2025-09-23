"use client";
import React, { useState, useMemo } from 'react';
import { easeOut, motion } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { useExperiences, useEngagements } from '@/hooks/useApi';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  MapPin, 
  ExternalLink,
  Code,
  Globe,
  GraduationCap,
  Heart,
  ChevronRight,
  Building2,
  UserCheck,
  Megaphone,
  PackageCheck,
  Stethoscope,
  Loader2
} from 'lucide-react';

// Types basés sur votre schéma Prisma
interface ExperienceFromApi {
  id: string;
  title: string;
  place: string | null;
  kind: string;
  description: string | null;
  durationMonths: number | null;
  startDate: string | null;
  endDate: string | null;
  keyAchievements: string[];
  technologies: {
    id: string;
    name: string;
    slug: string;
    category: string | null;
    iconUrl: string | null;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface EngagementFromApi {
  id: string;
  title: string;
  place: string | null;
  kind: string;
  description: string | null;
  durationMonths: number | null;
  startDate: string | null;
  endDate: string | null;
  keyAchievements: string[];
  technologies: {
    id: string;
    name: string;
    slug: string;
    category: string | null;
    iconUrl: string | null;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Fonctions de mapping pour les expériences professionnelles
// Correction pour la fonction mapExperienceApiData
function mapExperienceApiData(apiExp: ExperienceFromApi) {
  const formatPeriod = (startDate: string | null, endDate: string | null) => {
    if (!startDate) return 'Période non spécifiée';
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const formatMonth = (date: Date) => 
      date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    
    if (end) {
      return `${formatMonth(start)} - ${formatMonth(end)}`;
    } else {
      return `${formatMonth(start)} - Présent`;
    }
  };

  const getDurationText = (months: number | null) => {
    if (!months) return 'Variable';
    if (months === 1) return '1 mois';
    if (months < 12) return `${months} mois`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} an${years > 1 ? 's' : ''}`;
    return `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois`;
  };

  const getIcon = (kind: string) => {
    switch (kind) {
      case 'FULL_TIME':
      case 'PART_TIME':
        return <Briefcase className="w-6 h-6" />;
      case 'INTERNSHIP':
        return <GraduationCap className="w-6 h-6" />;
      case 'FREELANCE':
        return <Code className="w-6 h-6" />;
      default:
        return <Briefcase className="w-6 h-6" />;
    }
  };

  const getTypeLabel = (kind: string) => {
    const labels = {
      'FULL_TIME': 'Temps plein',
      'PART_TIME': 'Temps partiel',
      'INTERNSHIP': 'Stage',
      'APPRENTICESHIP': 'Apprentissage',
      'FREELANCE': 'Freelance',
      'VOLUNTEER': 'Bénévolat',
      'OTHER': 'Autre'
    };
    return labels[kind as keyof typeof labels] || 'Autre';
  };

  const getColor = (kind: string) => {
    const colors = {
      'FULL_TIME': 'blue',
      'PART_TIME': 'purple',
      'INTERNSHIP': 'green',
      'APPRENTICESHIP': 'orange',
      'FREELANCE': 'indigo',
      'VOLUNTEER': 'pink',
      'OTHER': 'gray'
    };
    return colors[kind as keyof typeof colors] || 'blue';
  };

  return {
    id: apiExp.id, // ✅ Gardez l'ID original (string cuid)
    company: apiExp.place || 'Non spécifié',
    role: apiExp.title,
    period: formatPeriod(apiExp.startDate, apiExp.endDate),
    duration: getDurationText(apiExp.durationMonths),
    location: apiExp.place || 'Non spécifié',
    type: getTypeLabel(apiExp.kind),
    description: apiExp.description || '',
    achievements: apiExp.keyAchievements || [],
    technologies: apiExp.technologies.map(t => t.name),
    website: null,
    icon: getIcon(apiExp.kind),
    color: getColor(apiExp.kind)
  };
}

// Fonctions de mapping pour les engagements associatifs
function mapEngagementApiData(apiEng: EngagementFromApi) {
  const formatPeriod = (startDate: string | null, endDate: string | null) => {
    if (!startDate) return 'Période non spécifiée';
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const formatMonth = (date: Date) => 
      date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    
    if (end) {
      return `${formatMonth(start)} - ${formatMonth(end)}`;
    } else {
      return `${formatMonth(start)} - Présent`;
    }
  };

  const getDurationText = (months: number | null) => {
    if (!months) return 'Variable';
    if (months === 1) return '1 mois';
    if (months < 12) return `${months} mois`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} an${years > 1 ? 's' : ''}`;
    return `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois`;
  };

  const getIcon = (kind: string) => {
    switch (kind) {
      case 'ASSOCIATION':
        return <Users className="w-6 h-6" />;
      case 'VOLUNTEER':
        return <PackageCheck className="w-6 h-6" />;
      case 'LEADERSHIP':
        return <Megaphone className="w-6 h-6" />;
      case 'EVENT':
        return <Calendar className="w-6 h-6" />;
      case 'COMMUNITY':
        return <Stethoscope className="w-6 h-6" />;
      default:
        return <Heart className="w-6 h-6" />;
    }
  };

  const getColor = (kind: string) => {
    const colors = {
      'ASSOCIATION': 'green',
      'VOLUNTEER': 'orange',
      'LEADERSHIP': 'purple',
      'EVENT': 'blue',
      'COMMUNITY': 'red',
      'OTHER': 'gray'
    };
    return colors[kind as keyof typeof colors] || 'green';
  };

  // Créer un projet pour les engagements (adapté au format existant)
  const project = apiEng.title.includes('Basket') ? 'Projet Ouvert - Basket Fauteuil' : 
                 apiEng.title.includes('COVID') ? 'Campagne de vaccination COVID-19' :
                 apiEng.title.includes('alimentaire') ? 'Aide alimentaire' : '';

  return {
    id: apiEng.id, // Garder comme string (cuid)
    organization: apiEng.place || 'Non spécifié',
    role: apiEng.title,
    period: formatPeriod(apiEng.startDate, apiEng.endDate),
    duration: getDurationText(apiEng.durationMonths),
    location: apiEng.place || 'Non spécifié',
    project,
    description: apiEng.description || '',
    achievements: apiEng.keyAchievements || [],
    skills: apiEng.technologies.map(t => t.name),
    icon: getIcon(apiEng.kind),
    color: getColor(apiEng.kind)
  };
}

export const Experience: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'professional' | 'associative'>('professional');

  // Utiliser les hooks pour récupérer les données
  const { data: apiExperiences, loading: loadingExp, error: errorExp } = useExperiences();
  const { data: apiEngagements, loading: loadingEng, error: errorEng } = useEngagements();

  // Mapper les données API vers le format attendu
  const professionalExperiences = useMemo(() => {
    if (!apiExperiences) return [];
    return apiExperiences.map(mapExperienceApiData);
  }, [apiExperiences]);

  const associativeExperiences = useMemo(() => {
    if (!apiEngagements) return [];
    return apiEngagements.map(mapEngagementApiData);
  }, [apiEngagements]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut
      }
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200', 
        icon: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-800'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600', 
        badge: 'bg-green-100 text-green-800'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-800'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-800'
      },
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        icon: 'text-indigo-600',
        badge: 'bg-indigo-100 text-indigo-800'
      },
      pink: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        icon: 'text-pink-600',
        badge: 'bg-pink-100 text-pink-800'
      },
      gray: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: 'text-gray-600',
        badge: 'bg-gray-100 text-gray-800'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  // Gestion des états de chargement et d'erreur
  const isLoading = loadingExp || loadingEng;
  const hasError = errorExp || errorEng;

  if (isLoading) {
    return (
      <SectionWrapper id="experience" className="bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Chargement des expériences...</p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  if (hasError) {
    return (
      <SectionWrapper id="experience" className="bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erreur lors du chargement des expériences</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="experience" className="bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mon Expérience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un parcours riche entre développement technique, pédagogie et engagement associatif, 
            forgé par la passion d'apprendre et de contribuer.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
            <button
              onClick={() => setActiveTab('professional')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'professional'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Expérience Professionnelle</span>
            </button>
            <button
              onClick={() => setActiveTab('associative')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'associative'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Engagement Associatif</span>
            </button>
          </div>
        </motion.div>

        {/* Professional Experience */}
        {activeTab === 'professional' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {professionalExperiences.map((exp, index) => {
              const colors = getColorClasses(exp.color);
              return (
                <motion.div
                  key={exp.id}
                  variants={itemVariants}
                  transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className={`relative ${colors.bg} ${colors.border} border-2 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group`}
                  whileHover={{ y: -5 }}
                >
                  {/* Timeline connector */}
                  {index < professionalExperiences.length - 1 && (
                    <div className="absolute left-12 bottom-0 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent transform translate-y-full" />
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Icon & Period */}
                    <div className="flex items-center lg:items-start lg:flex-col gap-4 lg:gap-2">
                      <div className={`p-4 ${colors.icon} bg-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {exp.icon}
                      </div>
                      <div className="text-center lg:text-center">
                        <p className="font-semibold text-gray-900">{exp.period}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {exp.role}
                          </h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Building2 className="w-4 h-4" />
                              <span className="font-medium">{exp.company}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span>{exp.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 ${colors.badge} rounded-full text-sm font-medium`}>
                            {exp.type}
                          </span>
                          {exp.website && (
                            <motion.a
                              href={exp.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-gray-600 hover:text-blue-600"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </motion.a>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      {exp.achievements.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                            <ChevronRight className="w-4 h-4 text-blue-600" />
                            <span>Réalisations clés</span>
                          </h4>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, achIndex) => (
                              <motion.li 
                                key={achIndex}
                                className="flex items-start space-x-3 text-gray-600"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: achIndex * 0.1 }}
                                viewport={{ once: true }}
                              >
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                <span>{achievement}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Technologies */}
                      {exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <motion.span
                              key={techIndex}
                              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                              viewport={{ once: true }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Associative Experience */}
        {activeTab === 'associative' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {associativeExperiences.map((exp, index) => {
              const colors = getColorClasses(exp.color);
              return (
                <motion.div
                  key={exp.id}
                  variants={itemVariants}
                  className={`relative ${colors.bg} ${colors.border} border-2 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group`}
                  whileHover={{ y: -5 }}
                >
                  {/* Timeline connector */}
                  {index < associativeExperiences.length - 1 && (
                    <div className="absolute left-12 bottom-0 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent transform translate-y-full" />
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Icon & Period */}
                    <div className="flex items-center lg:items-start lg:flex-col gap-4 lg:gap-2">
                      <div className={`p-4 ${colors.icon} bg-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {exp.icon}
                      </div>
                      <div className="text-center lg:text-center">
                        <p className="font-semibold text-gray-900">{exp.period}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {exp.role}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">{exp.organization}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                        {exp.project && (
                          <div className="mt-2">
                            <span className={`px-3 py-1 ${colors.badge} rounded-full text-sm font-medium`}>
                              {exp.project}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      {exp.achievements.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                            <ChevronRight className="w-4 h-4 text-blue-600" />
                            <span>Actions menées</span>
                          </h4>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, achIndex) => (
                              <motion.li 
                                key={achIndex}
                                className="flex items-start space-x-3 text-gray-600"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: achIndex * 0.1 }}
                                viewport={{ once: true }}
                              >
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                <span>{achievement}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Skills */}
                      {exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, skillIndex) => (
                            <motion.span
                              key={skillIndex}
                              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                              viewport={{ once: true }}
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Empty states */}
        {activeTab === 'professional' && professionalExperiences.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune expérience professionnelle</h3>
            <p className="text-gray-600">Les expériences professionnelles s'afficheront ici.</p>
          </motion.div>
        )}

        {activeTab === 'associative' && associativeExperiences.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun engagement associatif</h3>
            <p className="text-gray-600">Les engagements associatifs s'afficheront ici.</p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white"
        >
          <h3 className="text-2xl font-bold mb-4">
            Intéressé par mon profil ?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Je suis toujours ouvert aux nouvelles opportunités et collaborations. 
            N'hésitez pas à me contacter pour discuter de vos projets !
          </p>
          <motion.button
            className="px-8 py-3 bg-white text-blue-600 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Me contacter
          </motion.button>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};