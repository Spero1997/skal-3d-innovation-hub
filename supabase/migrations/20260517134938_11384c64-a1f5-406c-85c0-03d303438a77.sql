
-- Document kinds
DO $$ BEGIN
  CREATE TYPE public.document_kind AS ENUM ('contrat','facture','devis','rapport','plan','photo','autre');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- documents (logical)
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  name text NOT NULL,
  kind public.document_kind NOT NULL DEFAULT 'autre',
  current_version int NOT NULL DEFAULT 1,
  description text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_documents_project ON public.documents(project_id);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direction manage documents" ON public.documents
  FOR ALL TO authenticated
  USING (public.is_direction(auth.uid()))
  WITH CHECK (public.is_direction(auth.uid()));

CREATE POLICY "manager manage project documents" ON public.documents
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = documents.project_id AND p.manager_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = documents.project_id AND p.manager_id = auth.uid()));

CREATE POLICY "members view documents" ON public.documents
  FOR SELECT TO authenticated
  USING (public.can_access_project(auth.uid(), project_id));

CREATE TRIGGER documents_updated BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- document_versions
CREATE TABLE public.document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version int NOT NULL,
  storage_path text NOT NULL,
  original_name text NOT NULL,
  mime_type text,
  size_bytes bigint,
  notes text,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(document_id, version)
);
CREATE INDEX idx_doc_versions_doc ON public.document_versions(document_id);
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direction manage versions" ON public.document_versions
  FOR ALL TO authenticated
  USING (public.is_direction(auth.uid()))
  WITH CHECK (public.is_direction(auth.uid()));

CREATE POLICY "manager manage project versions" ON public.document_versions
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.documents d JOIN public.projects p ON p.id = d.project_id
    WHERE d.id = document_versions.document_id AND p.manager_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.documents d JOIN public.projects p ON p.id = d.project_id
    WHERE d.id = document_versions.document_id AND p.manager_id = auth.uid()
  ));

CREATE POLICY "members view versions" ON public.document_versions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.documents d
    WHERE d.id = document_versions.document_id
      AND public.can_access_project(auth.uid(), d.project_id)
  ));

-- document_signatures
CREATE TABLE public.document_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version int NOT NULL,
  signer_name text NOT NULL,
  signer_email text,
  signer_role text,
  signature_data text NOT NULL,
  signed_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  signed_by uuid
);
CREATE INDEX idx_signatures_doc ON public.document_signatures(document_id);
ALTER TABLE public.document_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direction view signatures" ON public.document_signatures
  FOR SELECT TO authenticated USING (public.is_direction(auth.uid()));
CREATE POLICY "manager view project signatures" ON public.document_signatures
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.documents d JOIN public.projects p ON p.id = d.project_id
    WHERE d.id = document_signatures.document_id AND p.manager_id = auth.uid()
  ));
CREATE POLICY "members insert signatures" ON public.document_signatures
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.documents d
    WHERE d.id = document_signatures.document_id
      AND public.can_access_project(auth.uid(), d.project_id)
  ));

-- document_shares
CREATE TABLE public.document_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version int,
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  expires_at timestamptz,
  max_downloads int,
  download_count int NOT NULL DEFAULT 0,
  password_hash text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  label text
);
CREATE INDEX idx_shares_token ON public.document_shares(token);
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direction manage shares" ON public.document_shares
  FOR ALL TO authenticated
  USING (public.is_direction(auth.uid()))
  WITH CHECK (public.is_direction(auth.uid()));
CREATE POLICY "manager manage project shares" ON public.document_shares
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.documents d JOIN public.projects p ON p.id = d.project_id
    WHERE d.id = document_shares.document_id AND p.manager_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.documents d JOIN public.projects p ON p.id = d.project_id
    WHERE d.id = document_shares.document_id AND p.manager_id = auth.uid()
  ));

-- document_extractions
CREATE TABLE public.document_extractions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version int NOT NULL,
  kind text NOT NULL DEFAULT 'generic',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  summary text,
  model text,
  confidence int,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_extractions_doc ON public.document_extractions(document_id);
ALTER TABLE public.document_extractions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direction view extractions" ON public.document_extractions
  FOR SELECT TO authenticated USING (public.is_direction(auth.uid()));
CREATE POLICY "manager view project extractions" ON public.document_extractions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.documents d JOIN public.projects p ON p.id = d.project_id
    WHERE d.id = document_extractions.document_id AND p.manager_id = auth.uid()
  ));
CREATE POLICY "members insert extractions" ON public.document_extractions
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.documents d
    WHERE d.id = document_extractions.document_id
      AND public.can_access_project(auth.uid(), d.project_id)
  ));

-- Storage policies for project-files: managers and members of the project can read/upload
DO $$ BEGIN
  CREATE POLICY "project members read project-files"
    ON storage.objects FOR SELECT TO authenticated
    USING (
      bucket_id = 'project-files'
      AND EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id::text = (storage.foldername(name))[1]
          AND public.can_access_project(auth.uid(), p.id)
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "project members upload project-files"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
      bucket_id = 'project-files'
      AND EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id::text = (storage.foldername(name))[1]
          AND (public.is_direction(auth.uid()) OR p.manager_id = auth.uid())
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "project managers delete project-files"
    ON storage.objects FOR DELETE TO authenticated
    USING (
      bucket_id = 'project-files'
      AND EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id::text = (storage.foldername(name))[1]
          AND (public.is_direction(auth.uid()) OR p.manager_id = auth.uid())
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
