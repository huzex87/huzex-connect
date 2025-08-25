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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          city: string | null
          created_at: string | null
          email: string | null
          experience_years: number | null
          full_name: string
          id: string
          license_number: string | null
          notes: string | null
          phone: string
          role: string
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
          vehicle_type: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          email?: string | null
          experience_years?: number | null
          full_name: string
          id?: string
          license_number?: string | null
          notes?: string | null
          phone: string
          role: string
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          email?: string | null
          experience_years?: number | null
          full_name?: string
          id?: string
          license_number?: string | null
          notes?: string | null
          phone?: string
          role?: string
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      bot_sessions: {
        Row: {
          created_at: string | null
          id: string
          last_prompt_at: string | null
          payload: Json | null
          state: string | null
          wa_phone: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_prompt_at?: string | null
          payload?: Json | null
          state?: string | null
          wa_phone: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_prompt_at?: string | null
          payload?: Json | null
          state?: string | null
          wa_phone?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      order_counters: {
        Row: {
          count: number | null
          year: number
        }
        Insert: {
          count?: number | null
          year: number
        }
        Update: {
          count?: number | null
          year?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number | null
          created_at: string | null
          customer_id: string | null
          customer_phone: string
          delivery_otp: string | null
          delivery_proof_url: string | null
          dropoff_address: string
          eta: string | null
          id: string
          item_description: string
          notes: string | null
          order_id: string
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          pickup_address: string
          pickup_proof_url: string | null
          rider_id: string | null
          speed: Database["public"]["Enums"]["speed_type"] | null
          status: Database["public"]["Enums"]["order_status"] | null
          tracking_url: string | null
          updated_at: string | null
          weight_kg: number | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          customer_id?: string | null
          customer_phone: string
          delivery_otp?: string | null
          delivery_proof_url?: string | null
          dropoff_address: string
          eta?: string | null
          id?: string
          item_description: string
          notes?: string | null
          order_id: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          pickup_address: string
          pickup_proof_url?: string | null
          rider_id?: string | null
          speed?: Database["public"]["Enums"]["speed_type"] | null
          status?: Database["public"]["Enums"]["order_status"] | null
          tracking_url?: string | null
          updated_at?: string | null
          weight_kg?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          customer_id?: string | null
          customer_phone?: string
          delivery_otp?: string | null
          delivery_proof_url?: string | null
          dropoff_address?: string
          eta?: string | null
          id?: string
          item_description?: string
          notes?: string | null
          order_id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          pickup_address?: string
          pickup_proof_url?: string | null
          rider_id?: string | null
          speed?: Database["public"]["Enums"]["speed_type"] | null
          status?: Database["public"]["Enums"]["order_status"] | null
          tracking_url?: string | null
          updated_at?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          name: string
          phone: string
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          phone: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          phone?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      riders: {
        Row: {
          city: string | null
          created_at: string | null
          id: string
          name: string
          phone: string
          rating: number | null
          status: Database["public"]["Enums"]["rider_status"] | null
          total_deliveries: number | null
          updated_at: string | null
          user_id: string | null
          vehicle_type: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          id?: string
          name: string
          phone: string
          rating?: number | null
          status?: Database["public"]["Enums"]["rider_status"] | null
          total_deliveries?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          id?: string
          name?: string
          phone?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["rider_status"] | null
          total_deliveries?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      app_role: "customer" | "admin" | "rider"
      application_status: "pending" | "approved" | "rejected"
      order_status:
        | "pending"
        | "assigned"
        | "picked_up"
        | "en_route"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
      payment_method: "cash_on_delivery" | "paystack" | "wallet"
      rider_status: "active" | "inactive" | "busy"
      speed_type: "same_day" | "next_day" | "economy"
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
      app_role: ["customer", "admin", "rider"],
      application_status: ["pending", "approved", "rejected"],
      order_status: [
        "pending",
        "assigned",
        "picked_up",
        "en_route",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      payment_method: ["cash_on_delivery", "paystack", "wallet"],
      rider_status: ["active", "inactive", "busy"],
      speed_type: ["same_day", "next_day", "economy"],
    },
  },
} as const
