export type Category = 'Exams' | 'Placements' | 'Hostel' | 'Professors' | 'Fees' | 'Family Pressure' | 'Mental Health' | 'Other';

export interface Vent {
  id: string;
  text: string;
  category: Category;
  same_count: number;
  created_at: string;
  is_approved: boolean;
}

export interface SameVote {
  id: string;
  vent_id: string;
  voter_fingerprint: string;
  created_at: string;
}