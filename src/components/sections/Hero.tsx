// components/sections/Hero.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <SectionWrapper id="home" className="relative bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30">
      {/* Background decorative elements */}
      

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
              <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 relative z-10 flex items-center justify-center text-5xl font-bold text-white shadow-2xl group-hover:scale-105 transition-transform duration-300">
                YM
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
              <span className="font-semibold text-purple-600"> ingénierie des marchés financiers</span>.
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
              <motion.button 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span>Télécharger CV</span>
              </motion.button>
              
              <motion.button 
                className="group px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center space-x-3 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>GitHub</span>
              </motion.button>
              
              <motion.button 
                className="group px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center space-x-3 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Linkedin className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>LinkedIn</span>
              </motion.button>
              
              <motion.button 
                className="group px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center space-x-3 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Contact</span>
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

      {/* Custom styles for additional animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </SectionWrapper>
  );
};