"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { FilterPanel, FilterOptions } from '../ui/FilterPanel';
import { 
  ExternalLink, 
  Github, 
  Play,
  Users,
  Calendar,
  Code,
  Brain,
  Globe,
  Database,
  Gamepad2,
  ChevronRight,
  Search,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { ProjectsSkeleton } from '../skeletons/ProjectsSkeleton';

// Hook simple qui récupère tous les projets une fois
function useProjects() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError('Erreur lors du chargement');
        }
      } catch (err) {
        setError('Erreur de connexion');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { data, loading, error };
}

// Interface pour les projets formatés
interface FormattedProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  teamSize: number;
  durationMonths: number;
  year: number;
  featured: boolean;
  status: string;
  demoUrl?: string;
  githubUrl?: string;
  documentUrl?: string;
  image: string;
  icon: React.ReactNode;
  highlights: string[];
  challenges: string[];
}

export const Projects: React.FC = () => {
  // États pour les filtres et pagination
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: '',
    technology: '',
    favorite: null,
    teamSizeMin: null,
    teamSizeMax: null,
    durationMin: null,
    durationMax: null,
    year: null
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const PROJECTS_PER_PAGE = 4;

  // Intersection Observer pour les animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const projectsElement = document.getElementById('projects');
    if (projectsElement) {
      observer.observe(projectsElement);
    }

    return () => observer.disconnect();
  }, []);

  // Récupérer tous les projets une fois
  const { data: apiProjects, loading, error } = useProjects();

  // Mapper les données API vers le format utilisé
  const allProjects = useMemo(() => {
    if (!apiProjects) return [];
    return apiProjects.map(mapApiDataToProject);
  }, [apiProjects]);

  // Fonction de mapping
  function mapApiDataToProject(apiProject: any): FormattedProject {
    const getCategoryFromTechnologies = (technologies: any[]) => {
      const techNames = technologies.map(t => t.name.toLowerCase());
      
      if (techNames.some(name => ['react', 'next.js', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript'].includes(name))) {
        return 'Web Development';
      }
      if (techNames.some(name => ['python', 'machine learning', 'data analysis', 'pandas', 'scikit-learn', 'tensorflow', 'pytorch'].includes(name))) {
        return 'Data Science';
      }
      if (techNames.some(name => ['unity', 'unreal', 'game', 'phaser', 'canvas'].includes(name))) {
        return 'Game Development';
      }
      if (techNames.some(name => ['ai', 'artificial intelligence', 'deep learning', 'nlp', 'computer vision'].includes(name))) {
        return 'Artificial Intelligence';
      }
      return 'Other';
    };

    const getIcon = (category: string) => {
      switch (category) {
        case 'Web Development': return <Globe className="w-6 h-6" />;
        case 'Data Science': return <Database className="w-6 h-6" />;
        case 'Game Development': return <Gamepad2 className="w-6 h-6" />;
        case 'Artificial Intelligence': return <Brain className="w-6 h-6" />;
        default: return <Code className="w-6 h-6" />;
      }
    };

    const category = getCategoryFromTechnologies(apiProject.technologies);
    const year = apiProject.startDate ? new Date(apiProject.startDate).getFullYear() : new Date().getFullYear();

    return {
      id: apiProject.id,
      title: apiProject.title,
      slug: apiProject.slug,
      description: apiProject.description || '',
      category,
      technologies: apiProject.technologies.map((t: any) => t.name),
      teamSize: apiProject.teamSize || 1,
      durationMonths: apiProject.durationMonths || 1,
      year,
      featured: apiProject.favorite,
      status: 'completed',
      demoUrl: apiProject.logoUrl ? `/projects/${apiProject.slug}` : undefined,
      githubUrl: `https://github.com/youssef-mos/${apiProject.slug}`,
      documentUrl: `/docs/${apiProject.slug}.pdf`,
      image: apiProject.logoUrl || `/projects/${apiProject.slug}.jpg`,
      icon: getIcon(category),
      highlights: apiProject.keyPoints?.filter((p: string) => !p.startsWith('Défi:')) || [],
      challenges: apiProject.keyPoints?.filter((p: string) => p.startsWith('Défi:')).map((p: string) => p.replace('Défi: ', '')) || []
    };
  }
  const truncateText = (text: string, maxLength: number = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}...` : `${truncated}...`;
};

  // Filtrage côté client
  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];

    return allProjects.filter(project => {
      // Filtre de recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.technologies.some(tech => tech.toLowerCase().includes(searchLower)) ||
          project.highlights.some(h => h.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Filtre par catégorie
      if (filters.category && project.category !== filters.category) {
        return false;
      }

      // Filtre par technologie
      if (filters.technology) {
        const hasTechnology = project.technologies.some(tech => 
          tech.toLowerCase().includes(filters.technology.toLowerCase())
        );
        if (!hasTechnology) return false;
      }

      // Filtre favoris
      if (filters.favorite !== null && project.featured !== filters.favorite) {
        return false;
      }

      // Filtre taille d'équipe
      if (filters.teamSizeMin && project.teamSize < filters.teamSizeMin) {
        return false;
      }
      if (filters.teamSizeMax && project.teamSize > filters.teamSizeMax) {
        return false;
      }

      // Filtre durée
      if (filters.durationMin && project.durationMonths < filters.durationMin) {
        return false;
      }
      if (filters.durationMax && project.durationMonths > filters.durationMax) {
        return false;
      }

      // Filtre année
      if (filters.year && project.year !== filters.year) {
        return false;
      }

      return true;
    });
  }, [allProjects, filters]);

  // PAGINATION - Logique complète
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  // Reset de la page quand les filtres changent
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Extraire les données pour les filtres
  const availableCategories = useMemo(() => {
    const categories = [...new Set(allProjects.map(p => p.category))];
    return categories.filter(Boolean);
  }, [allProjects]);

  const availableTechnologies = useMemo(() => {
    const techs = allProjects.flatMap(p => p.technologies);
    return [...new Set(techs)].sort();
  }, [allProjects]);

  const availableYears = useMemo(() => {
    const years = [...new Set(allProjects.map(p => p.year))];
    return years.sort((a, b) => b - a);
  }, [allProjects]);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Web Development': 'bg-blue-100 text-blue-800 border-blue-200',
      'Data Science': 'bg-purple-100 text-purple-800 border-purple-200',
      'Game Development': 'bg-green-100 text-green-800 border-green-200',
      'Artificial Intelligence': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDurationText = (months: number) => {
    if (months === 1) return '1 mois';
    if (months < 12) return `${months} mois`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} an${years > 1 ? 's' : ''}`;
    return `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois`;
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
          <SectionWrapper id="projects" className="bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mes Projets
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez une sélection de projets sur lesquels j'ai travaillé
          </p>
        </div>

        {/* Skeleton Loading */}
        <ProjectsSkeleton />
      </div>
    </SectionWrapper>
  );
  }

  if (error) {
    return (
      <SectionWrapper id="projects" className="bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erreur lors du chargement des projets</p>
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
    <SectionWrapper id="projects" className="bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mes Projets
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez une sélection de projets sur lesquels j'ai travaillé, 
            allant du développement web à la data science en passant par les jeux interactifs.
          </p>
        </div>

        {/* Panneau de filtres */}
        <div className={`mb-12 transition-all duration-1000 delay-200 ${
          isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'
        }`}>
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            availableCategories={availableCategories}
            availableTechnologies={availableTechnologies}
            availableYears={availableYears}
            resultsCount={filteredProjects.length}
            totalCount={allProjects.length}
          />
        </div>



{/* Grid des projets PAGINES - VERSION AVEC HOVER */}
<div className="grid lg:grid-cols-2 gap-8">
  {paginatedProjects.map((project, index) => (
    <div
      key={project.id}
      className={`group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer animate-project-card ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ animationDelay: `${(index * 0.1) + 0.4}s` }}
      onClick={() => window.open(`/projets/${project.slug}`, '_blank')} // Redirection vers votre page de détail
    >
      {/* Project Header */}
      <div className="relative p-8 pb-6">
        {project.featured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse-gentle">
              <Star className="w-4 h-4" />
              <span>Projet phare</span>
            </div>
          </div>
        )}

        <div className="mb-4 pr-24">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              {project.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors break-words">
                {project.title}
              </h3>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(project.category)}`}>
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Terminé
            </span>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">
          {truncateText(project.description, 100)}
        </p>

        {/* Project Meta */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2 text-gray-500 group-hover:text-blue-600 transition-colors">
            <Users className="w-4 h-4" />
            <span className="text-sm">{project.teamSize} personnes</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 group-hover:text-blue-600 transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{getDurationText(project.durationMonths)}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 group-hover:text-blue-600 transition-colors">
            <Code className="w-4 h-4" />
            <span className="text-sm">{project.year}</span>
          </div>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.slice(0, 4).map((tech, techIndex) => (
            <span
              key={techIndex}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-blue-100 hover:text-blue-800 hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation() // Empêche la redirection quand on clique sur une tech
                setFilters(prev => ({ ...prev, technology: tech }))
              }}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
              +{project.technologies.length - 4} autres
            </span>
          )}
        </div>

        {/* Highlights */}
        {project.highlights.length > 0 && (
          <div className="space-y-2 mb-6">
            <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
              <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              <span>Points clés</span>
            </h4>
            <ul className="space-y-1">
              {project.highlights.slice(0, 3).map((highlight, index) => (
                <li key={index} className="flex items-start space-x-2 text-gray-600 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions avec effet hover - CETTE PARTIE EST NOUVELLE */}
        <div className="flex flex-wrap gap-3 mb-4">
          {project.demoUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                window.open(project.demoUrl, '_blank')
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 group/btn"
            >
              <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              <span>Tester</span>
            </button>
          )}
          
          {project.githubUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                window.open(project.githubUrl, '_blank')
              }}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-300 group/btn"
            >
              <Github className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              <span>Code</span>
            </button>
          )}
        </div>

        {/* NOUVEAU : Call to action avec effet hover */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
              <span className="text-sm text-gray-600">Voir le détail</span>
            </div>
            
            {/* Texte qui apparaît au hover - C'EST ÇA QUE VOUS VOULIEZ */}
            <div className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transform translate-x-2 group-hover:translate-x-0">
              Appuyez pour en savoir plus →
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-4 animate-fade-in-up">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:scale-105 active:scale-95'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Précédent</span>
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 hover:scale-110 active:scale-95 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:scale-105 active:scale-95'
              }`}
            >
              <span>Suivant</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Empty state */}
        {paginatedProjects.length === 0 && !loading && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-gentle">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun projet trouvé</h3>
            <p className="text-gray-600 mb-4">
              Aucun projet ne correspond à vos critères de recherche.
            </p>
            <button
              onClick={() => setFilters({
                search: '',
                category: '',
                technology: '',
                favorite: null,
                teamSizeMin: null,
                teamSizeMax: null,
                durationMin: null,
                durationMax: null,
                year: null
              })}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Voir tous les projets
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className={`text-center mt-16 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white transition-all duration-1000 delay-500 ${
          isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-2xl font-bold mb-4">
            Vous avez un projet en tête ?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Je suis toujours intéressé par de nouveaux défis techniques et des collaborations innovantes. 
            Discutons de votre projet !
          </p>
          <button
            className="px-8 py-3 bg-white text-blue-600 rounded-xl font-medium hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Démarrer une collaboration
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
};