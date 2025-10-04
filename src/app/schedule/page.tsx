"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarDays, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  User,
  Home,
  Wrench,
  AlertCircle
} from 'lucide-react';

export default function SchedulePage() {
  const [currentDate] = useState(new Date());

  // Créneaux horaires (affichage uniquement)
  const timeSlots = [
    { time: '09:00-10:00' },
    { time: '10:00-11:00' },
    { time: '11:00-12:00' },
    { time: '14:00-15:00' },
    { time: '15:00-16:00' },
    { time: '16:00-17:00' },
    { time: '17:00-18:00' },
  ];

  // Générer les jours du calendrier
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 relative overflow-hidden">
      {/* Bouton Accueil */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 left-6 z-50"
      >
        <a
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <Home className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline text-sm font-medium text-gray-700">Accueil</span>
        </a>
      </motion.div>

      {/* Contenu principal (blurred) */}
      <div className="max-w-7xl mx-auto filter blur-sm opacity-40 pointer-events-none">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CalendarDays className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              Planifier un appel
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez une date et un créneau horaire pour échanger ensemble
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendrier */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            {/* Navigation du mois */}
            <div className="flex items-center justify-between mb-8">
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-2">
              {generateCalendarDays().map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                return (
                  <div
                    key={index}
                    className="aspect-square rounded-xl font-medium bg-gray-50 text-gray-900 flex items-center justify-center"
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>

            {/* Légende */}
            <div className="flex items-center justify-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded" />
                <span className="text-gray-600">Sélectionné</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded" />
                <span className="text-gray-600">Passé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 rounded" />
                <span className="text-gray-600">Complet</span>
              </div>
            </div>
          </div>

          {/* Créneaux horaires */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-bold text-gray-900">Créneaux disponibles</h3>
                  <p className="text-sm text-gray-600">Sélectionnez une date</p>
                </div>
              </div>

              <div className="space-y-3">
                {timeSlots.map(slot => (
                  <div
                    key={slot.time}
                    className="w-full px-4 py-3 rounded-xl font-medium bg-gray-50 text-gray-900"
                  >
                    <span>{slot.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay de maintenance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-40 px-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6,
            type: "spring",
            stiffness: 100
          }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full relative overflow-hidden"
        >
          {/* Effet de fond animé */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-orange-50/50 opacity-30" />
          
          {/* Icône animée */}
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center relative z-10 shadow-lg"
          >
            <Wrench className="w-12 h-12 text-white" />
          </motion.div>

          {/* Contenu */}
          <div className="text-center space-y-6 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-900"
            >
              En maintenance
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <p className="text-xl text-gray-700 leading-relaxed">
                La prise de rendez-vous est temporairement indisponible.
              </p>
              
              <div className="flex items-center justify-center gap-3 text-gray-600 bg-blue-50 rounded-2xl p-4">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-left">
                  Nous travaillons à améliorer cette fonctionnalité pour vous offrir une meilleure expérience.
                </p>
              </div>
            </motion.div>

            {/* Alternatives de contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-6 border-t border-gray-200"
            >
              <p className="text-lg font-semibold text-gray-900 mb-4">
                En attendant, vous pouvez me contacter via :
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  <span>Page Contact</span>
                </motion.a>
                
                <motion.a
                  href="mailto:youssefmosbah04@gmail.com"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>Email</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Message de remerciement */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-gray-500 italic pt-4"
            >
              Merci de votre compréhension 🙏
            </motion.p>
          </div>

          {/* Particules décoratives */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-4 left-4 w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full blur-2xl"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}