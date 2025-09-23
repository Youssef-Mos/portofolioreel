"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useAnimation,
  easeOut,
} from "framer-motion";
import { 
  Home,
  User,
  Briefcase,
  FolderOpen,
  Mail,
  Code,
  Database,
  GraduationCap,
  Globe,
  Users,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  Settings,
  LogIn,
  Brain,
  Music,
  Gamepad2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjects, useExperiences, useEngagements } from '@/hooks/useApi';

// Hook pour détecter la section active
const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6, rootMargin: '-20% 0px -60% 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return activeSection;
};

// Types pour la navigation
interface NavItem {
  name: string;
  link: string;
  icon: React.JSX.Element;
  hasSubmenu: boolean;
  submenu?: {
    category: string;
    icon: React.JSX.Element;
    items: {
      name: string;
      desc: string;
    }[];
  }[];
}

const NavigationBar = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const controls = useAnimation();
  const activeSection = useActiveSection();
  const router = useRouter();

  // Récupérer les données depuis les APIs
  const { data: projects, loading: loadingProjects } = useProjects();
  const { data: experiences, loading: loadingExperiences } = useExperiences();
  const { data: engagements, loading: loadingEngagements } = useEngagements();

  // Types pour les projets et technologies
  interface Technology {
    name: string;
    [key: string]: any;
  }

  interface Project {
    title: string;
    description?: string;
    technologies?: Technology[];
    [key: string]: any;
  }

  // Mapper les projets par catégorie
  const projectsByCategory = useMemo(() => {
    if (!projects) {
      return { webProjects: [], dataProjects: [] };
    }

    const webProjects = (projects as Project[])
      .filter(p => p.technologies?.some((t: Technology) => 
        ['React', 'Next.js', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS'].includes(t.name)
      ))
      .slice(0, 3) // Limiter à 3 pour l'ergonomie
      .map(p => ({
        name: p.title,
        desc: p.description?.substring(0, 50) + '...' || 'Projet web'
      }));

    const dataProjects = (projects as Project[])
      .filter(p => p.technologies?.some((t: Technology) => 
        ['Python', 'Machine Learning', 'Data Science', 'Pandas', 'Scikit-learn'].includes(t.name)
      ))
      .slice(0, 3)
      .map(p => ({
        name: p.title,
        desc: p.description?.substring(0, 50) + '...' || 'Projet data science'
      }));

    return { webProjects, dataProjects };
  }, [projects]);

  // Mapper les expériences
  const experiencesByType = useMemo(() => {
    if (!experiences || !engagements) {
      return {
        professionalExp: [],
        associativeExp: []
      };
    }

    const professionalExp = experiences
      .slice(0, 3) // Limiter à 3
      .map(exp => ({
        name: exp.place || exp.title,
        desc: exp.title || 'Expérience professionnelle'
      }));

    const associativeExp = engagements
      .slice(0, 3) // Limiter à 3
      .map(eng => ({
        name: eng.place || eng.title,
        desc: eng.title || 'Engagement associatif'
      }));

    return { professionalExp, associativeExp };
  }, [experiences, engagements]);

  // Navigation items avec sous-menus dynamiques
  const navItems: NavItem[] = [
    {
      name: "Accueil",
      link: "home",
      icon: <Home className="w-4 h-4" />,
      hasSubmenu: false,
    },
    {
      name: "À propos",
      link: "about",
      icon: <User className="w-4 h-4" />,
      hasSubmenu: true,
      submenu: [
        {
          category: "Formation",
          icon: <GraduationCap className="w-5 h-5" />,
          items: [
            { name: "IMT Nord Europe", desc: "Ingénieur généraliste" },
            { name: "CPGE MP", desc: "Lycée Kléber" },
          ]
        },
        {
          category: "Compétences",
          icon: <Code className="w-5 h-5" />,
          items: [
            { name: "Full-Stack", desc: "React, Next.js, Node.js" },
            { name: "Data Science", desc: "Python, Machine Learning" },
            { name: "Langues", desc: "FR, AR, EN, IT, DE" },
          ]
        }
      ]
    },
    {
      name: "Projets",
      link: "projects",
      icon: <FolderOpen className="w-4 h-4" />,
      hasSubmenu: true,
      submenu: [
        {
          category: "Développement Web",
          icon: <Globe className="w-5 h-5" />,
          items: projectsByCategory.webProjects.length > 0 
            ? projectsByCategory.webProjects
            : [
                { name: "Site Omegup", desc: "Refonte complète avec Next.js" },
                { name: "Portfolio", desc: "React moderne et responsive" },
              ]
        },
        {
          category: "Data Science",
          icon: <Database className="w-5 h-5" />,
          items: projectsByCategory.dataProjects.length > 0 
            ? projectsByCategory.dataProjects
            : [
                { name: "Classification Musicale", desc: "ML avec Python" },
                { name: "Analyse Prédictive", desc: "Modèles statistiques" },
              ]
        }
      ]
    },
    {
      name: "Expérience",
      link: "experience",
      icon: <Briefcase className="w-4 h-4" />,
      hasSubmenu: true,
      submenu: [
        {
          category: "Professionnelle",
          icon: <Briefcase className="w-5 h-5" />,
          items: experiencesByType.professionalExp?.length > 0 
            ? experiencesByType.professionalExp
            : [
                { name: "Omegup", desc: "Développeur Full-Stack" },
                { name: "Les Sherpas", desc: "Professeur particulier" },
              ]
        },
        {
          category: "Associative",
          icon: <Users className="w-5 h-5" />,
          items: experiencesByType.associativeExp?.length > 0 
            ? experiencesByType.associativeExp
            : [
                { name: "Sport Pour Tous", desc: "Communication" },
                { name: "UCS", desc: "Aide alimentaire" },
              ]
        }
      ]
    },
    {
      name: "Contact",
      link: "contact",
      icon: <Mail className="w-4 h-4" />,
      hasSubmenu: false,
    },
  ];

  // Fonction de navigation fluide
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Gestion du scroll - LOGIQUE AMÉLIORÉE POUR PLUS DE FLUIDITÉ
  useMotionValueEvent(scrollY, "change", (current) => {
    const currentScrollY = current;
    const scrollDifference = Math.abs(currentScrollY - lastScrollY);
    
    // Détermine si on a scrollé
    if (currentScrollY > 100) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
    
    // Logique de visibilité améliorée avec seuils plus intelligents
    if (currentScrollY <= 50) {
      // Toujours visible en haut de page
      setVisible(true);
    } else {
      // Compare avec la position précédente avec un seuil minimal de mouvement
      if (scrollDifference > 5) { // Évite les micro-mouvements
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
          // Scroll vers le bas + assez loin = cache la navbar progressivement
          setVisible(false);
          setActiveSubmenu(null);
        } else if (currentScrollY < lastScrollY || scrollDifference > 50) {
          // Scroll vers le haut OU mouvement important = montre la navbar
          setVisible(true);
        }
      }
    }
    
    setLastScrollY(currentScrollY);
  });

  const handleContactClick = () => {
    router.push('/contact'); // Redirection page
  };

  const handleContactScroll = () => {
    scrollToSection('contact'); // Scroll section
  };

  const handleAdminLogin = () => {
    router.push('/login');
  };

  // Animation d'apparition au scroll
  useEffect(() => {
    controls.start(scrolled ? "scrolled" : "top");
  }, [scrolled, controls]);

  // Variants d'animation avec transitions plus douces
  const navVariants = {
    top: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    scrolled: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderColor: "rgba(0, 0, 0, 0.1)",
      boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
    }
  };

  const submenuVariants = {
    hidden: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: easeOut,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.nav
          initial={{ opacity: 1, y: 0 }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.46, 0.45, 0.94], // Cubic bezier pour plus de fluidité
            type: "tween"
          }}
          className={`fixed left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-6xl px-4 transition-all duration-500 ease-out ${
            scrolled ? 'top-4' : 'top-8'
          }`}
        >
          <motion.div
            variants={navVariants}
            animate={controls}
            transition={{ duration: 0.4, ease: easeOut }}
            className="relative rounded-2xl border border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-2xl" />
            
            <div className="relative flex items-center justify-between px-6 py-4">
              <motion.div 
                className="flex items-center space-x-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('home')}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">YM</span>
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Youssef Mosbah
                </span>
              </motion.div>

              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative z-[110]"
                    onMouseEnter={() => item.hasSubmenu && setActiveSubmenu(index)}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    <motion.button
                      onClick={() => item.name === 'Contact' ? handleContactScroll() : scrollToSection(item.link)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors duration-200 relative overflow-hidden group ${
                        activeSection === item.link 
                          ? 'text-blue-600 bg-blue-50/50' 
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      
                      {activeSection === item.link && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 bg-blue-100 rounded-xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      <span className="relative z-10 hidden sm:block">{item.icon}</span>
                      <span className="relative z-10 font-medium">{item.name}</span>
                      {item.hasSubmenu && (
                        <motion.div
                          animate={{ rotate: activeSubmenu === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="relative z-10"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      )}
                    </motion.button>
                  </div>
                ))}
              </div>

              <div className="hidden lg:flex items-center space-x-3">
                {/* Bouton Admin discret */}
                <motion.button
                  onClick={handleAdminLogin}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Administration"
                >
                  <Settings className="w-4 h-4" />
                </motion.button>

                {/* Bouton Contact principal */}
                <motion.button
                  onClick={handleContactClick}
                  className="relative px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Me contacter</span>
                </motion.button>
              </div>

              <motion.button
                className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        </motion.nav>
      </AnimatePresence>

      {/* Sous-menus */}
      <AnimatePresence>
        {activeSubmenu !== null && 
         navItems[activeSubmenu] && 
         navItems[activeSubmenu].hasSubmenu && 
         navItems[activeSubmenu].submenu && (
          <motion.div
            variants={submenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed left-1/2 transform -translate-x-1/2 w-96 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden z-[9999]"
            style={{
              top: scrolled ? 'calc(1rem + 80px)' : 'calc(2rem + 80px)',
            }}
            onMouseEnter={() => setActiveSubmenu(activeSubmenu)}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <div className="p-6">
              {/* Indicateur de chargement pour les données dynamiques */}
              {(activeSubmenu === 2 && loadingProjects) || (activeSubmenu === 3 && (loadingExperiences || loadingEngagements)) ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Chargement...</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {navItems[activeSubmenu].submenu!.map((category, catIndex) => (
                    <motion.div
                      key={catIndex}
                      variants={itemVariants}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2 text-gray-600 font-semibold">
                        {category.icon}
                        <span>{category.category}</span>
                        {/* Badge pour les données dynamiques */}
                        {((activeSubmenu === 2 && projects) || (activeSubmenu === 3 && (experiences || engagements))) && (
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                            Live
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 ml-7">
                        {category.items.map((subItem, subIndex) => (
                          <motion.div
                            key={subIndex}
                            className="group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            whileHover={{ x: 4 }}
                            onClick={() => {
                              scrollToSection(navItems[activeSubmenu!].link);
                              setActiveSubmenu(null);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {subItem.name}
                                </h4>
                                <p className="text-sm text-gray-500">{subItem.desc}</p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-4 top-24 bottom-4 w-80 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden"
            >
              <div className="p-6 h-full overflow-y-auto">
                <div className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => {
                          if (item.name === 'Contact') {
                            handleContactScroll();
                          } else {
                            scrollToSection(item.link);
                          }
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center space-x-3 p-3 rounded-xl transition-colors w-full text-left ${
                          activeSection === item.link 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                      </button>
                      
                      {item.hasSubmenu && item.submenu && (
                        <div className="ml-10 mt-2 space-y-2">
                          {item.submenu.map((category, catIndex) => (
                            <div key={catIndex} className="space-y-1">
                              <p className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                                <span>{category.category}</span>
                                {((index === 2 && projects) || (index === 3 && (experiences || engagements))) && (
                                  <span className="px-1 py-0.5 bg-green-100 text-green-600 text-xs rounded">Live</span>
                                )}
                              </p>
                              {category.items.map((subItem, subIndex) => (
                                <div key={subIndex} className="pl-4">
                                  <p className="text-sm text-gray-800">{subItem.name}</p>
                                  <p className="text-xs text-gray-500">{subItem.desc}</p>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                  {/* Bouton Admin mobile */}
                  <motion.button
                    className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleAdminLogin();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Administration</span>
                  </motion.button>

                  {/* Bouton Contact mobile */}
                  <motion.button
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      scrollToSection('contact');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Me contacter
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationBar;