
export interface Characteristic {
  id: string;
  user_id: string;
  characteristic: string;
  description: string | null;
  source_url?: string | null;
  created_at: string;
  updated_at: string;
}
