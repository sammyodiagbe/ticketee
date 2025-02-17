export interface Event {
  id: string;
  created_by: string;
  title: string;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  cover_image_url?: string;
  media_urls: string[];
  max_attendees?: number;
  price?: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEventDTO {
  title: string;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  cover_image_url?: string;
  media_urls?: string[];
  max_attendees?: number;
  price?: number;
  is_published?: boolean;
}
