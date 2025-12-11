export interface ContentItem {
  id: string;
  profile_id: string;
  url: string;
  description: string | null;
  embed_data: any; // Iframely response
  layout_x: number;
  layout_y: number;
  layout_w: number;
  layout_h: number;
  created_at: string;
  updated_at: string;
}

