
import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      // Simuler l'envoi du message
      toast({
        title: "Message envoyé",
        description: "Un expert vous répondra dans les plus brefs délais.",
      });
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <Card className="w-80 sm:w-96 shadow-2xl animate-fade-in bg-white border-white/20 backdrop-blur-sm">
          <CardHeader className="bg-skal-orange text-white p-4 flex flex-row justify-between items-center rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-semibold">Besoin d'un conseil?</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-skal-orange/80 h-8 w-8"
              onClick={toggleChat}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 max-h-64 overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                <p className="text-sm">Bonjour! Comment puis-je vous aider aujourd'hui?</p>
              </div>
              <div className="bg-skal-orange/10 p-3 rounded-lg rounded-tr-none ml-auto max-w-[80%]">
                <p className="text-sm">Je souhaiterais discuter avec un expert en IA.</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                <p className="text-sm">Parfait! Merci de m'indiquer votre besoin spécifique, et je vous mettrai en relation avec l'expert approprié.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <form onSubmit={handleSubmit} className="w-full flex gap-2">
              <Textarea 
                placeholder="Écrivez votre message..." 
                className="resize-none flex-1 h-10 py-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button 
                type="submit" 
                className="bg-skal-orange hover:bg-skal-orange/90 text-white"
              >
                Envoyer
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          onClick={toggleChat} 
          className="rounded-full w-14 h-14 bg-skal-orange hover:bg-skal-orange/90 shadow-lg flex items-center justify-center animate-bounce"
        >
          <MessageSquare className="text-white h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default Chatbot;
