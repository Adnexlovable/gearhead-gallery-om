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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          contact: string
          created_at: string
          experience: string
          id: string
          name: string
          notes: string | null
          party: string
          read: boolean
          status: string
          visit_date: string
          visit_time: string
        }
        Insert: {
          contact: string
          created_at?: string
          experience: string
          id?: string
          name: string
          notes?: string | null
          party: string
          read?: boolean
          status?: string
          visit_date: string
          visit_time: string
        }
        Update: {
          contact?: string
          created_at?: string
          experience?: string
          id?: string
          name?: string
          notes?: string | null
          party?: string
          read?: boolean
          status?: string
          visit_date?: string
          visit_time?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          contact: string
          created_at: string
          id: string
          message: string | null
          name: string
          product: string
          read: boolean
        }
        Insert: {
          contact: string
          created_at?: string
          id?: string
          message?: string | null
          name: string
          product: string
          read?: boolean
        }
        Update: {
          contact?: string
          created_at?: string
          id?: string
          message?: string | null
          name?: string
          product?: string
          read?: boolean
        }
        Relationships: []
      }
      gearhead_categories: {
        Row: {
          category_key: string
          cover_url: string
          is_visible: boolean
          sort_order: number
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          category_key: string
          cover_url: string
          is_visible?: boolean
          sort_order?: number
          subtitle?: string
          title: string
          updated_at?: string
        }
        Update: {
          category_key?: string
          cover_url?: string
          is_visible?: boolean
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          ask_price: boolean
          category: string
          color_variants: Json
          description: string
          edition: string
          featured: boolean
          features: Json
          gallery: Json
          id: string
          img: string
          in_stock: boolean
          name: string
          price: number
          price_band: string
          price_max: number
          scale: string
          selling_price: number | null
          sku: string | null
          slug: string | null
          sort: number
          stock_quantity: number
          tag: string
          type: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          ask_price?: boolean
          category?: string
          color_variants?: Json
          description?: string
          edition: string
          featured?: boolean
          features?: Json
          gallery?: Json
          id?: string
          img?: string
          in_stock?: boolean
          name: string
          price?: number
          price_band?: string
          price_max?: number
          scale?: string
          selling_price?: number | null
          sku?: string | null
          slug?: string | null
          sort?: number
          stock_quantity?: number
          tag?: string
          type: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          ask_price?: boolean
          category?: string
          color_variants?: Json
          description?: string
          edition?: string
          featured?: boolean
          features?: Json
          gallery?: Json
          id?: string
          img?: string
          in_stock?: boolean
          name?: string
          price?: number
          price_band?: string
          price_max?: number
          scale?: string
          selling_price?: number | null
          sku?: string | null
          slug?: string | null
          sort?: number
          stock_quantity?: number
          tag?: string
          type?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      roadmap_tasks: {
        Row: {
          blocker: string
          created_at: string
          id: string
          sort: number
          status: string
          title: string
        }
        Insert: {
          blocker?: string
          created_at?: string
          id?: string
          sort?: number
          status?: string
          title: string
        }
        Update: {
          blocker?: string
          created_at?: string
          id?: string
          sort?: number
          status?: string
          title?: string
        }
        Relationships: []
      }
      search_console_settings: {
        Row: {
          google_account: string
          id: string
          notes: string
          property_type: string
          property_url: string
          sitemap_url: string
          updated_at: string
          verification_method: string
          verified: boolean
          verified_on: string | null
        }
        Insert: {
          google_account?: string
          id?: string
          notes?: string
          property_type?: string
          property_url?: string
          sitemap_url?: string
          updated_at?: string
          verification_method?: string
          verified?: boolean
          verified_on?: string | null
        }
        Update: {
          google_account?: string
          id?: string
          notes?: string
          property_type?: string
          property_url?: string
          sitemap_url?: string
          updated_at?: string
          verification_method?: string
          verified?: boolean
          verified_on?: string | null
        }
        Relationships: []
      }
      shop_categories: {
        Row: {
          coming_soon: boolean
          cover: string
          description: string
          name: string
          slug: string
          sort: number
          tagline: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          coming_soon?: boolean
          cover?: string
          description?: string
          name: string
          slug: string
          sort?: number
          tagline?: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          coming_soon?: boolean
          cover?: string
          description?: string
          name?: string
          slug?: string
          sort?: number
          tagline?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      site_media: {
        Row: {
          slot: string
          updated_at: string
          url: string
        }
        Insert: {
          slot: string
          updated_at?: string
          url?: string
        }
        Update: {
          slot?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      site_sections: {
        Row: {
          contact_details: Json
          id: string
          label: string
          note: string
          sort: number
          visible: boolean
        }
        Insert: {
          contact_details?: Json
          id: string
          label: string
          note?: string
          sort?: number
          visible?: boolean
        }
        Update: {
          contact_details?: Json
          id?: string
          label?: string
          note?: string
          sort?: number
          visible?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
