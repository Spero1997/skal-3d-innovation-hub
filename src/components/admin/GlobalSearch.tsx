import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList,
} from '@/components/ui/command';
import { FolderKanban, UsersRound, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

type Hit = { id: string; label: string; sub?: string; href: string; kind: 'project'|'client'|'invoice' };

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!q.trim()) { setHits([]); return; }
    let cancel = false;
    (async () => {
      const [p, c, i] = await Promise.all([
        supabase.from('projects').select('id,name,code').ilike('name', `%${q}%`).limit(5),
        supabase.from('clients').select('id,name,company').ilike('name', `%${q}%`).limit(5),
        (supabase as any).from('invoices').select('id,number,amount_ttc').ilike('number', `%${q}%`).limit(5),
      ]);
      if (cancel) return;
      const out: Hit[] = [];
      (p.data ?? []).forEach((x: any) => out.push({ id: x.id, label: x.name, sub: x.code, href: `/admin/projets/${x.id}`, kind: 'project' }));
      (c.data ?? []).forEach((x: any) => out.push({ id: x.id, label: x.name, sub: x.company, href: `/admin/clients`, kind: 'client' }));
      (i.data ?? []).forEach((x: any) => out.push({ id: x.id, label: x.number, sub: String(x.amount_ttc), href: `/admin/factures`, kind: 'invoice' }));
      setHits(out);
    })();
    return () => { cancel = true; };
  }, [q]);

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 h-9 px-3 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 w-full max-w-md justify-start">
        <Search className="w-4 h-4" />
        <span className="text-sm">Rechercher…</span>
        <kbd className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Projet, client, facture…" value={q} onValueChange={setQ} />
        <CommandList>
          <CommandEmpty>Aucun résultat</CommandEmpty>
          {hits.length > 0 && (
            <CommandGroup heading="Résultats">
              {hits.map(h => (
                <CommandItem key={h.kind+h.id} onSelect={() => { setOpen(false); navigate(h.href); }}>
                  {h.kind === 'project' && <FolderKanban className="w-4 h-4 mr-2 text-orange-400" />}
                  {h.kind === 'client' && <UsersRound className="w-4 h-4 mr-2 text-purple-400" />}
                  {h.kind === 'invoice' && <Receipt className="w-4 h-4 mr-2 text-emerald-400" />}
                  <span>{h.label}</span>
                  {h.sub && <span className="ml-2 text-xs text-muted-foreground">{h.sub}</span>}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
