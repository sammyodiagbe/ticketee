import { createClient } from "@supabase/supabase-js";
import { Event, CreateEventDTO } from "@/types/events";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadEventImage(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from("event-media")
    .upload(filePath, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("event-media").getPublicUrl(filePath);

  return publicUrl;
}

export async function createEvent(eventData: CreateEventDTO) {
  // First check if we have an active session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Session error:', sessionError);
    throw new Error('Failed to check authentication status');
  }

  if (!session) {
    throw new Error('Please sign in to create an event');
  }

  // Validate required fields
  const requiredFields = {
    title: "Event title",
    start_date: "Start date",
  };

  const missingFields = Object.entries(requiredFields)
    .filter(([field]) => !eventData[field as keyof CreateEventDTO])
    .map(([, label]) => label);

  if (missingFields.length > 0) {
    throw new Error(
      `Please fill in all required fields: ${missingFields.join(", ")}`
    );
  }

  // Get the current user from the session
  const user = session.user;
  if (!user) {
    throw new Error('User session is invalid. Please sign in again.');
  }

  // Ensure the data is properly formatted
  const formattedData = {
    ...eventData,
    created_by: user.id,
    media_urls: eventData.media_urls || [],
    is_published: eventData.is_published ?? true,
  };

  const { data, error } = await supabase
    .from("events")
    .insert([formattedData])
    .select()
    .single();

  if (error) {
    console.error('Event creation error:', error);
    if (error.message.includes('violates row-level security policy')) {
      throw new Error('You do not have permission to create events');
    }
    // Handle specific database constraints
    if (error.message.includes('null value in column')) {
      throw new Error('Please fill in all required fields');
    }
    throw error;
  }
  
  return data as Event;
}

export async function updateEvent(
  id: string,
  eventData: Partial<CreateEventDTO>
) {
  const { data, error } = await supabase
    .from("events")
    .update(eventData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Event;
}

export async function getEvent(id: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Event;
}

export async function getEvents(published: boolean = true) {
  const query = supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (published) {
    query.eq("is_published", true);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Event[];
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) throw error;
}

export async function deleteEventImage(url: string) {
  const path = url.split("/").pop();
  if (!path) throw new Error("Invalid image URL");

  const { error } = await supabase.storage.from("event-media").remove([path]);

  if (error) throw error;
}
