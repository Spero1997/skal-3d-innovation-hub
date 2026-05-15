
import React from 'react';
import { CheckCircle, Award, Star, Users, Clock, ShieldCheck } from 'lucide-react';

const TrustIndicators: React.FC = () => {
  const trustStats = [
    { icon: <CheckCircle className="w-6 h-6 text-[hsl(var(--optimind-glow))]" />, value: '100%', label: 'Satisfaction client' },
    { icon: <Award className="w-6 h-6 text-[hsl(var(--optimind-glow))]" />, value: '15+', label: "Années d'expertise" },
    { icon: <Users className="w-6 h-6 text-[hsl(var(--optimind-glow))]" />, value: '50+', label: 'Clients satisfaits' },
    { icon: <Clock className="w-6 h-6 text-[hsl(var(--optimind-glow))]" />, value: '100%', label: 'Projets livrés à temps' },
  ];

  const testimonials = [
    { quote: "L'équipe de Skal Services a parfaitement compris nos besoins et a livré un travail de qualité exceptionnelle, bien au-delà de nos attentes.", author: "ACAKPO Charnel", company: "Chargé de la communication, La Ruche d'Or", rating: 5 },
    { quote: "Leur expertise en cartographie et leur conseil en IA nous ont permis d'optimiser considérablement nos processus. Un partenaire de confiance.", author: "TCHESSI JUNIOR", company: "Logisticien", rating: 5 },
    { quote: "Un professionnalisme remarquable et une réactivité constante. Skal Services a transformé notre vision en réalité avec une précision impressionnante.", author: "DANNON Imelda", company: "Directrice Générale, MEL SHOP", rating: 5 },
    { quote: "Service exceptionnel et résultats à la hauteur de nos attentes. Je recommande vivement leur expertise pour tous vos projets.", author: "GUENDEHOU Côme", company: "Directeur, TECOMAV-ALU", rating: 5 },
  ];

  return (
    <div className="py-12">
      <div className="mb-16">
        <h3 className="text-2xl optimind-heading text-center mb-10 text-foreground">UNE ENTREPRISE EN RÈGLE</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: 'Forme juridique', value: 'SARL' },
            { label: 'RCCM', value: 'RB/ABC/21 A 26495' },
            { label: 'IFU', value: '0202112334177' },
            { label: 'Agréments', value: 'DGT · DGC · AL' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[hsl(var(--optimind-card))] border border-[hsl(var(--border))] flex flex-col items-center text-center">
              <ShieldCheck className="w-5 h-5 text-[hsl(var(--optimind-glow))] mb-2" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</span>
              <span className="text-sm font-semibold text-foreground mt-1 break-all">{item.value}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          SKAL SERVICES SARL — société immatriculée au Bénin, intervenant sur toute l'Afrique de l'Ouest.
        </p>
      </div>

      <div className="mb-16">
        <h3 className="text-2xl optimind-heading text-center mb-10 text-foreground">POURQUOI NOUS FAIRE CONFIANCE ?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustStats.map((stat, index) => (
            <div key={index} className="p-6 rounded-2xl bg-[hsl(var(--optimind-card))] border border-[hsl(var(--border))] flex flex-col items-center transition-all duration-300 hover:shadow-lg" style={{ animation: `fadeIn 0.5s ease-out forwards`, animationDelay: `${0.1 * index}s` }}>
              {stat.icon}
              <span className="text-3xl font-bold mt-3 text-foreground">{stat.value}</span>
              <span className="text-muted-foreground text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-16">
        <h3 className="text-2xl optimind-heading text-center mb-10 text-foreground">CE QUE NOS CLIENTS DISENT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 rounded-2xl bg-[hsl(var(--optimind-card))] border border-[hsl(var(--border))] flex flex-col transition-all duration-300 hover:shadow-lg" style={{ animation: `fadeIn 0.5s ease-out forwards`, animationDelay: `${0.1 * index}s` }}>
              <div className="flex mb-4">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[hsl(var(--optimind-glow))] text-[hsl(var(--optimind-glow))]" />
                ))}
              </div>
              <p className="italic text-muted-foreground mb-4 text-sm">"{testimonial.quote}"</p>
              <div className="mt-auto">
                <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;
