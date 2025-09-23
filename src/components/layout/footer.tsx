// components/layout/Footer.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Download,
  Heart,
  Code,
  Coffee,
  ArrowUp,
  ExternalLink,
  Globe
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footerElement = document.getElementById('footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Accueil', href: '#home' },
    { name: 'À propos', href: '#about' },
    { name: 'Projets', href: '#projects' },
    { name: 'Expérience', href: '#experience' },
    { name: 'Contact', href: '#contact' }
  ];

  const projects = [
    { name: 'Portfolio Personnel', desc: 'Site vitrine moderne' },
    { name: 'Classification Musicale', desc: 'ML avec Python' },
    { name: 'Omegup Platform', desc: 'Refonte complète' }
  ];

  const contactInfo = [
    { 
      icon: <Mail className="w-5 h-5" />, 
      label: 'Email', 
      value: 'youssef.mosbah@example.com',
      link: 'mailto:youssef.mosbah@example.com'
    },
    { 
      icon: <Phone className="w-5 h-5" />, 
      label: 'Téléphone', 
      value: '+33 6 XX XX XX XX',
      link: 'tel:+33XXXXXXXXX'
    },
    { 
      icon: <MapPin className="w-5 h-5" />, 
      label: 'Localisation', 
      value: 'Lille, France',
      link: '#'
    }
  ];

  const socialLinks = [
    { 
      name: 'GitHub', 
      icon: <Github className="w-5 h-5" />, 
      href: 'https://github.com/yourusername',
      color: 'hover:text-gray-900'
    },
    { 
      name: 'LinkedIn', 
      icon: <Linkedin className="w-5 h-5" />, 
      href: 'https://linkedin.com/in/yourusername',
      color: 'hover:text-blue-600'
    },
    { 
      name: 'Email', 
      icon: <Mail className="w-5 h-5" />, 
      href: 'mailto:youssef.mosbah@example.com',
      color: 'hover:text-purple-600'
    }
  ];

  return (
    <footer 
      id="footer"
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            
            {/* About Section */}
            <div
              className={`space-y-6 transition-all duration-1000 ${
                isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">YM</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Youssef Mosbah</h3>
                  <p className="text-gray-400 text-sm">Étudiant Ingénieur</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                Passionné par la technologie et l'innovation, je développe des solutions 
                créatives alliant développement web et sciences des données.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-gray-800 rounded-xl hover:bg-gray-700 hover:scale-110 hover:-translate-y-1 transition-all duration-300 ${social.color} active:scale-95`}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div
              className={`space-y-6 transition-all duration-1000 delay-100 ${
                isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="text-xl font-semibold text-white">Navigation</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <span className="w-1 h-1 bg-blue-600 rounded-full group-hover:w-2 transition-all duration-300"></span>
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* CV Download */}
              <a
                href="#"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-300 group"
              >
                <Download className="w-4 h-4 group-hover:animate-bounce" />
                <span>Télécharger CV</span>
              </a>
            </div>

            {/* Projects Highlights */}
            <div
              className={`space-y-6 transition-all duration-1000 delay-200 ${
                isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="text-xl font-semibold text-white">Projets Récents</h3>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="group cursor-pointer hover:translate-x-2 transition-transform duration-300">
                    <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors duration-300">
                      {project.name}
                    </h4>
                    <p className="text-gray-400 text-sm">{project.desc}</p>
                  </div>
                ))}
              </div>

              <a
                href="#projects"
                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 hover:translate-x-2 transition-all duration-300 group"
              >
                <span>Voir tous les projets</span>
                <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </a>
            </div>

            {/* Contact Info */}
            <div
              className={`space-y-6 transition-all duration-1000 delay-300 ${
                isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="text-xl font-semibold text-white">Contact</h3>
              <div className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.link}
                    className="flex items-center space-x-3 text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 group"
                  >
                    <div className="text-blue-400 group-hover:scale-110 transition-transform">
                      {contact.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{contact.label}</p>
                      <p>{contact.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Availability Status */}
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Disponible</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Ouvert aux opportunités de stage et de collaboration
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <span>&copy; {currentYear} Youssef Mosbah</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <span>Fait avec</span>
                  <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>et</span>
                  <Code className="w-4 h-4 text-blue-400" />
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Coffee className="w-4 h-4 text-yellow-600" />
                  <span>Beaucoup de café</span>
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Globe className="w-4 h-4" />
                  <span>Basé en France</span>
                </div>
                
                <button
                  onClick={scrollToTop}
                  className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
                  title="Retour en haut"
                >
                  <ArrowUp className="w-5 h-5 text-white group-hover:animate-bounce" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};