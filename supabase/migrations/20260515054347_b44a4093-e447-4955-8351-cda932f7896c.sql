
CREATE TABLE public.devis_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  budget TEXT,
  message TEXT NOT NULL,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.devis_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a devis request"
ON public.devis_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can view devis requests"
ON public.devis_requests FOR SELECT
TO authenticated
USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('devis-files', 'devis-files', false);

CREATE POLICY "Anyone can upload devis files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'devis-files');

CREATE POLICY "Authenticated users can view devis files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'devis-files');
