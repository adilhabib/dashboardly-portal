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
      addresses: {
        Row: {
          address: string
          created_at: string | null
          id: number
          is_default: number | null
          latitude: number | null
          longitude: number | null
          title: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: number
          is_default?: number | null
          latitude?: number | null
          longitude?: number | null
          title: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: number
          is_default?: number | null
          latitude?: number | null
          longitude?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string | null
          cta_text: string | null
          description: string | null
          id: number
          image_url: string | null
          is_active: boolean
          target_url: string | null
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_text?: string | null
          description?: string | null
          id?: never
          image_url?: string | null
          is_active?: boolean
          target_url?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_text?: string | null
          description?: string | null
          id?: never
          image_url?: string | null
          is_active?: boolean
          target_url?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customer: {
        Row: {
          address: string | null
          avatar: string | null
          created_at: string
          email: string
          favorite_products: string[] | null
          id: string
          loyalty_points: number | null
          name: string
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          created_at?: string
          email: string
          favorite_products?: string[] | null
          id: string
          loyalty_points?: number | null
          name: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar?: string | null
          created_at?: string
          email?: string
          favorite_products?: string[] | null
          id?: string
          loyalty_points?: number | null
          name?: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_details: {
        Row: {
          created_at: string
          customer_id: string
          delivery_instructions: string | null
          dietary_restrictions: string | null
          favorite_foods: string | null
          id: string
          preferences: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          delivery_instructions?: string | null
          dietary_restrictions?: string | null
          favorite_foods?: string | null
          id?: string
          preferences?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          delivery_instructions?: string | null
          dietary_restrictions?: string | null
          favorite_foods?: string | null
          id?: string
          preferences?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      early_access_signups: {
        Row: {
          company: string
          created_at: string
          dashboard_tool: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at: string
          use_case: string
        }
        Insert: {
          company: string
          created_at?: string
          dashboard_tool?: string | null
          email: string
          id?: string
          name: string
          role: string
          updated_at?: string
          use_case: string
        }
        Update: {
          company?: string
          created_at?: string
          dashboard_tool?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string
          use_case?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      food_details: {
        Row: {
          allergens: string | null
          calories: number | null
          created_at: string
          food_id: string
          id: string
          ingredients: string | null
          preparation_time: number | null
          updated_at: string
        }
        Insert: {
          allergens?: string | null
          calories?: number | null
          created_at?: string
          food_id: string
          id?: string
          ingredients?: string | null
          preparation_time?: number | null
          updated_at?: string
        }
        Update: {
          allergens?: string | null
          calories?: number | null
          created_at?: string
          food_id?: string
          id?: string
          ingredients?: string | null
          preparation_time?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_details_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: true
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
        ]
      }
      food_images: {
        Row: {
          created_at: string
          display_order: number | null
          food_id: string
          id: string
          image_url: string
          is_primary: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          food_id: string
          id?: string
          image_url: string
          is_primary?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          food_id?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_images_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
        ]
      }
      food_sizes: {
        Row: {
          created_at: string
          food_id: string
          id: string
          is_default: boolean | null
          price: number
          size_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          food_id: string
          id?: string
          is_default?: boolean | null
          price: number
          size_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          food_id?: string
          id?: string
          is_default?: boolean | null
          price?: number
          size_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_sizes_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
        ]
      }
      food_toppings: {
        Row: {
          created_at: string | null
          food_id: string
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          food_id: string
          id?: string
          is_active?: boolean | null
          name: string
          price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          food_id?: string
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_toppings_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_popular: boolean | null
          name: string
          price: number
          subcategory: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_popular?: boolean | null
          name: string
          price: number
          subcategory?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_popular?: boolean | null
          name?: string
          price?: number
          subcategory?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          customizations: Json | null
          id: string
          order_id: string
          product_data: Json
          product_id: string
          quantity: number
          selected_size_id: string | null
          selected_toppings: Json | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          customizations?: Json | null
          id?: string
          order_id: string
          product_data: Json
          product_id: string
          quantity: number
          selected_size_id?: string | null
          selected_toppings?: Json | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          customizations?: Json | null
          id?: string
          order_id?: string
          product_data?: Json
          product_id?: string
          quantity?: number
          selected_size_id?: string | null
          selected_toppings?: Json | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_updates: {
        Row: {
          created_at: string
          id: string
          message: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_updates_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string
          delivery_address: Json | null
          delivery_fee: number | null
          discount: number | null
          driver_details: Json | null
          driver_id: string | null
          estimated_delivery_time: string | null
          id: string
          order_type: string
          payment_method: string
          payment_status: string
          promo_code: string | null
          promo_details: Json | null
          special_instructions: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          delivery_address?: Json | null
          delivery_fee?: number | null
          discount?: number | null
          driver_details?: Json | null
          driver_id?: string | null
          estimated_delivery_time?: string | null
          id?: string
          order_type: string
          payment_method: string
          payment_status: string
          promo_code?: string | null
          promo_details?: Json | null
          special_instructions?: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          delivery_address?: Json | null
          delivery_fee?: number | null
          discount?: number | null
          driver_details?: Json | null
          driver_id?: string | null
          estimated_delivery_time?: string | null
          id?: string
          order_type?: string
          payment_method?: string
          payment_status?: string
          promo_code?: string | null
          promo_details?: Json | null
          special_instructions?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
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
          role?: Database["public"]["Enums"]["app_role"]
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
      financial_summary: {
        Row: {
          balance: number | null
          last_transaction_date: string | null
          total_expenses: number | null
          total_income: number | null
          total_transactions: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_admin_to_email: { Args: { email: string }; Returns: undefined }
      create_order: { Args: { order_data: Json }; Returns: Json }
      create_order_items_table: { Args: never; Returns: undefined }
      create_orders_table:
        | { Args: never; Returns: undefined }
        | {
            Args: { table_name: string; table_schema: Json }
            Returns: undefined
          }
      create_user_with_log:
        | { Args: never; Returns: undefined }
        | {
            Args: { user_email: string; user_name: string }
            Returns: undefined
          }
      has_role: { Args: { requested_role: string }; Returns: boolean }
      increment_loyalty_points:
        | {
            Args: { customer_id: string; points_to_add: number }
            Returns: number
          }
        | { Args: { points: number; user_id: number }; Returns: undefined }
      make_user_admin:
        | { Args: never; Returns: undefined }
        | { Args: { email: string }; Returns: undefined }
      record_financial_transaction: {
        Args: { p_amount: number; p_description: string; p_type: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
