// components/sections/Hero.tsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { ArrowDown, Download, Github, Linkedin, Mail, ChevronDown, Briefcase, FileText } from 'lucide-react';
import Image from 'next/image';

export const Hero: React.FC = () => {
  const [showCVOptions, setShowCVOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCVOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

const handleDownloadCV = (type: 'financier' | 'classique') => {
  const cvUrl = type === 'financier' ? '/cv-financier.pdf' : '/cv-classique.pdf';
  const fileName = type === 'financier' ? 'CV_Youssef_Mosbah_1.pdf' : 'CV_Youssef_Mosbah-2.pdf';
  
  // Créer un lien temporaire pour forcer le téléchargement
  const link = document.createElement('a');
  link.href = cvUrl;
  link.download = fileName; // Force le téléchargement avec un nom personnalisé
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setShowCVOptions(false);
};

  return (
    <SectionWrapper id="home" className="relative bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30">
      <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
        <div className="text-center space-y-12 max-w-5xl">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="w-40 h-40 mx-auto mb-6 relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              
              {/* Main avatar */}
              <div className="w-full h-full rounded-full overflow-hidden relative z-10 shadow-2xl group-hover:scale-105 transition-transform duration-300">
            {/* Skeleton (affiché tant que l'image n'est pas chargée) */}
      
            <Image
              src="/youssef.JPG"   // ton image dans /public
              alt="Profil"
              fill                // prend toute la div
              className="object-cover"
            />
          </div>
              
              {/* Status indicator */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full z-20">
                <div className="w-full h-full bg-green-500 rounded-full animate-ping"></div>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Youssef Mosbah
                </span>
              </h1>
              
              <div className="flex flex-wrap justify-center gap-3 text-sm font-medium">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full">Étudiant Ingénieur</span>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full">Full-Stack Developer</span>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full">Data Scientist</span>
              </div>
            </motion.div>

            <motion.p 
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Spécialisé en <span className="font-semibold text-blue-600">sciences des données</span> et 
              <span className="font-semibold text-purple-600"> développeur web</span>.
              <br />
              Passionné par l'innovation technologique et l'intelligence artificielle.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 pt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* CV Dropdown Button */}
              <div className="relative" ref={dropdownRef}>
                <motion.button 
                  onClick={() => setShowCVOptions(!showCVOptions)}
                  className="group px-8 py-4 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-5 h-5 group-hover:animate-bounce " />
                  <span>Télécharger CV</span>
                  <motion.div
                    animate={{ rotate: showCVOptions ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showCVOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-700">Choisissez votre CV</p>
                      </div>

                      {/* Options */}
                      <div className="p-2">
                        <motion.button
                          onClick={() => handleDownloadCV('financier')}
                          className="w-full group flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors duration-200"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                            <Briefcase className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left cursor-pointer flex-1">
                            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">CV Financier</p>
                            <p className="text-xs text-gray-500">CV Formel</p>
                          </div>
                          <Download className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>

                        <motion.button
                          onClick={() => handleDownloadCV('classique')}
                          className="w-full group flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-purple-50 transition-colors duration-200"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left cursor-pointer flex-1">
                            <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">CV Classique</p>
                            <p className="text-xs text-gray-500"></p>
                          </div>
                          <Download className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                      </div>

                      {/* Footer hint */}
                      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                        <p className="text-xs text-gray-500 text-center">Format PDF • Dernière mise à jour</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <motion.button 
                className="group px-8 py-4 cursor-pointer bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center space-x-3 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span><a href='https://github.com/Youssef-Mos' target="_blank" rel="noopener noreferrer">GitHub</a></span>
              </motion.button>
              
              <motion.button 
                className="group px-8 py-4 cursor-pointer bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center space-x-3 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Linkedin className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span><a href='https://www.linkedin.com/in/youssef-mosbah-855652292/' target="_blank" rel="noopener noreferrer">LinkedIn</a></span>
              </motion.button>
              
              <motion.button 
                className="group px-8 py-4 cursor-pointer bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center space-x-3 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span><a href='/contact'>Contact</a></span>
              </motion.button>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            className="pt-16 pb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm text-gray-500 font-medium">Découvrir mon parcours</p>
              <motion.button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex flex-col items-center space-y-1"
                whileHover={{ scale: 1.1 }}
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                <ArrowDown className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                <ArrowDown className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors duration-300 -mt-2" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};