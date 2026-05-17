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
      ai_data_access: {
        Row: {
          created_at: string
          entity: string
          id: string
          max_level: Database["public"]["Enums"]["confidentiality_level"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          entity: string
          id?: string
          max_level?: Database["public"]["Enums"]["confidentiality_level"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          entity?: string
          id?: string
          max_level?: Database["public"]["Enums"]["confidentiality_level"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      apporteurs_affaires: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          default_commission_rate: number
          id: string
          is_active: boolean
          name: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          default_commission_rate?: number
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          default_commission_rate?: number
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
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
      commissions: {
        Row: {
          amount: number
          beneficiary_apporteur_id: string | null
          beneficiary_label: string | null
          beneficiary_prestataire_id: string | null
          beneficiary_type: Database["public"]["Enums"]["beneficiary_type"]
          beneficiary_user_id: string | null
          created_at: string
          distribution_id: string | null
          id: string
          paid_at: string | null
          status: Database["public"]["Enums"]["commission_status"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          beneficiary_apporteur_id?: string | null
          beneficiary_label?: string | null
          beneficiary_prestataire_id?: string | null
          beneficiary_type: Database["public"]["Enums"]["beneficiary_type"]
          beneficiary_user_id?: string | null
          created_at?: string
          distribution_id?: string | null
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["commission_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          beneficiary_apporteur_id?: string | null
          beneficiary_label?: string | null
          beneficiary_prestataire_id?: string | null
          beneficiary_type?: Database["public"]["Enums"]["beneficiary_type"]
          beneficiary_user_id?: string | null
          created_at?: string
          distribution_id?: string | null
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["commission_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_beneficiary_apporteur_id_fkey"
            columns: ["beneficiary_apporteur_id"]
            isOneToOne: false
            referencedRelation: "apporteurs_affaires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_beneficiary_prestataire_id_fkey"
            columns: ["beneficiary_prestataire_id"]
            isOneToOne: false
            referencedRelation: "prestataires"
            referencedColumns: ["id"]
          },
        ]
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
      finance_rule_sets: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          effective_from: string | null
          effective_to: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      finance_rules: {
        Row: {
          allocations: Json
          condition: Json
          created_at: string
          id: string
          name: string
          notes: string | null
          priority: number
          requires_validation: boolean
          rule_set_id: string
          updated_at: string
        }
        Insert: {
          allocations?: Json
          condition?: Json
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          priority?: number
          requires_validation?: boolean
          rule_set_id: string
          updated_at?: string
        }
        Update: {
          allocations?: Json
          condition?: Json
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          priority?: number
          requires_validation?: boolean
          rule_set_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_rules_rule_set_id_fkey"
            columns: ["rule_set_id"]
            isOneToOne: false
            referencedRelation: "finance_rule_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_scenarios: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          params: Json
          result: Json | null
          rule_set_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          params?: Json
          result?: Json | null
          rule_set_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          params?: Json
          result?: Json | null
          rule_set_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_scenarios_rule_set_id_fkey"
            columns: ["rule_set_id"]
            isOneToOne: false
            referencedRelation: "finance_rule_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_validations: {
        Row: {
          comment: string | null
          context: Json | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          requested_by: string | null
          status: Database["public"]["Enums"]["validation_status"]
          validated_at: string | null
          validator_id: string | null
        }
        Insert: {
          comment?: string | null
          context?: Json | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          requested_by?: string | null
          status?: Database["public"]["Enums"]["validation_status"]
          validated_at?: string | null
          validator_id?: string | null
        }
        Update: {
          comment?: string | null
          context?: Json | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          requested_by?: string | null
          status?: Database["public"]["Enums"]["validation_status"]
          validated_at?: string | null
          validator_id?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_ht: number
          amount_paid: number
          amount_ttc: number
          client_id: string | null
          created_at: string
          created_by: string | null
          due_date: string | null
          id: string
          issue_date: string
          line_items: Json | null
          notes: string | null
          number: string
          payment_terms: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
          vat_rate: number
        }
        Insert: {
          amount_ht?: number
          amount_paid?: number
          amount_ttc?: number
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          issue_date?: string
          line_items?: Json | null
          notes?: string | null
          number: string
          payment_terms?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
          vat_rate?: number
        }
        Update: {
          amount_ht?: number
          amount_paid?: number
          amount_ttc?: number
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          issue_date?: string
          line_items?: Json | null
          notes?: string | null
          number?: string
          payment_terms?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number
          beneficiary_id: string
          beneficiary_role: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          payout_date: string
          period_end: string | null
          period_start: string | null
          related_distribution_ids: string[] | null
        }
        Insert: {
          amount: number
          beneficiary_id: string
          beneficiary_role?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          payout_date?: string
          period_end?: string | null
          period_start?: string | null
          related_distribution_ids?: string[] | null
        }
        Update: {
          amount?: number
          beneficiary_id?: string
          beneficiary_role?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          payout_date?: string
          period_end?: string | null
          period_start?: string | null
          related_distribution_ids?: string[] | null
        }
        Relationships: []
      }
      prestataires: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          default_rate: number | null
          id: string
          is_active: boolean
          kind: string
          name: string
          notes: string | null
          speciality: string | null
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          default_rate?: number | null
          id?: string
          is_active?: boolean
          kind?: string
          name: string
          notes?: string | null
          speciality?: string | null
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          default_rate?: number | null
          id?: string
          is_active?: boolean
          kind?: string
          name?: string
          notes?: string | null
          speciality?: string | null
          updated_at?: string
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
          rule_id: string | null
          rule_set_id: string | null
          spero_share: number
          status: Database["public"]["Enums"]["distribution_status"]
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
          rule_id?: string | null
          rule_set_id?: string | null
          spero_share?: number
          status?: Database["public"]["Enums"]["distribution_status"]
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
          rule_id?: string | null
          rule_set_id?: string | null
          spero_share?: number
          status?: Database["public"]["Enums"]["distribution_status"]
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
      team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role: Database["public"]["Enums"]["app_role"]
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          token?: string
        }
        Relationships: []
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
      apply_finance_rules: { Args: { _transaction_id: string }; Returns: Json }
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
      notify_user: {
        Args: {
          _body: string
          _link: string
          _title: string
          _type: Database["public"]["Enums"]["notification_type"]
          _user_id: string
        }
        Returns: undefined
      }
      simulate_rule_set: {
        Args: { _amount: number; _context?: Json; _rule_set_id: string }
        Returns: Json
      }
    }
    Enums: {
      allocation_basis:
        | "gross"
        | "net_after_caisse"
        | "net_after_costs"
        | "fixed"
      app_role:
        | "super_admin"
        | "associe"
        | "comptable"
        | "chef_projet"
        | "prestataire"
      beneficiary_type:
        | "caisse"
        | "spero"
        | "associe"
        | "apporteur_affaires"
        | "prestataire_interne"
        | "prestataire_externe"
        | "commission_commercial"
        | "dividende_pool"
        | "custom"
      cash_direction: "entree" | "sortie"
      commission_status: "a_valider" | "validee" | "payee" | "annulee"
      confidentiality_level: "public" | "internal" | "restricted" | "secret"
      distribution_case: "cas1_interne" | "cas2_forfait" | "cas3_au_cout"
      distribution_status:
        | "appliquee"
        | "en_attente_validation"
        | "rejetee"
        | "annulee"
      invoice_status:
        | "brouillon"
        | "envoyee"
        | "partiellement_payee"
        | "payee"
        | "annulee"
      notification_type:
        | "task_assigned"
        | "comment"
        | "transaction"
        | "invoice"
        | "project_status"
        | "deadline"
        | "mention"
        | "system"
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
      validation_status: "en_attente" | "approuvee" | "rejetee"
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
      allocation_basis: [
        "gross",
        "net_after_caisse",
        "net_after_costs",
        "fixed",
      ],
      app_role: [
        "super_admin",
        "associe",
        "comptable",
        "chef_projet",
        "prestataire",
      ],
      beneficiary_type: [
        "caisse",
        "spero",
        "associe",
        "apporteur_affaires",
        "prestataire_interne",
        "prestataire_externe",
        "commission_commercial",
        "dividende_pool",
        "custom",
      ],
      cash_direction: ["entree", "sortie"],
      commission_status: ["a_valider", "validee", "payee", "annulee"],
      confidentiality_level: ["public", "internal", "restricted", "secret"],
      distribution_case: ["cas1_interne", "cas2_forfait", "cas3_au_cout"],
      distribution_status: [
        "appliquee",
        "en_attente_validation",
        "rejetee",
        "annulee",
      ],
      invoice_status: [
        "brouillon",
        "envoyee",
        "partiellement_payee",
        "payee",
        "annulee",
      ],
      notification_type: [
        "task_assigned",
        "comment",
        "transaction",
        "invoice",
        "project_status",
        "deadline",
        "mention",
        "system",
      ],
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
      validation_status: ["en_attente", "approuvee", "rejetee"],
    },
  },
} as const
