export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      commercial_activities: {
        Row: {
          company_id: string | null
          created_at: string
          datetime: string
          description: string | null
          id: string
          lead_id: string | null
          responsible_id: string | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          datetime: string
          description?: string | null
          id?: string
          lead_id?: string | null
          responsible_id?: string | null
          status?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          datetime?: string
          description?: string | null
          id?: string
          lead_id?: string | null
          responsible_id?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commercial_activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          cep: string | null
          city: string | null
          cnpj: string | null
          company_name: string | null
          created_at: string
          description: string | null
          email: string | null
          fantasy_name: string
          id: string
          logo_url: string | null
          phone: string | null
          reference: string | null
          responsible_id: string | null
          sector: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          fantasy_name: string
          id?: string
          logo_url?: string | null
          phone?: string | null
          reference?: string | null
          responsible_id?: string | null
          sector?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          fantasy_name?: string
          id?: string
          logo_url?: string | null
          phone?: string | null
          reference?: string | null
          responsible_id?: string | null
          sector?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          company_id: string | null
          created_at: string
          expected_close_date: string | null
          id: string
          notes: string | null
          probability: number | null
          product_id: string | null
          responsible_id: string | null
          stage_id: string
          status: string
          title: string
          updated_at: string
          value: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          probability?: number | null
          product_id?: string | null
          responsible_id?: string | null
          stage_id: string
          status?: string
          title: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          probability?: number | null
          product_id?: string | null
          responsible_id?: string | null
          stage_id?: string
          status?: string
          title?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "funnel_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          end_datetime: string
          event_type: string
          icon: string | null
          id: string
          is_recurring: boolean | null
          recurrence_pattern: string | null
          responsible: string | null
          start_datetime: string
          title: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          end_datetime: string
          event_type?: string
          icon?: string | null
          id?: string
          is_recurring?: boolean | null
          recurrence_pattern?: string | null
          responsible?: string | null
          start_datetime: string
          title: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          end_datetime?: string
          event_type?: string
          icon?: string | null
          id?: string
          is_recurring?: boolean | null
          recurrence_pattern?: string | null
          responsible?: string | null
          start_datetime?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      funnel_stages: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          order_position: number
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          order_position?: number
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          order_position?: number
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          value: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      organizational_structure: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          position_x: number | null
          position_y: number | null
          responsible_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          position_x?: number | null
          position_y?: number | null
          responsible_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          position_x?: number | null
          position_y?: number | null
          responsible_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizational_structure_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "organizational_structure"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number | null
          category: string | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          type: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          category?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          type?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          category?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          type?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          id: string
          key: string
          value: Json | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          id: string
          company_id: string | null
          company_name: string | null
          default_language: string | null
          default_timezone: string | null
          default_currency: string | null
          datetime_format: string | null
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          accent_color: string | null
          enable_2fa: boolean | null
          password_policy: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          company_name?: string | null
          default_language?: string | null
          default_timezone?: string | null
          default_currency?: string | null
          datetime_format?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          accent_color?: string | null
          enable_2fa?: boolean | null
          password_policy?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          company_name?: string | null
          default_language?: string | null
          default_timezone?: string | null
          default_currency?: string | null
          datetime_format?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          accent_color?: string | null
          enable_2fa?: boolean | null
          password_policy?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      company_areas: {
        Row: {
          id: string
          company_id: string | null
          name: string
          description: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          name: string
          description?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          name?: string
          description?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_areas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      company_roles: {
        Row: {
          id: string
          company_id: string | null
          name: string
          description: string | null
          permissions: Json | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          name: string
          description?: string | null
          permissions?: Json | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          name?: string
          description?: string | null
          permissions?: Json | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      role_permissions: {
        Row: {
          id: string
          role_id: string | null
          permission_key: string
          permission_value: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          role_id?: string | null
          permission_key: string
          permission_value?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          role_id?: string | null
          permission_key?: string
          permission_value?: boolean | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "company_roles"
            referencedColumns: ["id"]
          }
        ]
      }
      company_users: {
        Row: {
          id: string
          company_id: string | null
          user_id: string | null
          full_name: string
          email: string
          password_hash: string
          birth_date: string | null
          phone: string | null
          role_id: string | null
          area_id: string | null
          status: string | null
          last_login: string | null
          last_login_ip: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          full_name: string
          email: string
          password_hash: string
          birth_date?: string | null
          phone?: string | null
          role_id?: string | null
          area_id?: string | null
          status?: string | null
          last_login?: string | null
          last_login_ip?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          full_name?: string
          email?: string
          password_hash?: string
          birth_date?: string | null
          phone?: string | null
          role_id?: string | null
          area_id?: string | null
          status?: string | null
          last_login?: string | null
          last_login_ip?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "company_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_users_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "company_areas"
            referencedColumns: ["id"]
          }
        ]
      }
      login_attempts: {
        Row: {
          id: string
          user_id: string | null
          ip_address: string
          success: boolean | null
          attempted_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          ip_address: string
          success?: boolean | null
          attempted_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          ip_address?: string
          success?: boolean | null
          attempted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "login_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
