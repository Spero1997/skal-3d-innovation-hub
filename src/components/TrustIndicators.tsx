
import React from 'react';
import { CheckCircle, Award, Star, Users, Clock, ShieldCheck } from 'lucide-react';

const TrustIndicators: React.FC = () => {
  const trustStats = [
    {
      icon: <CheckCircle className="w-6 h-6 text-skal-orange" />,
      value: '99%',
      label: 'Satisfaction client',
    },
    {
      icon: <Award className="w-6 h-6 text-skal-orange" />,
      value: '15+',
      label: 'Années d\'expertise',
    },
    {
      icon: <Users className="w-6 h-6 text-skal-orange" />,
      value: '500+',
      label: 'Clients satisfaits',
    },
    {
      icon: <Clock className="w-6 h-6 text-skal-orange" />,
      value: '97%',
      label: 'Projets livrés à temps',
    },
  ];

  const testimonials = [
    {
      quote: "L'équipe de Skal Service a parfaitement compris nos besoins et a livré un travail de qualité exceptionnelle, bien au-delà de nos attentes.",
      author: "Marie Dupont",
      company: "DirecteurTechnique, EcoDev Solutions",
      rating: 5,
    },
    {
      quote: "Leur expertise en cartographie et leur conseil en IA nous ont permis d'optimiser considérablement nos processus. Un partenaire de confiance.",
      author: "Thomas Laurent",
      company: "Fondateur, UrbanMap Technologies",
      rating: 5,
    },
    {
      quote: "Un professionnalisme remarquable et une réactivité constante. Skal Service a transformé notre vision en réalité avec une précision impressionnante.",
      author: "Sophie Marchand",
      company: "Directrice Marketing, Innovatech",
      rating: 5,
    }
  ];

  const certifications = [
    {
      title: "ISO 9001:2015",
      description: "Certification internationale de système de management de la qualité"
    },
    {
      title: "Expert Géomètre Agréé",
      description: "Reconnaissance officielle des compétences en arpentage topographique"
    },
    {
      title: "Partenaire Microsoft AI",
      description: "Expertise certifiée en solutions d'intelligence artificielle"
    }
  ];

  return (
    <div className="py-12">
      <div className="mb-16">
        <h3 className="text-2xl font-semibold text-center mb-10 text-white">Pourquoi Nous Faire Confiance ?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustStats.map((stat, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg flex flex-col items-center"
              style={{ animation: `fadeIn 0.5s ease-out forwards`, animationDelay: `${0.1 * index}s` }}
            >
              {stat.icon}
              <span className="text-3xl font-bold mt-3 text-skal-black">{stat.value}</span>
              <span className="text-slate-600">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-16">
        <h3 className="text-2xl font-semibold text-center mb-10 text-white">Ce Que Nos Clients Disent</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg flex flex-col"
              style={{ animation: `fadeIn 0.5s ease-out forwards`, animationDelay: `${0.1 * index}s` }}
            >
              <div className="flex mb-4">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-skal-orange text-skal-orange" />
                ))}
              </div>
              <p className="italic text-slate-700 mb-4">"{testimonial.quote}"</p>
              <div className="mt-auto">
                <p className="font-semibold text-skal-black">{testimonial.author}</p>
                <p className="text-sm text-slate-600">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-semibold text-center mb-10 text-white">Nos Certifications et Garanties</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((certification, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg flex items-center"
              style={{ animation: `fadeIn 0.5s ease-out forwards`, animationDelay: `${0.1 * index}s` }}
            >
              <ShieldCheck className="w-10 h-10 text-skal-orange mr-4 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-skal-black">{certification.title}</h4>
                <p className="text-sm text-slate-600">{certification.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TrustIndicators;
