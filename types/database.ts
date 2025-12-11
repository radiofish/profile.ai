export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_items: {
        Row: {
          id: string;
          profile_id: string;
          url: string;
          description: string | null;
          embed_data: any; // JSONB
          layout_x: number;
          layout_y: number;
          layout_w: number;
          layout_h: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          url: string;
          description?: string | null;
          embed_data?: any;
          layout_x?: number;
          layout_y?: number;
          layout_w?: number;
          layout_h?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          url?: string;
          description?: string | null;
          embed_data?: any;
          layout_x?: number;
          layout_y?: number;
          layout_w?: number;
          layout_h?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

