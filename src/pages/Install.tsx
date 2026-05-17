import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Smartphone, Share, Plus, Download, Check, Apple } from 'lucide-react';

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function detectOS(): 'ios' | 'android' | 'desktop' {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}

export default function Install() {
  const [bip, setBip] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [os, setOs] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    setOs(detectOS());
    const handler = (e: Event) => {
      e.preventDefault();
      setBip(e as BIPEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    // already standalone
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const triggerInstall = async () => {
    if (!bip) return;
    await bip.prompt();
    const { outcome } = await bip.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setBip(null);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-12 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        <header className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-500 mb-2">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Installer SKAL Services</h1>
          <p className="text-white/60">
            Ajoutez SKAL à votre écran d'accueil — accès en un tap, plein écran, comme une vraie application.
          </p>
        </header>

        {installed && (
          <Card className="bg-emerald-500/10 border-emerald-500/30 p-5 flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold">Application installée</p>
              <p className="text-sm text-white/60">Vous pouvez la lancer depuis l'écran d'accueil.</p>
            </div>
          </Card>
        )}

        {!installed && bip && (
          <Card className="bg-orange-500/10 border-orange-500/30 p-5">
            <p className="font-semibold mb-2">Installation directe disponible</p>
            <p className="text-sm text-white/60 mb-4">
              Votre navigateur peut installer SKAL en un clic.
            </p>
            <Button onClick={triggerInstall} className="bg-orange-500 hover:bg-orange-600">
              <Download className="w-4 h-4 mr-2" /> Installer maintenant
            </Button>
          </Card>
        )}

        {!installed && os === 'ios' && (
          <Card className="bg-white/5 border-white/10 p-5 space-y-3">
            <h2 className="flex items-center gap-2 font-semibold">
              <Apple className="w-4 h-4" /> Sur iPhone / iPad (Safari)
            </h2>
            <ol className="space-y-2 text-sm text-white/80 list-decimal list-inside">
              <li>Touchez l'icône <Share className="inline w-4 h-4 mx-1 -mt-0.5" /> <strong>Partager</strong> en bas de Safari.</li>
              <li>Faites défiler et choisissez <strong>« Sur l'écran d'accueil »</strong> <Plus className="inline w-4 h-4 mx-1 -mt-0.5" />.</li>
              <li>Validez avec <strong>Ajouter</strong>.</li>
            </ol>
          </Card>
        )}

        {!installed && os === 'android' && !bip && (
          <Card className="bg-white/5 border-white/10 p-5 space-y-3">
            <h2 className="font-semibold">Sur Android (Chrome / Edge)</h2>
            <ol className="space-y-2 text-sm text-white/80 list-decimal list-inside">
              <li>Touchez le menu <strong>⋮</strong> en haut à droite.</li>
              <li>Choisissez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</li>
              <li>Validez.</li>
            </ol>
          </Card>
        )}

        {!installed && os === 'desktop' && !bip && (
          <Card className="bg-white/5 border-white/10 p-5 space-y-3">
            <h2 className="font-semibold">Sur ordinateur</h2>
            <p className="text-sm text-white/70">
              Dans Chrome ou Edge, cliquez sur l'icône <Download className="inline w-4 h-4 mx-1 -mt-0.5" /> dans la barre d'adresse,
              ou ouvrez le menu et choisissez <strong>« Installer SKAL Services »</strong>.
            </p>
          </Card>
        )}

        <div className="grid grid-cols-3 gap-3 text-center text-xs text-white/50">
          <div className="p-3 rounded bg-white/5">⚡ Plus rapide</div>
          <div className="p-3 rounded bg-white/5">📱 Plein écran</div>
          <div className="p-3 rounded bg-white/5">🔔 Notifications</div>
        </div>
      </div>
    </div>
  );
}