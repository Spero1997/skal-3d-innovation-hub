import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

type Notif = {
  id: string; type: string; title: string; body: string | null;
  link: string | null; read_at: string | null; created_at: string;
};

export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    if (!user) return;
    const { data } = await (supabase as any)
      .from('notifications')
      .select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(20);
    setItems(data ?? []);
  };

  useEffect(() => {
    if (!user) return;
    load();
    const ch = (supabase as any)
      .channel('notif-' + user.id)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => load())
      .subscribe();
    return () => { (supabase as any).removeChannel(ch); };
  }, [user]);

  const unread = items.filter(i => !i.read_at).length;

  const markAll = async () => {
    if (!user) return;
    await (supabase as any).from('notifications').update({ read_at: new Date().toISOString() })
      .eq('user_id', user.id).is('read_at', null);
    load();
  };

  const click = async (n: Notif) => {
    if (!n.read_at) {
      await (supabase as any).from('notifications').update({ read_at: new Date().toISOString() }).eq('id', n.id);
    }
    setOpen(false);
    if (n.link) navigate(n.link);
    load();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/5 relative">
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 text-[10px] font-bold flex items-center justify-center text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-[#111] border-white/10 text-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && (
            <button onClick={markAll} className="text-xs text-orange-400 hover:underline flex items-center gap-1">
              <CheckCheck className="w-3 h-3" /> Tout marquer lu
            </button>
          )}
        </div>
        <ScrollArea className="max-h-96">
          {items.length === 0 ? (
            <p className="text-center text-xs text-white/40 py-8">Aucune notification</p>
          ) : items.map(n => (
            <button key={n.id} onClick={() => click(n)}
              className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read_at ? 'bg-orange-500/5' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium truncate">{n.title}</p>
                {!n.read_at && <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />}
              </div>
              {n.body && <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{n.body}</p>}
              <p className="text-[10px] text-white/30 mt-1">
                {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: fr })}
              </p>
            </button>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
