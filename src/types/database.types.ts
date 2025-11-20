export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      activities: {
        Row: {
          category_id: string | null;
          created_at: string;
          created_by: string;
          current_participants: number;
          date: string;
          deleted_at: string | null;
          department_id: string | null;
          description: string;
          eligibility_criteria: string | null;
          end_time: string;
          id: string;
          image_url: string | null;
          location: string;
          max_participants: number;
          search_vector: unknown;
          start_time: string;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string;
          created_by: string;
          current_participants?: number;
          date: string;
          deleted_at?: string | null;
          department_id?: string | null;
          description: string;
          eligibility_criteria?: string | null;
          end_time: string;
          id?: string;
          image_url?: string | null;
          location: string;
          max_participants: number;
          search_vector?: unknown;
          start_time: string;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string | null;
          created_at?: string;
          created_by?: string;
          current_participants?: number;
          date?: string;
          deleted_at?: string | null;
          department_id?: string | null;
          description?: string;
          eligibility_criteria?: string | null;
          end_time?: string;
          id?: string;
          image_url?: string | null;
          location?: string;
          max_participants?: number;
          search_vector?: unknown;
          start_time?: string;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'activities_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'activities_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'activities_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };
      attendance: {
        Row: {
          check_in_method: string;
          checked_in_at: string;
          checked_in_by: string | null;
          created_at: string;
          enrollment_id: string;
          gps_accuracy: number | null;
          gps_latitude: number | null;
          gps_longitude: number | null;
          hours_credited: number | null;
          id: string;
          notes: string | null;
          session_id: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          check_in_method: string;
          checked_in_at?: string;
          checked_in_by?: string | null;
          created_at?: string;
          enrollment_id: string;
          gps_accuracy?: number | null;
          gps_latitude?: number | null;
          gps_longitude?: number | null;
          hours_credited?: number | null;
          id?: string;
          notes?: string | null;
          session_id: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          check_in_method?: string;
          checked_in_at?: string;
          checked_in_by?: string | null;
          created_at?: string;
          enrollment_id?: string;
          gps_accuracy?: number | null;
          gps_latitude?: number | null;
          gps_longitude?: number | null;
          hours_credited?: number | null;
          id?: string;
          notes?: string | null;
          session_id?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'attendance_checked_in_by_fkey';
            columns: ['checked_in_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attendance_enrollment_id_fkey';
            columns: ['enrollment_id'];
            isOneToOne: false;
            referencedRelation: 'enrollments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attendance_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attendance_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          created_at: string;
          details: Json | null;
          entity_id: string | null;
          entity_type: string;
          id: string;
          ip_address: string | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string;
          details?: Json | null;
          entity_id?: string | null;
          entity_type: string;
          id?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string;
          details?: Json | null;
          entity_id?: string | null;
          entity_type?: string;
          id?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_logs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          color: string | null;
          created_at: string;
          description: string | null;
          icon: string | null;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          updated_at?: string;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          activity_id: string;
          certificate_number: string;
          certificate_url: string;
          created_at: string;
          enrollment_id: string;
          id: string;
          issued_at: string;
          issued_by: string;
          user_id: string;
        };
        Insert: {
          activity_id: string;
          certificate_number: string;
          certificate_url: string;
          created_at?: string;
          enrollment_id: string;
          id?: string;
          issued_at?: string;
          issued_by: string;
          user_id: string;
        };
        Update: {
          activity_id?: string;
          certificate_number?: string;
          certificate_url?: string;
          created_at?: string;
          enrollment_id?: string;
          id?: string;
          issued_at?: string;
          issued_by?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'certificates_activity_id_fkey';
            columns: ['activity_id'];
            isOneToOne: false;
            referencedRelation: 'activities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'certificates_enrollment_id_fkey';
            columns: ['enrollment_id'];
            isOneToOne: true;
            referencedRelation: 'enrollments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'certificates_issued_by_fkey';
            columns: ['issued_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'certificates_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      departments: {
        Row: {
          contact_email: string | null;
          contact_name: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          logo_url: string | null;
          name: string;
          short_code: string;
          updated_at: string | null;
        };
        Insert: {
          contact_email?: string | null;
          contact_name?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          logo_url?: string | null;
          name: string;
          short_code: string;
          updated_at?: string | null;
        };
        Update: {
          contact_email?: string | null;
          contact_name?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          logo_url?: string | null;
          name?: string;
          short_code?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      email_templates: {
        Row: {
          body: string;
          created_by: string | null;
          department_id: string | null;
          id: string;
          subject: string;
          template_type: string;
          updated_at: string | null;
          variables: Json | null;
        };
        Insert: {
          body: string;
          created_by?: string | null;
          department_id?: string | null;
          id?: string;
          subject: string;
          template_type: string;
          updated_at?: string | null;
          variables?: Json | null;
        };
        Update: {
          body?: string;
          created_by?: string | null;
          department_id?: string | null;
          id?: string;
          subject?: string;
          template_type?: string;
          updated_at?: string | null;
          variables?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'email_templates_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'email_templates_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };
      enrollments: {
        Row: {
          activity_id: string;
          attendance_status: string | null;
          attendance_validated_at: string | null;
          availability: string | null;
          cancelled_at: string | null;
          created_at: string;
          deleted_at: string | null;
          enrolled_at: string;
          experience: string | null;
          feedback_submitted: boolean;
          id: string;
          motivation: string | null;
          status: string;
          updated_at: string;
          user_id: string;
          validated_by: string | null;
        };
        Insert: {
          activity_id: string;
          attendance_status?: string | null;
          attendance_validated_at?: string | null;
          availability?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          enrolled_at?: string;
          experience?: string | null;
          feedback_submitted?: boolean;
          id?: string;
          motivation?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
          validated_by?: string | null;
        };
        Update: {
          activity_id?: string;
          attendance_status?: string | null;
          attendance_validated_at?: string | null;
          availability?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          enrolled_at?: string;
          experience?: string | null;
          feedback_submitted?: boolean;
          id?: string;
          motivation?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
          validated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'enrollments_activity_id_fkey';
            columns: ['activity_id'];
            isOneToOne: false;
            referencedRelation: 'activities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'enrollments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'enrollments_validated_by_fkey';
            columns: ['validated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      feedback: {
        Row: {
          comment: string | null;
          created_at: string;
          enrollment_id: string;
          id: string;
          is_approved: boolean | null;
          is_moderated: boolean;
          moderated_at: string | null;
          moderated_by: string | null;
          rating: number;
          updated_at: string;
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          enrollment_id: string;
          id?: string;
          is_approved?: boolean | null;
          is_moderated?: boolean;
          moderated_at?: string | null;
          moderated_by?: string | null;
          rating: number;
          updated_at?: string;
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          enrollment_id?: string;
          id?: string;
          is_approved?: boolean | null;
          is_moderated?: boolean;
          moderated_at?: string | null;
          moderated_by?: string | null;
          rating?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'feedback_enrollment_id_fkey';
            columns: ['enrollment_id'];
            isOneToOne: true;
            referencedRelation: 'enrollments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feedback_moderated_by_fkey';
            columns: ['moderated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      hours_requests: {
        Row: {
          activity_id: string;
          approved_at: string | null;
          approved_by: string | null;
          created_at: string | null;
          date: string;
          description: string;
          enrollment_id: string;
          evidence_urls: string[] | null;
          hours: number;
          id: string;
          professor_notes: string | null;
          rejection_reason: string | null;
          status: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          activity_id: string;
          approved_at?: string | null;
          approved_by?: string | null;
          created_at?: string | null;
          date: string;
          description: string;
          enrollment_id: string;
          evidence_urls?: string[] | null;
          hours: number;
          id?: string;
          professor_notes?: string | null;
          rejection_reason?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          activity_id?: string;
          approved_at?: string | null;
          approved_by?: string | null;
          created_at?: string | null;
          date?: string;
          description?: string;
          enrollment_id?: string;
          evidence_urls?: string[] | null;
          hours?: number;
          id?: string;
          professor_notes?: string | null;
          rejection_reason?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'hours_requests_activity_id_fkey';
            columns: ['activity_id'];
            isOneToOne: false;
            referencedRelation: 'activities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'hours_requests_approved_by_fkey';
            columns: ['approved_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'hours_requests_enrollment_id_fkey';
            columns: ['enrollment_id'];
            isOneToOne: false;
            referencedRelation: 'enrollments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'hours_requests_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          email_sent: boolean;
          email_sent_at: string | null;
          id: string;
          is_read: boolean;
          message: string;
          read_at: string | null;
          related_activity_id: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email_sent?: boolean;
          email_sent_at?: string | null;
          id?: string;
          is_read?: boolean;
          message: string;
          read_at?: string | null;
          related_activity_id?: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email_sent?: boolean;
          email_sent_at?: string | null;
          id?: string;
          is_read?: boolean;
          message?: string;
          read_at?: string | null;
          related_activity_id?: string | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_related_activity_id_fkey';
            columns: ['related_activity_id'];
            isOneToOne: false;
            referencedRelation: 'activities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      platform_settings: {
        Row: {
          description: string | null;
          id: string;
          key: string;
          updated_at: string;
          updated_by: string;
          value: Json;
        };
        Insert: {
          description?: string | null;
          id?: string;
          key: string;
          updated_at?: string;
          updated_by: string;
          value: Json;
        };
        Update: {
          description?: string | null;
          id?: string;
          key?: string;
          updated_at?: string;
          updated_by?: string;
          value?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'platform_settings_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          department_id: string | null;
          email: string;
          email_verified: boolean;
          faculty: string | null;
          first_name: string;
          id: string;
          is_active: boolean;
          last_login: string | null;
          last_name: string;
          phone: string | null;
          profile_picture_url: string | null;
          program_type: string | null;
          role: string;
          specialization: string | null;
          updated_at: string;
          year: number | null;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          department_id?: string | null;
          email: string;
          email_verified?: boolean;
          faculty?: string | null;
          first_name: string;
          id: string;
          is_active?: boolean;
          last_login?: string | null;
          last_name: string;
          phone?: string | null;
          profile_picture_url?: string | null;
          program_type?: string | null;
          role?: string;
          specialization?: string | null;
          updated_at?: string;
          year?: number | null;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          department_id?: string | null;
          email?: string;
          email_verified?: boolean;
          faculty?: string | null;
          first_name?: string;
          id?: string;
          is_active?: boolean;
          last_login?: string | null;
          last_name?: string;
          phone?: string | null;
          profile_picture_url?: string | null;
          program_type?: string | null;
          role?: string;
          specialization?: string | null;
          updated_at?: string;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };
      saved_opportunities: {
        Row: {
          activity_id: string;
          id: string;
          saved_at: string | null;
          user_id: string;
        };
        Insert: {
          activity_id: string;
          id?: string;
          saved_at?: string | null;
          user_id: string;
        };
        Update: {
          activity_id?: string;
          id?: string;
          saved_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'saved_opportunities_activity_id_fkey';
            columns: ['activity_id'];
            isOneToOne: false;
            referencedRelation: 'activities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'saved_opportunities_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      sessions: {
        Row: {
          activity_id: string;
          created_at: string | null;
          date: string;
          end_time: string;
          id: string;
          location: string;
          location_hash: string | null;
          max_participants: number | null;
          qr_code_data: string | null;
          qr_expires_at: string | null;
          reminder_sent: boolean | null;
          start_time: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          activity_id: string;
          created_at?: string | null;
          date: string;
          end_time: string;
          id?: string;
          location: string;
          location_hash?: string | null;
          max_participants?: number | null;
          qr_code_data?: string | null;
          qr_expires_at?: string | null;
          reminder_sent?: boolean | null;
          start_time: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          activity_id?: string;
          created_at?: string | null;
          date?: string;
          end_time?: string;
          id?: string;
          location?: string;
          location_hash?: string | null;
          max_participants?: number | null;
          qr_code_data?: string | null;
          qr_expires_at?: string | null;
          reminder_sent?: boolean | null;
          start_time?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'sessions_activity_id_fkey';
            columns: ['activity_id'];
            isOneToOne: false;
            referencedRelation: 'activities';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_attendance_rate: {
        Args: { p_enrollment_id: string };
        Returns: number;
      };
      create_audit_log: {
        Args: {
          p_action: string;
          p_details?: Json;
          p_entity_id: string;
          p_entity_type: string;
          p_ip_address?: string;
          p_user_agent?: string;
          p_user_id: string;
        };
        Returns: string;
      };
      create_notification: {
        Args: {
          p_activity_id?: string;
          p_message: string;
          p_title: string;
          p_type: string;
          p_user_id: string;
        };
        Returns: string;
      };
      generate_certificate_number: { Args: never; Returns: string };
      generate_qr_code_data: { Args: { p_session_id: string }; Returns: string };
      get_slow_queries: {
        Args: { p_limit?: number };
        Returns: {
          calls: number;
          max_time_ms: number;
          mean_time_ms: number;
          query: string;
          total_time_ms: number;
        }[];
      };
      get_user_total_hours: { Args: { p_user_id: string }; Returns: number };
      search_activities: {
        Args: { p_limit?: number; p_offset?: number; p_search_query: string };
        Returns: {
          date: string;
          description: string;
          id: string;
          location: string;
          rank: number;
          start_time: string;
          title: string;
        }[];
      };
      update_activity_status: { Args: never; Returns: undefined };
      validate_qr_code: {
        Args: { p_payload: string; p_session_id: string; p_timestamp: number };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
