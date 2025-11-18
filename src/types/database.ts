export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          user_type: 'generator' | 'recycler' | 'upcycler' | 'energy_expert';
          company: string | null;
          location: string;
          coordinates: string | null;
          avatar_url: string | null;
          rating: number;
          verified: boolean;
          description: string | null;
          website: string | null;
          phone: string | null;
          certifications: string[];
          completed_projects: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          user_type?: 'generator' | 'recycler' | 'upcycler' | 'energy_expert';
          company?: string | null;
          location: string;
          coordinates?: string | null;
          avatar_url?: string | null;
          rating?: number;
          verified?: boolean;
          description?: string | null;
          website?: string | null;
          phone?: string | null;
          certifications?: string[];
          completed_projects?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          user_type?: 'generator' | 'recycler' | 'upcycler' | 'energy_expert';
          company?: string | null;
          location?: string;
          coordinates?: string | null;
          avatar_url?: string | null;
          rating?: number;
          verified?: boolean;
          description?: string | null;
          website?: string | null;
          phone?: string | null;
          certifications?: string[];
          completed_projects?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}