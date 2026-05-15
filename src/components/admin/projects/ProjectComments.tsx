import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type Comment = { id: string; body: string; author_id: string; created_at: string };

export function ProjectComments({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('project_comments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    setComments((data ?? []) as Comment[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [projectId]);

  const submit = async () => {
    if (!body.trim() || !user) return;
    setPosting(true);
    const { error } = await supabase.from('project_comments').insert({
      project_id: projectId, body: body.trim(), author_id: user.id,
    });
    setPosting(false);
    if (error) { toast.error(error.message); return; }
    setBody('');
    load();
  };

  return (
    <Card className="p-5 bg-[#111]/80 border-white/5 space-y-4">
      <div className="space-y-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Ajouter un commentaire interne…"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
        <div className="flex justify-end">
          <Button onClick={submit} disabled={posting || !body.trim()} className="bg-orange-500 hover:bg-orange-600 text-white">
            {posting ? 'Publication…' : 'Publier'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-orange-500" /></div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-white/40">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Aucun commentaire pour l'instant.</p>
        </div>
      ) : (
        <ul className="divide-y divide-white/5">
          {comments.map((c) => (
            <li key={c.id} className="py-3">
              <p className="text-sm text-white whitespace-pre-wrap">{c.body}</p>
              <p className="text-[10px] text-white/40 mt-1">
                {new Date(c.created_at).toLocaleString('fr-FR')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}