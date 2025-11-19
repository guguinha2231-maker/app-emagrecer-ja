import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          current_weight: number | null
          goal_weight: number | null
          height: number | null
          diet_experience: string | null
          exercise_frequency: string | null
          water_intake: string | null
          sleep_hours: string | null
          daily_goal: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_weight?: number | null
          goal_weight?: number | null
          height?: number | null
          diet_experience?: string | null
          exercise_frequency?: string | null
          water_intake?: string | null
          sleep_hours?: string | null
          daily_goal?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_weight?: number | null
          goal_weight?: number | null
          height?: number | null
          diet_experience?: string | null
          exercise_frequency?: string | null
          water_intake?: string | null
          sleep_hours?: string | null
          daily_goal?: number
          created_at?: string
          updated_at?: string
        }
      }
      food_history: {
        Row: {
          id: string
          user_id: string
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          fiber: number
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          fiber: number
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          fiber?: number
          image_url?: string | null
          created_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          type: string
          duration: number
          calories: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          duration: number
          calories: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          duration?: number
          calories?: number
          notes?: string | null
          created_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          activity: string
          time: string
          days: string[]
          enabled: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity: string
          time: string
          days: string[]
          enabled?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity?: string
          time?: string
          days?: string[]
          enabled?: boolean
          created_at?: string
        }
      }
    }
  }
}
