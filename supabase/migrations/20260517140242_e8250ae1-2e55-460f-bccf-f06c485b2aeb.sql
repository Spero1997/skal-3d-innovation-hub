
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  agent_slug text NOT NULL,
  entity text NOT NULL DEFAULT 'general',
  title text NOT NULL DEFAULT 'Nouvelle conversation',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own convs select" ON public.ai_conversations FOR SELECT
  USING (auth.uid() = user_id OR public.is_direction(auth.uid()));
CREATE POLICY "own convs insert" ON public.ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own convs update" ON public.ai_conversations FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "own convs delete" ON public.ai_conversations FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'::public.app_role));
CREATE TRIGGER trg_ai_conv_updated BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_ai_conv_user ON public.ai_conversations(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  granted_level public.confidentiality_level,
  model text,
  duration_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "msgs select via conv" ON public.ai_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.ai_conversations c
    WHERE c.id = conversation_id
      AND (c.user_id = auth.uid() OR public.is_direction(auth.uid()))));
CREATE POLICY "msgs insert via conv" ON public.ai_messages FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.ai_conversations c
    WHERE c.id = conversation_id AND c.user_id = auth.uid()));
CREATE INDEX IF NOT EXISTS idx_ai_msgs_conv ON public.ai_messages(conversation_id, created_at);

INSERT INTO public.ai_agents (slug, name, description, model, max_level, system_prompt, is_active)
VALUES
  ('skal-assistant','Assistant SKAL','Assistant général pour les équipes SKAL.',
   'google/gemini-3-flash-preview','internal',
   'Tu es l''assistant interne de SKAL Services. Réponds en français, sois concis et professionnel. Aide sur la gestion de projets, la rédaction et la productivité. Ne révèle jamais de données financières internes (capital, parts, répartitions).',
   true),
  ('devis-writer','Rédacteur de devis','Aide à rédiger des propositions commerciales claires.',
   'google/gemini-3-flash-preview','internal',
   'Tu rédiges des propositions commerciales pour SKAL Services SARL (Bénin). Toujours : conditions de paiement « 40% à la commande, 60% à la livraison », ton professionnel, structure claire (contexte, objectifs, livrables, planning, prix HT/TTC TVA 18%). Demande les infos manquantes si besoin.',
   true),
  ('project-analyst','Analyste projet','Analyse les projets et propose des actions.',
   'google/gemini-2.5-flash','restricted',
   'Tu analyses les données projets SKAL fournies dans le prompt (statut, échéances, budgets). Donne des constats factuels, identifie les risques et propose 3 actions concrètes priorisées. Ne déduis pas la répartition financière interne.',
   true),
  ('content-writer','Rédacteur contenu','Rédige posts, articles, descriptions services.',
   'google/gemini-3-flash-preview','internal',
   'Tu rédiges du contenu pour SKAL Services (réseaux sociaux, site, articles). Ton : moderne, africain, professionnel. Positionnement : guichet unique multidisciplinaire (Architecture & BTP, Géomatique/SIG, Graphisme & IA, Web & Digital), Bénin → Afrique de l''Ouest. Inclus un appel à l''action quand pertinent.',
   true)
ON CONFLICT (slug) DO NOTHING;
