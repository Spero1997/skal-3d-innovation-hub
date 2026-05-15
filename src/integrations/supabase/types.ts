export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cash_movements: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          direction: Database["public"]["Enums"]["cash_direction"]
          id: string
          label: string
          movement_date: string
          source_transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          direction: Database["public"]["Enums"]["cash_direction"]
          id?: string
          label: string
          movement_date?: string
          source_transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          direction?: Database["public"]["Enums"]["cash_direction"]
          id?: string
          label?: string
          movement_date?: string
          source_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_movements_source_transaction_id_fkey"
            columns: ["source_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          company: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      devis_requests: {
        Row: {
          budget: string | null
          company: string | null
          created_at: string
          email: string
          file_path: string | null
          id: string
          message: string
          name: string
          phone: string | null
          service: string
        }
        Insert: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email: string
          file_path?: string | null
          id?: string
          message: string
          name: string
          phone?: string | null
          service: string
        }
        Update: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string
          file_path?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
          service?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_activity: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          project_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_activity_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          project_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          project_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          amount_collected: number | null
          amount_invoiced: number | null
          budget: number | null
          client_id: string | null
          code: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          domain: Database["public"]["Enums"]["project_domain"]
          due_date: string | null
          id: string
          manager_id: string | null
          name: string
          priority: Database["public"]["Enums"]["project_priority"]
          progress: number
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          amount_collected?: number | null
          amount_invoiced?: number | null
          budget?: number | null
          client_id?: string | null
          code?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          domain?: Database["public"]["Enums"]["project_domain"]
          due_date?: string | null
          id?: string
          manager_id?: string | null
          name: string
          priority?: Database["public"]["Enums"]["project_priority"]
          progress?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          amount_collected?: number | null
          amount_invoiced?: number | null
          budget?: number | null
          client_id?: string | null
          code?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          domain?: Database["public"]["Enums"]["project_domain"]
          due_date?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          priority?: Database["public"]["Enums"]["project_priority"]
          progress?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_distributions: {
        Row: {
          associe_id: string | null
          associe_share: number
          caisse_share: number
          case_used: Database["public"]["Enums"]["distribution_case"]
          created_at: string
          gross_amount: number
          id: string
          net_after_caisse_and_prestataire: number
          prestataire_name: string | null
          prestataire_share: number
          project_id: string | null
          spero_share: number
          transaction_id: string
        }
        Insert: {
          associe_id?: string | null
          associe_share?: number
          caisse_share?: number
          case_used: Database["public"]["Enums"]["distribution_case"]
          created_at?: string
          gross_amount: number
          id?: string
          net_after_caisse_and_prestataire?: number
          prestataire_name?: string | null
          prestataire_share?: number
          project_id?: string | null
          spero_share?: number
          transaction_id: string
        }
        Update: {
          associe_id?: string | null
          associe_share?: number
          caisse_share?: number
          case_used?: Database["public"]["Enums"]["distribution_case"]
          created_at?: string
          gross_amount?: number
          id?: string
          net_after_caisse_and_prestataire?: number
          prestataire_name?: string | null
          prestataire_share?: number
          project_id?: string | null
          spero_share?: number
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_distributions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_distributions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: true
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          position: number
          priority: Database["public"]["Enums"]["project_priority"]
          project_id: string
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          position?: number
          priority?: Database["public"]["Enums"]["project_priority"]
          project_id: string
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          position?: number
          priority?: Database["public"]["Enums"]["project_priority"]
          project_id?: string
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          associe_id: string | null
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          distribution_case:
            | Database["public"]["Enums"]["distribution_case"]
            | null
          id: string
          notes: string | null
          prestataire_cost: number | null
          prestataire_name: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          associe_id?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          distribution_case?:
            | Database["public"]["Enums"]["distribution_case"]
            | null
          id?: string
          notes?: string | null
          prestataire_cost?: number | null
          prestataire_name?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_date?: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          associe_id?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          distribution_case?:
            | Database["public"]["Enums"]["distribution_case"]
            | null
          id?: string
          notes?: string | null
          prestataire_cost?: number | null
          prestataire_name?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      finance_summary: {
        Row: {
          caisse_balance: number | null
          total_associes: number | null
          total_expense: number | null
          total_prestataires: number | null
          total_revenue: number | null
          total_spero: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_access_project: {
        Args: { _project_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: { Args: { _user_id: string }; Returns: boolean }
      is_direction: { Args: { _user_id: string }; Returns: boolean }
      is_internal_user: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "associe"
        | "comptable"
        | "chef_projet"
        | "prestataire"
      cash_direction: "entree" | "sortie"
      distribution_case: "cas1_interne" | "cas2_forfait" | "cas3_au_cout"
      project_domain:
        | "architecture_btp"
        | "geomatique_sig"
        | "graphisme_ia"
        | "web_digital"
        | "autre"
      project_priority: "basse" | "normale" | "haute" | "urgente"
      project_status: "prospect" | "en_cours" | "en_pause" | "livre" | "annule"
      task_status: "a_faire" | "en_cours" | "en_revue" | "termine"
      transaction_status: "prevue" | "encaissee" | "annulee"
      transaction_type: "revenu" | "depense"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "associe",
        "comptable",
        "chef_projet",
        "prestataire",
      ],
      cash_direction: ["entree", "sortie"],
      distribution_case: ["cas1_interne", "cas2_forfait", "cas3_au_cout"],
      project_domain: [
        "architecture_btp",
        "geomatique_sig",
        "graphisme_ia",
        "web_digital",
        "autre",
      ],
      project_priority: ["basse", "normale", "haute", "urgente"],
      project_status: ["prospect", "en_cours", "en_pause", "livre", "annule"],
      task_status: ["a_faire", "en_cours", "en_revue", "termine"],
      transaction_status: ["prevue", "encaissee", "annulee"],
      transaction_type: ["revenu", "depense"],
    },
  },
} as const
