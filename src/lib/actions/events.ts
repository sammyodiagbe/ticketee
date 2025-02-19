'use server'

import { getSupabaseServer } from './auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CreateEventDTO, Event } from '@/types/events'

export async function createEvent(formData: FormData) {
  const supabase = await getSupabaseServer()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to create an event' }
  }

  const eventData: CreateEventDTO = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string || undefined,
    location: formData.get('location') as string || undefined,
    max_attendees: Number(formData.get('max_attendees')) || undefined,
    is_published: true,
  }

  // Validate required fields
  if (!eventData.title || !eventData.start_date) {
    return { error: 'Title and start date are required' }
  }

  const { data: event, error } = await supabase
    .from('events')
    .insert([{ ...eventData, created_by: user.id }])
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Handle media uploads if any
  const mediaFiles = formData.getAll('media') as File[]
  if (mediaFiles.length > 0) {
    const mediaUrls = await Promise.all(
      mediaFiles.map(async (file) => {
        const { data, error } = await supabase.storage
          .from('event-media')
          .upload(`${event.id}/${file.name}`, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('event-media')
          .getPublicUrl(data.path)

        return publicUrl
      })
    )

    // Update event with media URLs
    await supabase
      .from('events')
      .update({
        media_urls: mediaUrls,
        cover_image_url: mediaUrls[0],
      })
      .eq('id', event.id)
  }

  revalidatePath('/events')
  redirect(`/events/${event.id}`)
}

export async function getEvents() {
  const supabase = await getSupabaseServer()

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return events as Event[]
}

export async function getEvent(id: string) {
  const supabase = await getSupabaseServer()

  const { data: event, error } = await supabase
    .from('events')
    .select('*, ticket_types(*)')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return event as Event
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await getSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to update an event' }
  }

  const eventData: Partial<CreateEventDTO> = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string || undefined,
    location: formData.get('location') as string || undefined,
    max_attendees: Number(formData.get('max_attendees')) || undefined,
  }

  const { error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)
    .eq('created_by', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/events/${id}`)
  revalidatePath('/events')
  redirect(`/events/${id}`)
}

export async function deleteEvent(id: string) {
  const supabase = await getSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to delete an event' }
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('created_by', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/events')
  redirect('/events')
} 