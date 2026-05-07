
import React, { useRef } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be replaced with actual form submission logic
    alert("Merci pour votre message ! Nous vous contacterons bientôt.");
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <section id="contact" className="section-padding relative">

      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-[hsl(var(--optimind-glow)/0.1)]">
            <span className="text-[hsl(var(--optimind-glow))] text-sm font-medium">Contact</span>
          </div>
          <h2 className="text-3xl md:text-4xl optimind-heading mb-4 text-foreground">
            PARLONS DE VOTRE PROJET
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Prêt à démarrer votre prochain projet avec nous ? Contactez-nous dès aujourd'hui et découvrez comment notre expertise peut vous aider.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="optimind-service-card rounded-2xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[hsl(var(--optimind-glow)/0.1)] text-[hsl(var(--optimind-glow))]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Téléphone</h3>
                  <p className="text-muted-foreground text-sm">+229 01 90315546</p>
                </div>
              </div>
            </div>
            
            <div className="optimind-service-card rounded-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[hsl(var(--optimind-glow)/0.1)] text-[hsl(var(--optimind-glow))]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Email</h3>
                  <p className="text-muted-foreground text-sm">skalservice.0@gmail.com</p>
                </div>
              </div>
            </div>
            
            <div className="optimind-service-card rounded-2xl animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[hsl(var(--optimind-glow)/0.1)] text-[hsl(var(--optimind-glow))]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Adresse</h3>
                  <p className="text-muted-foreground text-sm">Abomey-Calavi, Tokan, de l'EPP Tokan</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <form ref={formRef} onSubmit={handleSubmit} className="optimind-service-card rounded-2xl p-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2.5 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--secondary))] text-foreground text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2.5 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--secondary))] text-foreground text-sm"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-2.5 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--secondary))] text-foreground text-sm"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-2.5 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--secondary))] text-foreground text-sm"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[hsl(var(--optimind-glow))] text-white font-medium rounded-full hover:brightness-110 transition-all text-sm uppercase tracking-wider shadow-[0_0_20px_hsl(var(--optimind-glow)/0.3)]"
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
