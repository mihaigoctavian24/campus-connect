export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      saved_opportunities: {
        Row: {
          activity_id: string
          id: string
          saved_at: string | null
          user_id: string
        }
        Insert: {
          activity_id: string
          id?: string
          saved_at?: string | null
          user_id: string
        }
        Update: {
          activity_id?: string
          id?: string
          saved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_opportunities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_opportunities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          activity_id: string
          attendance_status: string | null
          attendance_validated_at: string | null
          availability: string | null
          cancelled_at: string | null
          created_at: string
          deleted_at: string | null
          enrolled_at: string
          experience: string | null
          feedback_submitted: boolean
          id: string
          motivation: string | null
          status: string
          updated_at: string
          user_id: string
          validated_by: string | null
        }
        Insert: {
          activity_id: string
          attendance_status?: string | null
          attendance_validated_at?: string | null
          availability?: string | null
          cancelled_at?: string | null
          created_at?: string
          deleted_at?: string | null
          enrolled_at?: string
          experience?: string | null
          feedback_submitted?: boolean
          id?: string
          motivation?: string | null
          status?: string
          updated_at?: string
          user_id: string
          validated_by?: string | null
        }
        Update: {
          activity_id?: string
          attendance_status?: string | null
          attendance_validated_at?: string | null
          availability?: string | null
          cancelled_at?: string | null
          created_at?: string
          deleted_at?: string | null
          enrolled_at?: string
          experience?: string | null
          feedback_submitted?: boolean
          id?: string
          motivation?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          validated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          deleted_at: string | null
          department_id: string | null
          email: string
          email_verified: boolean
          faculty: string | null
          first_name: string
          id: string
          is_active: boolean
          last_login: string | null
          last_name: string
          phone: string | null
          profile_picture_url: string | null
          program_type: string | null
          role: string
          specialization: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          department_id?: string | null
          email: string
          email_verified?: boolean
          faculty?: string | null
          first_name: string
          id: string
          is_active?: boolean
          last_login?: string | null
          last_name: string
          phone?: string | null
          profile_picture_url?: string | null
          program_type?: string | null
          role?: string
          specialization?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          department_id?: string | null
          email?: string
          email_verified?: boolean
          faculty?: string | null
          first_name?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          last_name?: string
          phone?: string | null
          profile_picture_url?: string | null
          program_type?: string | null
          role?: string
          specialization?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      activities: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string
          current_participants: number
          date: string
          deleted_at: string | null
          department_id: string | null
          description: string
          eligibility_criteria: string | null
          end_time: string
          id: string
          image_url: string | null
          location: string
          max_participants: number
          search_vector: unknown
          start_time: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by: string
          current_participants?: number
          date: string
          deleted_at?: string | null
          department_id?: string | null
          description: string
          eligibility_criteria?: string | null
          end_time: string
          id?: string
          image_url?: string | null
          location: string
          max_participants: number
          search_vector?: unknown
          start_time: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string
          current_participants?: number
          date?: string
          deleted_at?: string | null
          department_id?: string | null
          description?: string
          eligibility_criteria?: string | null
          end_time?: string
          id?: string
          image_url?: string | null
          location?: string
          max_participants?: number
          search_vector?: unknown
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
