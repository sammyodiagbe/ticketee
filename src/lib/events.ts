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
  const { data, error } = await supabase
    .from("events")
    .insert([
      {
        ...eventData,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      },
    ])
    .select()
    .single();

  if (error) throw error;
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
