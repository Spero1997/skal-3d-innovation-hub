import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator,
} from '@/components/ui/command';
import {
  FolderKanban, UsersRound, Receipt, Bell, Wallet, Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatXOF, formatDate } from '@/lib/projects';

type Kind = 'project' | 'client' | 'invoice' | 'notification' | 'dividende';
type Hit = { id: string; label: string; sub?: string; href: string; kind: Kind };

const FILTERS: { key: Kind | 'all'; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'project', label: 'Projets' },
  { key: 'client', label: 'Clients' },
  { key: 'invoice', label: 'Factures' },
  { key: 'notification', label: 'Notifications' },
  { key: 'dividende', label: 'Dividendes' },
];

const KIND_META: Record<Kind, { heading: string; icon: any; color: string }> = {
  project:      { heading: 'Projets',       icon: FolderKanban, color: 'text-orange-400' },
  client:       { heading: 'Clients',       icon: UsersRound,   color: 'text-purple-400' },
  invoice:      { heading: 'Factures',      icon: Receipt,      color: 'text-emerald-400' },
  notification: { heading: 'Notifications', icon: Bell,         color: 'text-blue-400' },
  dividende:    { heading: 'Dividendes',    icon: Wallet,       color: 'text-amber-400' },
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [filter, setFilter] = useState<Kind | 'all'>('all');
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
    const term = `%${q}%`;
    (async () => {
      const want = (k: Kind) => filter === 'all' || filter === k;
      const [p, c, i, n, d] = await Promise.all([
        want('project')
          ? supabase.from('projects').select('id,name,code').or(`name.ilike.${term},code.ilike.${term}`).limit(5)
          : Promise.resolve({ data: [] as any[] }),
        want('client')
          ? supabase.from('clients').select('id,name,company').or(`name.ilike.${term},company.ilike.${term}`).limit(5)
          : Promise.resolve({ data: [] as any[] }),
        want('invoice')
          ? (supabase as any).from('invoices').select('id,number,amount_ttc,status,clients(name)').or(`number.ilike.${term}`).limit(5)
          : Promise.resolve({ data: [] as any[] }),
        want('notification')
          ? (supabase as any).from('notifications').select('id,title,body,link,created_at').or(`title.ilike.${term},body.ilike.${term}`).order('created_at',{ascending:false}).limit(5)
          : Promise.resolve({ data: [] as any[] }),
        want('dividende')
          ? (supabase as any).from('payouts').select('id,description,amount,payout_date,beneficiary_role').or(`description.ilike.${term},beneficiary_role.ilike.${term}`).limit(5)
          : Promise.resolve({ data: [] as any[] }),
      ]);
      if (cancel) return;
      const out: Hit[] = [];
      (p.data ?? []).forEach((x: any) => out.push({ id: x.id, label: x.name, sub: x.code, href: `/admin/projets/${x.id}`, kind: 'project' }));
      (c.data ?? []).forEach((x: any) => out.push({ id: x.id, label: x.name, sub: x.company, href: `/admin/clients`, kind: 'client' }));
      (i.data ?? []).forEach((x: any) => out.push({
        id: x.id, label: x.number,
        sub: `${x.clients?.name ?? '—'} · ${formatXOF(Number(x.amount_ttc ?? 0))}`,
        href: `/admin/factures/${x.id}`, kind: 'invoice',
      }));
      (n.data ?? []).forEach((x: any) => out.push({
        id: x.id, label: x.title,
        sub: x.body ? x.body.slice(0, 60) : formatDate(x.created_at),
        href: x.link ?? '/admin', kind: 'notification',
      }));
      (d.data ?? []).forEach((x: any) => out.push({
        id: x.id, label: x.description ?? `Versement ${x.beneficiary_role}`,
        sub: `${formatXOF(Number(x.amount))} · ${formatDate(x.payout_date)}`,
        href: `/admin/dividendes`, kind: 'dividende',
      }));
      setHits(out);
    })();
    return () => { cancel = true; };
  }, [q, filter]);

  const grouped = useMemo(() => {
    const m = new Map<Kind, Hit[]>();
    hits.forEach(h => { if (!m.has(h.kind)) m.set(h.kind, []); m.get(h.kind)!.push(h); });
    return m;
  }, [hits]);

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 h-9 px-3 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 w-full max-w-md justify-start">
        <Search className="w-4 h-4" />
        <span className="text-sm">Rechercher…</span>
        <kbd className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Projet, client, facture, notification, dividende…" value={q} onValueChange={setQ} />
        <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-border">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-[11px] px-2 py-1 rounded-md transition-colors ${
                filter === f.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <CommandList>
          <CommandEmpty>Aucun résultat</CommandEmpty>
          {Array.from(grouped.entries()).map(([kind, items], idx) => {
            const meta = KIND_META[kind];
            const Icon = meta.icon;
            return (
              <div key={kind}>
                {idx > 0 && <CommandSeparator />}
                <CommandGroup heading={meta.heading}>
                  {items.map(h => (
                    <CommandItem
                      key={h.kind + h.id}
                      value={`${h.kind}-${h.label}-${h.sub ?? ''}-${h.id}`}
                      onSelect={() => { setOpen(false); navigate(h.href); }}
                    >
                      <Icon className={`w-4 h-4 mr-2 ${meta.color}`} />
                      <span className="truncate">{h.label}</span>
                      {h.sub && <span className="ml-2 text-xs text-muted-foreground truncate">{h.sub}</span>}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
