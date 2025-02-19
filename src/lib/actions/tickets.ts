'use server'

import { getSupabaseServer } from './auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CreateTicketTypeDTO, CreateTicketDTO } from '@/types/events'

export async function createTicketType(eventId: string, formData: FormData) {
  const supabase = await getSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to create ticket types' }
  }

  // Verify event ownership
  const { data: event } = await supabase
    .from('events')
    .select('created_by')
    .eq('id', eventId)
    .single()

  if (!event || event.created_by !== user.id) {
    return { error: 'You do not have permission to create ticket types for this event' }
  }

  const ticketTypeData: CreateTicketTypeDTO = {
    event_id: eventId,
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: Number(formData.get('price')),
    quantity: Number(formData.get('quantity')) || undefined,
    start_sale_date: formData.get('start_sale_date') as string || undefined,
    end_sale_date: formData.get('end_sale_date') as string || undefined,
  }

  const { error } = await supabase
    .from('ticket_types')
    .insert([ticketTypeData])

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/events/${eventId}`)
  redirect(`/events/${eventId}`)
}

export async function purchaseTicket(ticketTypeId: string) {
  const supabase = await getSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to purchase tickets' }
  }

  // Get ticket type details
  const { data: ticketType } = await supabase
    .from('ticket_types')
    .select('*, events!inner(*)')
    .eq('id', ticketTypeId)
    .single()

  if (!ticketType) {
    return { error: 'Ticket type not found' }
  }

  const ticketData: CreateTicketDTO = {
    event_id: ticketType.event_id,
    ticket_type_id: ticketTypeId,
    user_id: user.id,
    amount_paid: ticketType.price,
    status: 'reserved',
  }

  const { data: ticket, error } = await supabase
    .from('tickets')
    .insert([ticketData])
    .select()
    .single()

  if (error) {
    if (error.message.includes('check_ticket_availability')) {
      return { error: 'No tickets available for this ticket type' }
    }
    return { error: error.message }
  }

  revalidatePath(`/events/${ticketType.event_id}`)
  redirect(`/tickets/${ticket.id}`)
}

export async function getUserTickets() {
  const supabase = await getSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to view tickets' }
  }

  const { data: tickets, error } = await supabase
    .from('tickets')
    .select(`
      *,
      events (*),
      ticket_types (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return tickets
}

export async function cancelTicket(ticketId: string) {
  const supabase = await getSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to cancel tickets' }
  }

  const { error } = await supabase
    .from('tickets')
    .update({ status: 'cancelled' })
    .eq('id', ticketId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/tickets')
  redirect('/tickets')
} 