export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  coverImageUrl?: string;
  mediaUrls: string[];
  maxAttendees?: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  ticketTypes: TicketType[];
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
  is_published?: boolean;
}

export interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  startSaleDate?: Date;
  endSaleDate?: Date;
  availableQuantity?: number;
}

export interface CreateTicketTypeDTO {
  event_id: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  start_sale_date?: string;
  end_sale_date?: string;
}

export interface Ticket {
  id: string;
  ticketCode: string;
  ticketType: TicketType;
  status: 'reserved' | 'paid' | 'cancelled' | 'refunded';
  purchaseDate?: Date;
  amountPaid: number;
  refundAmount?: number;
}

export interface CreateTicketDTO {
  event_id: string;
  ticket_type_id: string;
  user_id: string;
  amount_paid: number;
  status: 'reserved' | 'paid' | 'cancelled' | 'refunded';
  metadata?: {
    [key: string]: string | number | boolean | null;
  };
}

// Form Types
export interface EventFormData {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  maxAttendees?: number;
  isPublished?: boolean;
  mediaFiles?: FileList;
}

export interface TicketTypeFormData {
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  startSaleDate?: string;
  endSaleDate?: string;
}

// State Types
export interface EventsState {
  events: Event[];
  selectedEvent?: Event;
  isLoading: boolean;
  error?: string;
}

export interface TicketsState {
  tickets: Ticket[];
  isLoading: boolean;
  error?: string;
}

// Filter and Sort Types
export interface EventFilters {
  searchQuery?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  hasAvailableTickets?: boolean;
}

export interface EventSortOptions {
  field: 'startDate' | 'title' | 'price';
  direction: 'asc' | 'desc';
}
