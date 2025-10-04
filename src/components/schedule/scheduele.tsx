"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDays, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  User,
  Mail,
  Phone,
  MessageSquare,
  Check,
  X,
  Loader2,
  Home
} from 'lucide-react';
import Link from 'next/link';

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [bookedDates, setBookedDates] = useState<{ [key: string]: string[] }>({});
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Créneaux horaires disponibles (9h-18h)
  const timeSlots: TimeSlot[] = [
    { time: '09:00-10:00', available: true },
    { time: '10:00-11:00', available: true },
    { time: '11:00-12:00', available: true },
    { time: '14:00-15:00', available: true },
    { time: '15:00-16:00', available: true },
    { time: '16:00-17:00', available: true },
    { time: '17:00-18:00', available: true },
  ];

  // Charger les rendez-vous du mois
  useEffect(() => {
    fetchMonthAppointments();
  }, [currentDate]);

  // Charger les créneaux d'une date spécifique
  useEffect(() => {
    if (selectedDate) {
      fetchDayAppointments(selectedDate);
      // Réinitialiser le créneau sélectionné et le formulaire quand on change de date
      setSelectedTimeSlot(null);
      setShowForm(false);
    }
  }, [selectedDate]);

  const fetchMonthAppointments = async () => {
    const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    try {
      const response = await fetch(`/api/appointments?month=${month}`);
      const data = await response.json();
      setBookedDates(data.bookedDates || {});
    } catch (error) {
      console.error('Error fetching month appointments:', error);
    }
  };

  const fetchDayAppointments = async (date: Date) => {
    setLoading(true);
    const dateStr = date.toISOString().split('T')[0];
    try {
      const response = await fetch(`/api/appointments?date=${dateStr}`);
      const data = await response.json();
      setBookedSlots(data.bookedSlots || []);
    } catch (error) {
      console.error('Error fetching day appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTimeSlot) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate.toISOString().split('T')[0],
          timeSlot: selectedTimeSlot,
          ...formData
        })
      });

      if (response.ok) {
        // Succès - Message plus détaillé
        const formattedDate = selectedDate.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long',
          year: 'numeric'
        });
        alert(`✅ Rendez-vous réservé avec succès !\n\nDate : ${formattedDate}\nHeure : ${selectedTimeSlot}\n\nVous recevrez une confirmation par email à ${formData.email}`);
        setShowForm(false);
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        setFormData({ name: '', email: '', phone: '', message: '' });
        fetchMonthAppointments();
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || 'Erreur lors de la réservation'}`);
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      alert('❌ Erreur de connexion. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Générer les jours du calendrier
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Jours vides du début
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDatePast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const isDateFullyBooked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const booked = bookedDates[dateStr] || [];
    return booked.length >= timeSlots.length;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isTimeSlotPast = (timeSlot: string) => {
    if (!selectedDate) return false;
    
    const today = new Date();
    const selectedDateStr = selectedDate.toDateString();
    const todayStr = today.toDateString();
    
    // Si ce n'est pas aujourd'hui, pas besoin de vérifier l'heure
    if (selectedDateStr !== todayStr) return false;
    
    // Extraire l'heure de fin du créneau (ex: "09:00-10:00" -> "10:00")
    const endTime = timeSlot.split('-')[1];
    const [hours, minutes] = endTime.split(':').map(Number);
    
    // Créer une date avec l'heure de fin du créneau
    const slotEndTime = new Date(selectedDate);
    slotEndTime.setHours(hours, minutes, 0, 0);
    
    // Le créneau est passé si son heure de fin est avant maintenant
    return slotEndTime < today;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 left-6 z-50"
        >
        <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
            <Home className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-sm font-medium text-gray-700">Accueil</span>
        </Link>
        </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <CalendarDays className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              Planifier un appel
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez une date et un créneau horaire pour échanger ensemble
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendrier */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8"
          >
            {/* Navigation du mois */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={goToPreviousMonth}
                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button
                onClick={goToNextMonth}
                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
              >
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

                const isPast = isDatePast(date);
                const isFullyBooked = isDateFullyBooked(date);
                const isSelected = isDateSelected(date);
                const isDisabled = isPast || isFullyBooked;

                return (
                  <motion.button
                    key={index}
                    onClick={() => !isDisabled && setSelectedDate(date)}
                    disabled={isDisabled}
                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    className={`
                      aspect-square rounded-xl font-medium transition-all relative
                      ${isSelected 
                        ? 'bg-blue-600 text-white shadow-lg scale-105' 
                        : isPast
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isFullyBooked
                        ? 'bg-red-50 text-red-400 cursor-not-allowed'
                        : 'bg-gray-50 text-gray-900 hover:bg-blue-50 hover:text-blue-600'
                      }
                    `}
                  >
                    {date.getDate()}
                    {isFullyBooked && !isPast && (
                      <X className="w-3 h-3 absolute top-1 right-1 text-red-500" />
                    )}
                  </motion.button>
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
          </motion.div>

          {/* Créneaux horaires et formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Créneaux horaires */}
            {selectedDate && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-gray-900">Créneaux disponibles</h3>
                    <p className="text-sm text-gray-600">
                      {selectedDate.toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {timeSlots.map(slot => {
                        const isBooked = bookedSlots.includes(slot.time);
                        const isPastSlot = isTimeSlotPast(slot.time);
                        const isSelected = selectedTimeSlot === slot.time;
                        const isDisabled = isBooked || isPastSlot;

                        return (
                          <motion.button
                            key={slot.time}
                            onClick={() => {
                              if (!isDisabled) {
                                setSelectedTimeSlot(slot.time);
                                setShowForm(true);
                              }
                            }}
                            disabled={isDisabled}
                            whileHover={!isDisabled ? { x: 4 } : {}}
                            whileTap={!isDisabled ? { scale: 0.98 } : {}}
                            className={`
                              w-full px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between
                              ${isSelected
                                ? 'bg-blue-600 text-white shadow-lg'
                                : isDisabled
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-50 text-gray-900 hover:bg-blue-50 hover:text-blue-600'
                              }
                            `}
                          >
                            <span>{slot.time}</span>
                            {isBooked && <X className="w-4 h-4" />}
                            {isPastSlot && !isBooked && (
                              <span className="text-xs text-gray-500">Passé</span>
                            )}
                            {isSelected && <Check className="w-4 h-4" />}
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    {/* Message si tous les créneaux sont pris ou passés */}
                    {timeSlots.every(slot => 
                      bookedSlots.includes(slot.time) || isTimeSlotPast(slot.time)
                    ) && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <p className="text-sm text-yellow-800 text-center">
                          ⚠️ Aucun créneau disponible pour cette date.
                          <br />
                          Veuillez sélectionner une autre date.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Formulaire */}
            <AnimatePresence>
              {showForm && selectedTimeSlot && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl shadow-xl p-6"
                >
                  {/* Récapitulatif du rendez-vous */}
                  <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      📅 Récapitulatif de votre rendez-vous
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm text-blue-800">
                        <strong>Date :</strong> {selectedDate?.toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-blue-800">
                        <strong>Heure :</strong> {selectedTimeSlot}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Vos informations
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="Jean Dupont"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="jean.dupont@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                        placeholder="Sujet de l'appel..."
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !formData.name || !formData.email}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Réservation...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Confirmer le rendez-vous</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}