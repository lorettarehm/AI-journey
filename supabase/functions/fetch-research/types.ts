
// Type definitions
export interface ResearchPaper {
  title: string;
  authors: string[];
  publication_date: string;
  journal: string;
  abstract: string;
  url?: string;
  doi?: string;
}

export interface Technique {
  title: string;
  description: string;
  target_condition: string[];
  effectiveness_score?: number;
  difficulty_level?: string;
  category?: string;
  keywords?: string[];
  evidence_strength?: string;
  implementation_steps?: string[];
  journal?: string;
  publication_date?: string;
  url?: string;
  doi?: string;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  count?: number;
  message?: string;
}
