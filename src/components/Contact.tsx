
import React, { useRef, useEffect } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be replaced with actual form submission logic
    alert("Merci pour votre message ! Nous vous contacterons bientôt.");
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <section id="contact" className="section-padding bg-skal-gray relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent h-32" />
      
      <div className="container mx-auto">
        <div 
          ref={sectionRef}
          className="text-center mb-16 opacity-0"
        >
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-skal-orange/10">
            <span className="text-skal-orange text-sm font-medium">Contact</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-skal-black">
            Parlons de Votre Projet
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Prêt à démarrer votre prochain projet avec nous ? Contactez-nous dès aujourd'hui et découvrez comment notre expertise peut vous aider.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-skal-orange/10 text-skal-orange">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-skal-black">Téléphone</h3>
                  <p className="text-gray-600">+33 1 23 45 67 89</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-skal-orange/10 text-skal-orange">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-skal-black">Email</h3>
                  <p className="text-gray-600">contact@skalservice.com</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-skal-orange/10 text-skal-orange">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-skal-black">Adresse</h3>
                  <p className="text-gray-600">123 Avenue de l'Innovation<br />75001 Paris, France</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <form ref={formRef} onSubmit={handleSubmit} className="glass-card rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-skal-orange focus:border-skal-orange"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-skal-orange focus:border-skal-orange"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-skal-orange focus:border-skal-orange"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-skal-orange focus:border-skal-orange"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-skal-orange text-white font-medium rounded-md hover:bg-opacity-90 transition-colors"
              >
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
