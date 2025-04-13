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
      adhd_screening_questions: {
        Row: {
          category: string | null
          created_at: string
          id: string
          question_text: string
          score_type: string
          source: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          question_text: string
          score_type: string
          source: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          question_text?: string
          score_type?: string
          source?: string
        }
        Relationships: []
      }
      ai_technique_recommendations: {
        Row: {
          created_at: string
          description: string
          id: string
          modified_at: string
          rationale: string
          source_data: Json
          technique_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          modified_at?: string
          rationale: string
          source_data: Json
          technique_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          modified_at?: string
          rationale?: string
          source_data?: Json
          technique_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      assessment_results: {
        Row: {
          completed_at: string
          creativity_score: number
          description: string | null
          emotional_regulation: number
          emotional_state: number
          energy_level: number
          focus_duration: number
          focus_level: number
          id: string
          organization: number
          pattern_recognition: number
          problem_solving: number
          questions_asked: Json | null
          responses_given: Json | null
          scoring_rationale: string | null
          stress_level: number
          task_switching: number
          time_awareness: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          creativity_score: number
          description?: string | null
          emotional_regulation: number
          emotional_state: number
          energy_level: number
          focus_duration: number
          focus_level: number
          id?: string
          organization: number
          pattern_recognition: number
          problem_solving: number
          questions_asked?: Json | null
          responses_given?: Json | null
          scoring_rationale?: string | null
          stress_level: number
          task_switching: number
          time_awareness: number
          user_id: string
        }
        Update: {
          completed_at?: string
          creativity_score?: number
          description?: string | null
          emotional_regulation?: number
          emotional_state?: number
          energy_level?: number
          focus_duration?: number
          focus_level?: number
          id?: string
          organization?: number
          pattern_recognition?: number
          problem_solving?: number
          questions_asked?: Json | null
          responses_given?: Json | null
          scoring_rationale?: string | null
          stress_level?: number
          task_switching?: number
          time_awareness?: number
          user_id?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      research_papers: {
        Row: {
          abstract: string
          authors: string[]
          created_at: string
          doi: string | null
          full_text: string | null
          id: string
          journal: string
          publication_date: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          abstract: string
          authors: string[]
          created_at?: string
          doi?: string | null
          full_text?: string | null
          id?: string
          journal: string
          publication_date: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          abstract?: string
          authors?: string[]
          created_at?: string
          doi?: string | null
          full_text?: string | null
          id?: string
          journal?: string
          publication_date?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      research_techniques: {
        Row: {
          category: string | null
          created_at: string
          description: string
          difficulty_level: string | null
          effectiveness_score: number | null
          evidence_strength: string | null
          id: string
          implementation_steps: string[] | null
          keywords: string[] | null
          paper_id: string
          target_condition: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          difficulty_level?: string | null
          effectiveness_score?: number | null
          evidence_strength?: string | null
          id?: string
          implementation_steps?: string[] | null
          keywords?: string[] | null
          paper_id: string
          target_condition: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          difficulty_level?: string | null
          effectiveness_score?: number | null
          evidence_strength?: string | null
          id?: string
          implementation_steps?: string[] | null
          keywords?: string[] | null
          paper_id?: string
          target_condition?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_techniques_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "research_papers"
            referencedColumns: ["id"]
          },
        ]
      }
      technique_interactions: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          technique_id: string
          technique_title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          technique_id: string
          technique_title: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          technique_id?: string
          technique_title?: string
          user_id?: string
        }
        Relationships: []
      }
      technique_metadata: {
        Row: {
          ai_embeddings: string | null
          contraindications: Json | null
          created_at: string
          id: string
          related_techniques: string[] | null
          suitable_for_profiles: Json | null
          technique_id: string
          updated_at: string
        }
        Insert: {
          ai_embeddings?: string | null
          contraindications?: Json | null
          created_at?: string
          id?: string
          related_techniques?: string[] | null
          suitable_for_profiles?: Json | null
          technique_id: string
          updated_at?: string
        }
        Update: {
          ai_embeddings?: string | null
          contraindications?: Json | null
          created_at?: string
          id?: string
          related_techniques?: string[] | null
          suitable_for_profiles?: Json | null
          technique_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technique_metadata_technique_id_fkey"
            columns: ["technique_id"]
            isOneToOne: false
            referencedRelation: "research_techniques"
            referencedColumns: ["id"]
          },
        ]
      }
      user_characteristics: {
        Row: {
          characteristic: string
          created_at: string
          description: string | null
          id: string
          source_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          characteristic: string
          created_at?: string
          description?: string | null
          id?: string
          source_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          characteristic?: string
          created_at?: string
          description?: string | null
          id?: string
          source_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          content_text: string | null
          created_at: string
          description: string | null
          file_path: string
          file_type: string
          id: string
          processed: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_text?: string | null
          created_at?: string
          description?: string | null
          file_path: string
          file_type: string
          id?: string
          processed?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_text?: string | null
          created_at?: string
          description?: string | null
          file_path?: string
          file_type?: string
          id?: string
          processed?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_insight_history: {
        Row: {
          assessment_id: string | null
          created_at: string
          general_insight: string
          id: string
          strengths: Json | null
          user_id: string
          weaknesses: Json | null
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string
          general_insight: string
          id?: string
          strengths?: Json | null
          user_id: string
          weaknesses?: Json | null
        }
        Update: {
          assessment_id?: string | null
          created_at?: string
          general_insight?: string
          id?: string
          strengths?: Json | null
          user_id?: string
          weaknesses?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_insight_history_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessment_results"
            referencedColumns: ["id"]
          },
        ]
      }
      web_content_tags: {
        Row: {
          content_id: string
          created_at: string
          id: string
          tag_name: string
        }
        Insert: {
          content_id: string
          created_at?: string
          id?: string
          tag_name: string
        }
        Update: {
          content_id?: string
          created_at?: string
          id?: string
          tag_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "web_content_tags_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "web_library_content"
            referencedColumns: ["id"]
          },
        ]
      }
      web_library_content: {
        Row: {
          created_at: string
          id: string
          raw_content: string | null
          summary: string | null
          title: string | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          raw_content?: string | null
          summary?: string | null
          title?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          raw_content?: string | null
          summary?: string | null
          title?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      technique_recommendations: {
        Row: {
          category: string | null
          contraindications: Json | null
          description: string | null
          difficulty_level: string | null
          effectiveness_score: number | null
          implementation_steps: string[] | null
          journal: string | null
          publication_date: string | null
          suitable_for_profiles: Json | null
          target_condition: string[] | null
          technique_id: string | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": unknown } | { "": string }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": unknown } | { "": unknown } | { "": string }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": unknown } | { "": string }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
