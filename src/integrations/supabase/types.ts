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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      delivery_addresses: {
        Row: {
          city: string
          created_at: string
          flat_house_number: string
          id: string
          is_default: boolean | null
          label: string | null
          landmark: string | null
          pincode: string
          state: string
          street_address: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          flat_house_number: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          landmark?: string | null
          pincode: string
          state: string
          street_address: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          flat_house_number?: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          landmark?: string | null
          pincode?: string
          state?: string
          street_address?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      delivery_zones: {
        Row: {
          city: string
          created_at: string
          id: string
          is_serviceable: boolean | null
          pincode: string
          state: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          is_serviceable?: boolean | null
          pincode: string
          state: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          is_serviceable?: boolean | null
          pincode?: string
          state?: string
        }
        Relationships: []
      }
      gokulakrishnana: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      holidays: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          name: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
        }
        Relationships: []
      }
      meal_deliveries: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string
          delivery_date: string
          id: string
          meals_count: number
          status: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          delivery_date: string
          id?: string
          meals_count?: number
          status?: string
          subscription_id: string
          updated_at?: string
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          delivery_date?: string
          id?: string
          meals_count?: number
          status?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_deliveries_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_approved: boolean | null
          admin_approved_at: string | null
          admin_approved_by: string | null
          billing_address: Json | null
          created_at: string
          id: string
          order_amount: number
          payment_method: string
          payment_status: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_approved?: boolean | null
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          billing_address?: Json | null
          created_at?: string
          id?: string
          order_amount: number
          payment_method?: string
          payment_status?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_approved?: boolean | null
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          billing_address?: Json | null
          created_at?: string
          id?: string
          order_amount?: number
          payment_method?: string
          payment_status?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_orders_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_details: {
        Row: {
          card_last_four: string | null
          created_at: string
          id: string
          is_default: boolean | null
          payment_method: string | null
          updated_at: string
          upi_id: string | null
          user_id: string
        }
        Insert: {
          card_last_four?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          payment_method?: string | null
          updated_at?: string
          upi_id?: string | null
          user_id: string
        }
        Update: {
          card_last_four?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          payment_method?: string | null
          updated_at?: string
          upi_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          billing_address: Json | null
          created_at: string
          id: string
          invoice_number: string | null
          order_id: string | null
          payment_method: string
          payment_status: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          subscription_id: string | null
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          billing_address?: Json | null
          created_at?: string
          id?: string
          invoice_number?: string | null
          order_id?: string | null
          payment_method: string
          payment_status?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          subscription_id?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          billing_address?: Json | null
          created_at?: string
          id?: string
          invoice_number?: string | null
          order_id?: string | null
          payment_method?: string
          payment_status?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          subscription_id?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment_history_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      product_submissions: {
        Row: {
          category: string | null
          created_at: string
          crunch_topping: string | null
          description: string | null
          dish_name: string | null
          dressing: string | null
          id: string
          image_opened_url: string | null
          image_url: string | null
          is_enabled: boolean | null
          macros: Json | null
          name: string
          price: number
          recipe_link: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          subcategory: string | null
          submitted_by: string
          swiggy_url: string | null
          tags: string | null
          updated_at: string
          veg_or_nonveg: string | null
          zomato_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          crunch_topping?: string | null
          description?: string | null
          dish_name?: string | null
          dressing?: string | null
          id?: string
          image_opened_url?: string | null
          image_url?: string | null
          is_enabled?: boolean | null
          macros?: Json | null
          name: string
          price: number
          recipe_link?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subcategory?: string | null
          submitted_by: string
          swiggy_url?: string | null
          tags?: string | null
          updated_at?: string
          veg_or_nonveg?: string | null
          zomato_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          crunch_topping?: string | null
          description?: string | null
          dish_name?: string | null
          dressing?: string | null
          id?: string
          image_opened_url?: string | null
          image_url?: string | null
          is_enabled?: boolean | null
          macros?: Json | null
          name?: string
          price?: number
          recipe_link?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subcategory?: string | null
          submitted_by?: string
          swiggy_url?: string | null
          tags?: string | null
          updated_at?: string
          veg_or_nonveg?: string | null
          zomato_url?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          crunch_topping: string | null
          description: string | null
          dish_name: string | null
          dressing: string | null
          id: string
          image_opened_url: string | null
          image_url: string | null
          is_enabled: boolean | null
          macros: Json | null
          name: string
          price: number
          recipe_link: string | null
          subcategory: string | null
          swiggy_url: string | null
          tags: string | null
          updated_at: string
          veg_or_nonveg: string | null
          zomato_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          crunch_topping?: string | null
          description?: string | null
          dish_name?: string | null
          dressing?: string | null
          id?: string
          image_opened_url?: string | null
          image_url?: string | null
          is_enabled?: boolean | null
          macros?: Json | null
          name: string
          price: number
          recipe_link?: string | null
          subcategory?: string | null
          swiggy_url?: string | null
          tags?: string | null
          updated_at?: string
          veg_or_nonveg?: string | null
          zomato_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          crunch_topping?: string | null
          description?: string | null
          dish_name?: string | null
          dressing?: string | null
          id?: string
          image_opened_url?: string | null
          image_url?: string | null
          is_enabled?: boolean | null
          macros?: Json | null
          name?: string
          price?: number
          recipe_link?: string | null
          subcategory?: string | null
          swiggy_url?: string | null
          tags?: string | null
          updated_at?: string
          veg_or_nonveg?: string | null
          zomato_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          meals_per_day: number
          meals_per_week: number
          name: string
          plan_type: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          meals_per_day?: number
          meals_per_week: number
          name: string
          plan_type: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          meals_per_day?: number
          meals_per_week?: number
          name?: string
          plan_type?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscription_settings: {
        Row: {
          cancellation_cutoff_hours: number | null
          carry_forward_limit: number | null
          created_at: string
          id: string
          max_cancellations_per_month: number | null
          updated_at: string
        }
        Insert: {
          cancellation_cutoff_hours?: number | null
          carry_forward_limit?: number | null
          created_at?: string
          id?: string
          max_cancellations_per_month?: number | null
          updated_at?: string
        }
        Update: {
          cancellation_cutoff_hours?: number | null
          carry_forward_limit?: number | null
          created_at?: string
          id?: string
          max_cancellations_per_month?: number | null
          updated_at?: string
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
      user_subscriptions: {
        Row: {
          address_id: string | null
          admin_approved: boolean | null
          admin_approved_at: string | null
          admin_approved_by: string | null
          cancellation_count: number | null
          carry_forward_meals: number | null
          created_at: string
          delivery_days: string[]
          delivery_pincode: string
          end_date: string | null
          id: string
          meal_preference: string
          meals_cancelled: number | null
          meals_delivered: number | null
          meals_per_day: number
          meals_per_week: number
          pause_end_date: string | null
          pause_limit_days: number | null
          pause_periods: Json | null
          pause_start_date: string | null
          payment_method: string | null
          payment_status: string | null
          plan_id: string
          start_date: string
          status: string
          total_paused_days: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_id?: string | null
          admin_approved?: boolean | null
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          cancellation_count?: number | null
          carry_forward_meals?: number | null
          created_at?: string
          delivery_days: string[]
          delivery_pincode: string
          end_date?: string | null
          id?: string
          meal_preference: string
          meals_cancelled?: number | null
          meals_delivered?: number | null
          meals_per_day: number
          meals_per_week: number
          pause_end_date?: string | null
          pause_limit_days?: number | null
          pause_periods?: Json | null
          pause_start_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          plan_id: string
          start_date: string
          status?: string
          total_paused_days?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_id?: string | null
          admin_approved?: boolean | null
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          cancellation_count?: number | null
          carry_forward_meals?: number | null
          created_at?: string
          delivery_days?: string[]
          delivery_pincode?: string
          end_date?: string | null
          id?: string
          meal_preference?: string
          meals_cancelled?: number | null
          meals_delivered?: number | null
          meals_per_day?: number
          meals_per_week?: number
          pause_end_date?: string | null
          pause_limit_days?: number | null
          pause_periods?: Json | null
          pause_start_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          plan_id?: string
          start_date?: string
          status?: string
          total_paused_days?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "delivery_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_paused_days: {
        Args: { pause_periods: Json }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
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
      app_role: ["admin", "user"],
    },
  },
} as const
