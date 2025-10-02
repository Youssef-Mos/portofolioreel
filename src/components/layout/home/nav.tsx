"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
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
  Moon,
  Sun,
  Check,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useProjects, useExperiences, useEngagements } from '@/hooks/useApi';
import Image from "next/image";

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
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const { darkMode, themeColor, toggleDarkMode, setThemeColor } = useTheme();
  const [lastScrollY, setLastScrollY] = useState(0);
  const controls = useAnimation();
  const activeSection = useActiveSection();
  const router = useRouter();
  const settingsPanelRef = useRef<HTMLDivElement>(null);

  // Récupérer les données depuis les APIs
  const { data: projects, loading: loadingProjects } = useProjects();
  const { data: experiences, loading: loadingExperiences } = useExperiences();
  const { data: engagements, loading: loadingEngagements } = useEngagements();

  // Fermer le panel settings au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsPanelRef.current && !settingsPanelRef.current.contains(event.target as Node)) {
        setShowSettingsPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gérer le dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Thèmes de couleurs disponibles - SIMPLIFIÉ
  const themes = [
    { name: 'blue', label: 'Bleu', color: '#3B82F6' },
    { name: 'purple', label: 'Violet', color: '#A855F7' },
    { name: 'green', label: 'Vert', color: '#10B981' },
    { name: 'orange', label: 'Orange', color: '#F59E0B' },
    { name: 'red', label: 'Rouge', color: '#EF4444' },
    { name: 'pink', label: 'Rose', color: '#EC4899' },
  ];

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

  // Mapper les projets par catégorie - ENTIÈREMENT DYNAMIQUE
  const projectsByCategory = useMemo(() => {
    if (!projects || projects.length === 0) {
      return { webProjects: [], dataProjects: [], otherProjects: [] };
    }

    const allProjects = projects as Project[];
    
    const webTechnologies = ['React', 'Next.js', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Node.js', 'Express', 'Tailwind'];
    const dataTechnologies = ['Python', 'Machine Learning', 'Data Science', 'Pandas', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'NumPy'];

    const webProjects = allProjects
      .filter(p => p.technologies?.some((t: Technology) => 
        webTechnologies.some(tech => t.name?.toLowerCase().includes(tech.toLowerCase()))
      ))
      .map(p => ({
        name: p.title,
        desc: p.description?.substring(0, 60) || 'Projet web'
      }));

    const dataProjects = allProjects
      .filter(p => p.technologies?.some((t: Technology) => 
        dataTechnologies.some(tech => t.name?.toLowerCase().includes(tech.toLowerCase()))
      ))
      .map(p => ({
        name: p.title,
        desc: p.description?.substring(0, 60) || 'Projet data science'
      }));

    const otherProjects = allProjects
      .filter(p => {
        const hasWebTech = p.technologies?.some((t: Technology) => 
          webTechnologies.some(tech => t.name?.toLowerCase().includes(tech.toLowerCase()))
        );
        const hasDataTech = p.technologies?.some((t: Technology) => 
          dataTechnologies.some(tech => t.name?.toLowerCase().includes(tech.toLowerCase()))
        );
        return !hasWebTech && !hasDataTech;
      })
      .map(p => ({
        name: p.title,
        desc: p.description?.substring(0, 60) || 'Autre projet'
      }));

    return { webProjects, dataProjects, otherProjects };
  }, [projects]);

  // Mapper les expériences - ENTIÈREMENT DYNAMIQUE
  const experiencesByType = useMemo(() => {
    if (!experiences && !engagements) {
      return { professionalExp: [], associativeExp: [] };
    }

    const professionalExp = (experiences || [])
      .map(exp => ({
        name: exp.place || exp.title,
        desc: exp.title || exp.description?.substring(0, 60) || 'Expérience professionnelle'
      }));

    const associativeExp = (engagements || [])
      .map(eng => ({
        name: eng.place || eng.title,
        desc: eng.title || eng.description?.substring(0, 60) || 'Engagement associatif'
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
      icon: <FolderOpen className="w-4 h-4 " />,
      hasSubmenu: true,
      submenu: [
        {
          category: "Développement Web",
          icon: <Globe className="w-5 h-5" />,
          items: projectsByCategory.webProjects.length > 0 
            ? projectsByCategory.webProjects
            : [{ name: "Aucun projet web", desc: "Ajoutez vos premiers projets" }]
        },
        {
          category: "Data Science",
          icon: <Database className="w-5 h-5" />,
          items: projectsByCategory.dataProjects.length > 0 
            ? projectsByCategory.dataProjects
            : [{ name: "Aucun projet data", desc: "Ajoutez vos premiers projets" }]
        },
        ...(projectsByCategory.otherProjects.length > 0 ? [{
          category: "Autres Projets",
          icon: <Code className="w-5 h-5" />,
          items: projectsByCategory.otherProjects
        }] : [])
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
          items: experiencesByType.professionalExp.length > 0 
            ? experiencesByType.professionalExp
            : [{ name: "Aucune expérience", desc: "Ajoutez vos expériences" }]
        },
        {
          category: "Associative",
          icon: <Users className="w-5 h-5" />,
          items: experiencesByType.associativeExp.length > 0 
            ? experiencesByType.associativeExp
            : [{ name: "Aucun engagement", desc: "Ajoutez vos engagements" }]
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

  // Gestion du scroll
  useMotionValueEvent(scrollY, "change", (current) => {
    const currentScrollY = current;
    const scrollDifference = Math.abs(currentScrollY - lastScrollY);
    
    if (currentScrollY > 100) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
    
    if (currentScrollY <= 50) {
      setVisible(true);
    } else {
      if (scrollDifference > 5) {
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
          setVisible(false);
          setActiveSubmenu(null);
        } else if (currentScrollY < lastScrollY || scrollDifference > 50) {
          setVisible(true);
        }
      }
    }
    
    setLastScrollY(currentScrollY);
  });

  const handleContactClick = () => {
    router.push('/contact');
  };

  const handleContactScroll = () => {
    scrollToSection('contact');
  };

  useEffect(() => {
    controls.start(scrolled ? "scrolled" : "top");
  }, [scrolled, controls]);

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
            ease: [0.25, 0.46, 0.45, 0.94],
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
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                <Image
                  src="/youssef.JPG"    // chemin relatif depuis /public
                  alt="YM"
                  width={32}           // correspond à w-8
                  height={32}          // correspond à h-8
                  className="object-cover"
                />
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
                {/* Bouton Settings avec panel */}
                <div className="relative" ref={settingsPanelRef}>
                  <button
                    onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                    className={`p-2 rounded-lg transition-all ${
                      showSettingsPanel 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Paramètres"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* Panel de paramètres - ULTRA ÉPURÉ */}
                  <AnimatePresence>
                    {showSettingsPanel && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-3 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[150]"
                      >
                        <div className="p-4 space-y-5">
                          {/* Header */}
                          <div>
                            <h3 className="font-bold text-gray-900">Paramètres</h3>
                          </div>

                          {/* Thème de couleur */}
                          

                          {/* Divider */}
                          <div className="border-t border-gray-100" />

                          {/* Bouton Admin */}
                          <button
                            onClick={() => {
                              router.push('/login');
                              setShowSettingsPanel(false);
                            }}
                            className="w-full cursor-pointer flex items-center justify-between px-3 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors text-sm font-medium"
                          >
                            <div className="flex items-center gap-2">
                              <LogIn className="w-4 h-4" />
                              <span>Connexion Admin</span>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bouton Contact principal */}
                <button
                  onClick={handleContactClick}
                  className="px-6 py-2 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-colors"
                >
                  Me contacter
                </button>
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

      {/* Sous-menus - LAYOUT HORIZONTAL */}
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
            className="fixed left-1/2 transform -translate-x-1/2 w-[800px] max-w-[90vw] bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden z-[9999]"
            style={{
              top: scrolled ? 'calc(1rem + 80px)' : 'calc(2rem + 80px)',
            }}
            onMouseEnter={() => setActiveSubmenu(activeSubmenu)}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {(activeSubmenu === 2 && loadingProjects) || (activeSubmenu === 3 && (loadingExperiences || loadingEngagements)) ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Chargement...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {navItems[activeSubmenu].submenu!.map((category, catIndex) => (
                    <motion.div
                      key={catIndex}
                      variants={itemVariants}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <div className="flex items-center space-x-2 text-gray-600 font-semibold">
                          {category.icon}
                          <span>{category.category}</span>
                        </div>
                        {category.items.length > 0 && !category.items[0]?.name.includes('Aucun') && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                            {category.items.length}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {category.items.map((subItem, subIndex) => (
                          <motion.div
                            key={subIndex}
                            className={`group p-3 rounded-lg transition-all duration-200 ${
                              subItem.name.includes('Aucun') 
                                ? 'opacity-50 cursor-default bg-gray-50' 
                                : 'cursor-pointer hover:bg-blue-50 hover:shadow-sm border border-transparent hover:border-blue-200'
                            }`}
                            whileHover={subItem.name.includes('Aucun') ? {} : { scale: 1.02 }}
                            onClick={() => {
                              if (!subItem.name.includes('Aucun')) {
                                scrollToSection(navItems[activeSubmenu!].link);
                                setActiveSubmenu(null);
                              }
                            }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-medium text-sm mb-1 transition-colors truncate ${
                                  subItem.name.includes('Aucun')
                                    ? 'text-gray-400'
                                    : 'text-gray-900 group-hover:text-blue-600'
                                }`}>
                                  {subItem.name}
                                </h4>
                                <p className="text-xs text-gray-500 line-clamp-2">{subItem.desc}</p>
                              </div>
                              {!subItem.name.includes('Aucun') && (
                                <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                              )}
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
                        className={`flex items-center cursor-pointer space-x-3 p-3 rounded-xl transition-colors w-full text-left ${
                          activeSection === item.link 
                            ? 'bg-blue-50 text-blue-600 cursor-pointer' 
                            : 'hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                      </button>
                      
                      {item.hasSubmenu && item.submenu && (
                        <div className="ml-10 mt-2 space-y-2">
                          {item.submenu.map((category, catIndex) => (
                            <div key={catIndex} className="space-y-1">
                              <p className="text-sm font-medium text-gray-600 flex items-center justify-between">
                                <span>{category.category}</span>
                                {category.items.length > 0 && !category.items[0]?.name.includes('Aucun') && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                                    {category.items.length}
                                  </span>
                                )}
                              </p>
                              {category.items.map((subItem, subIndex) => (
                                <div key={subIndex} className={`pl-4 ${subItem.name.includes('Aucun') ? 'opacity-50' : ''}`}>
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
                  {/* Paramètres mobile - ULTRA ÉPURÉ */}
                  <div className="space-y-3 mb-4 bg-gray-50 rounded-lg p-3">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Paramètres</h3>

                    {/* Thème couleur mobile */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600">Couleur</label>
                      <div className="grid grid-cols-6 gap-1.5">
                        {themes.map((theme) => (
                          <button
                            key={theme.name}
                            onClick={() => setThemeColor(theme.name as any)}
                            className={`h-8 rounded-md transition-all ${
                              themeColor === theme.name ? 'ring-2 ring-offset-1 ring-gray-900' : ''
                            }`}
                            style={{ backgroundColor: theme.color }}
                          >
                            {themeColor === theme.name && (
                              <Check className="w-3.5 h-3.5 text-white mx-auto" strokeWidth={3} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mode sombre mobile */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        {darkMode ? <Moon className="w-4 h-4 text-gray-600" /> : <Sun className="w-4 h-4 text-gray-600" />}
                        <span className="text-xs font-medium text-gray-700">Mode sombre</span>
                      </div>
                      <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                    </div>
                  </div>

                  {/* Boutons mobile */}
                  <button
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors text-sm font-medium"
                    onClick={() => {
                      router.push('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      <span>Connexion Admin</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                  </button>

                  <button
                    className="w-full py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-md font-medium hover:border-blue-500 hover:text-blue-600 transition-colors text-sm"
                    onClick={() => {
                      scrollToSection('contact');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Me contacter
                  </button>
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