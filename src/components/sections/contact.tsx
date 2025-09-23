"use client";
import React from 'react';
import { easeOut, motion } from 'framer-motion';
import { SectionWrapper } from '../ui/SectionWrapper';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin,
  Download,
  ExternalLink,
  MessageCircle,
  Calendar,
  Globe,
  Send
} from 'lucide-react';

export const Contact: React.FC = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "youssefmosbah04@gmail.com",
      link: "mailto:youssefmosbah04@gmail.com",
      color: "blue",
      description: "Réponse sous 24h"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Téléphone",
      value: "+33 07 67 06 96 70",
      link: "tel:+33767069670",
      color: "green",
      description: "Lun-Ven 9h-18h"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Localisation",
      value: "Paris, France",
      link: "https://maps.google.com/?q=Paris,France",
      color: "purple",
      description: "Disponible sur site ou à distance"
    }
  ];

  const socialLinks = [
    {
      name: "GitHub",
      username: "Youssef-Mos",
      url: "https://github.com/Youssef-Mos",
      icon: <Github className="w-6 h-6" />,
      color: "gray",
      description: "Mes projets et contributions"
    },
    {
      name: "LinkedIn",
      username: "Youssef Mosbah",
      url: "https://linkedin.com/in/youssef-mosbah",
      icon: <Linkedin className="w-6 h-6" />,
      color: "blue",
      description: "Réseau professionnel"
    }
  ];

  const quickActions = [
    {
      title: "Télécharger mon CV",
      description: "Version PDF mise à jour",
      icon: <Download className="w-5 h-5" />,
      action: () => {
        // Logique de téléchargement du CV
        console.log("Téléchargement du CV");
      },
      color: "blue"
    },
    {
      title: "Me contacter directement",
      description: "Formulaire de contact détaillé",
      icon: <Send className="w-5 h-5" />,
      action: () => {
        window.location.href = '/contact';
      },
      color: "purple"
    },
    {
      title: "Programmer un appel",
      description: "Réserver un créneau de discussion",
      icon: <Calendar className="w-5 h-5" />,
      action: () => {
        // Lien vers calendrier de réservation
        console.log("Ouverture du calendrier");
      },
      color: "green"
    }
  ];

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
    hidden: { opacity: 0, y: 30 },
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
        hover: 'hover:bg-blue-100'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        hover: 'hover:bg-green-100'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        hover: 'hover:bg-purple-100'
      },
      gray: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: 'text-gray-600',
        hover: 'hover:bg-gray-100'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <SectionWrapper id="contact" className="bg-gradient-to-br from-gray-50 to-blue-50/30">
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
            Restons en contact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une question ? Un projet ? Une opportunité ? 
            N'hésitez pas à me contacter, je serais ravi d'échanger avec vous !
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Informations de contact principales */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const colors = getColorClasses(info.color);
              return (
                <motion.a
                  key={index}
                  href={info.link}
                  target={info.link.startsWith('http') ? '_blank' : '_self'}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  className={`group p-8 ${colors.bg} ${colors.border} border-2 rounded-3xl ${colors.hover} transition-all duration-300 block`}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 bg-white rounded-2xl shadow-lg ${colors.icon} group-hover:scale-110 transition-transform duration-300`}>
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                      <p className="text-gray-800 font-medium mb-1">{info.value}</p>
                      <p className="text-gray-600 text-sm">{info.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </motion.a>
              );
            })}
          </motion.div>

          {/* Actions rapides */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Actions rapides</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const colors = getColorClasses(action.color);
                return (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    className={`p-6 ${colors.bg} ${colors.border} border-2 rounded-2xl ${colors.hover} transition-all duration-300 text-left group`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 bg-white rounded-xl ${colors.icon} group-hover:scale-110 transition-transform duration-300`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                        <p className="text-gray-600 text-sm">{action.description}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Réseaux sociaux */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Retrouvez-moi aussi sur</h3>
            <div className="flex justify-center space-x-6">
              {socialLinks.map((social, index) => {
                const colors = getColorClasses(social.color);
                return (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group p-6 ${colors.bg} ${colors.border} border-2 rounded-2xl ${colors.hover} transition-all duration-300 flex flex-col items-center space-y-3 min-w-[200px]`}
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`p-4 bg-white rounded-xl ${colors.icon} group-hover:scale-110 transition-transform duration-300`}>
                      {social.icon}
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-gray-900">{social.name}</h4>
                      <p className="text-gray-700 font-medium text-sm">{social.username}</p>
                      <p className="text-gray-500 text-xs mt-1">{social.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Message de fin avec CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white"
          >
            <h3 className="text-2xl font-bold mb-4">
              Prêt à démarrer un projet ensemble ?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Que ce soit pour un stage, une mission freelance, ou simplement pour échanger 
              sur des idées innovantes, je suis toujours ouvert aux nouvelles opportunités.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => window.location.href = '/contact'}
                className="px-8 py-3 bg-white text-blue-600 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2 justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Envoyer un message</span>
              </motion.button>
              <motion.a
                href="mailto:youssefmosbah04@gmail.com"
                className="px-8 py-3 border-2 border-white text-white rounded-xl font-medium hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center space-x-2 justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5" />
                <span>Email direct</span>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};