"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Building2,
  User,
  MessageSquare,
  Briefcase, 
  Home
} from 'lucide-react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

// Types pour le formulaire
interface FormData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactPage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Options pour le thème/sujet
  const subjectOptions = [
    { value: '', label: 'Sélectionnez un thème' },
    { value: 'stage', label: '🎓 Proposition de stage' },
    { value: 'freelance', label: '💼 Mission freelance/prestataire' },
    { value: 'emploi', label: '🏢 Opportunité d\'emploi' },
    { value: 'collaboration', label: '🤝 Collaboration sur un projet' },
    { value: 'conseil', label: '💡 Demande de conseil technique' },
    { value: 'formation', label: '📚 Cours particuliers' },
    { value: 'autre', label: '🔍 Autre demande' }
  ];

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.subject) {
      newErrors.subject = 'Veuillez sélectionner un thème';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de la soumission avec appel à l'API
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du message');
      }

      // Succès !
      setIsSubmitted(true);
      
      // Reset form après 3 secondes
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          company: '',
          subject: '',
          message: ''
        });
        setIsSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion des changements de champs
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (['name', 'email', 'subject', 'message'].includes(field)) {
      const errorField = field as keyof FormErrors;
      if (errors[errorField]) {
        setErrors(prev => ({ ...prev, [errorField]: undefined }));
      }
    }

    // Effacer l'erreur de soumission
    if (submitError) {
      setSubmitError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header avec navigation retour */}
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


      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Contactez-moi
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discutons de votre projet ! Je serais ravi d'échanger avec vous sur vos besoins 
              et voir comment nous pouvons collaborer ensemble.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Informations de contact */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes coordonnées</h2>
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-100 group relative"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600 truncate group-hover:hidden">
                        youssefmosbah04@gmail.com
                      </p>
                      <p className="text-gray-600 hidden group-hover:block break-all">
                        youssefmosbah04@gmail.com
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Téléphone</p>
                      <p className="text-gray-600">+33 07 67 06 96 70</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Localisation</p>
                      <p className="text-gray-600">Paris, France</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
                <h3 className="font-bold text-lg mb-2">Temps de réponse</h3>
                <p className="text-blue-100">
                  Je réponds généralement sous 24h. Pour les demandes urgentes, 
                  n'hésitez pas à me contacter directement par téléphone.
                </p>
              </div>
            </motion.div>

            {/* Formulaire de contact */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message envoyé !</h3>
                    <p className="text-gray-600">
                      Merci pour votre message. Je vous répondrai dans les plus brefs délais.
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {/* Message d'erreur global */}
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-red-800 font-medium">Erreur d'envoi</p>
                          <p className="text-red-700 text-sm mt-1">{submitError}</p>
                        </div>
                      </motion.div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Nom */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Nom complet *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              errors.name ? 'border-red-500 ring-2 ring-red-200' : ''
                            }`}
                            placeholder="Votre nom et prénom"
                          />
                        </div>
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm flex items-center space-x-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.name}</span>
                          </motion.p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              errors.email ? 'border-red-500 ring-2 ring-red-200' : ''
                            }`}
                            placeholder="votre.email@exemple.com"
                          />
                        </div>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm flex items-center space-x-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.email}</span>
                          </motion.p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Entreprise */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Entreprise/Organisation
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => handleChange('company', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Nom de votre entreprise"
                          />
                        </div>
                      </div>

                      {/* Thème */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Thème *
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            value={formData.subject}
                            onChange={(e) => handleChange('subject', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white ${
                              errors.subject ? 'border-red-500 ring-2 ring-red-200' : ''
                            }`}
                          >
                            {subjectOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.subject && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm flex items-center space-x-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.subject}</span>
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Message *
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                        <textarea
                          value={formData.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          rows={6}
                          className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                            errors.message ? 'border-red-500 ring-2 ring-red-200' : ''
                          }`}
                          placeholder="Décrivez votre projet, vos besoins ou votre demande en détail..."
                        />
                      </div>
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm flex items-center space-x-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.message}</span>
                        </motion.p>
                      )}
                      <p className="text-sm text-gray-500">
                        {formData.message.length} caractères (minimum 10)
                      </p>
                    </div>

                    {/* Bouton d'envoi */}
                    <motion.button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Envoyer le message</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;