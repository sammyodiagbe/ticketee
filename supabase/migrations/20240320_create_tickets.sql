-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to generate random alphanumeric code
CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS text AS $$
DECLARE
  code text;
  done bool;
BEGIN
  done := false;
  WHILE NOT done LOOP
    -- Generate a random 6-character alphanumeric code (uppercase letters and numbers)
    code := upper(substring(md5(random()::text) from 1 for 6));
    -- Check if code already exists
    done := NOT exists(SELECT 1 FROM tickets WHERE ticket_code = code);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Create tickets table
CREATE TABLE tickets (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_code text NOT NULL DEFAULT generate_ticket_code() UNIQUE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  ticket_type_id uuid REFERENCES ticket_types(id) ON DELETE RESTRICT,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL CHECK (status IN ('reserved', 'paid', 'cancelled', 'refunded')),
  purchase_date timestamp with time zone,
  amount_paid decimal(10,2) NOT NULL,
  refund_amount decimal(10,2),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX tickets_event_id_idx ON tickets(event_id);
CREATE INDEX tickets_ticket_type_id_idx ON tickets(ticket_type_id);
CREATE INDEX tickets_user_id_idx ON tickets(user_id);
CREATE INDEX tickets_status_idx ON tickets(status);
CREATE INDEX tickets_ticket_code_idx ON tickets(ticket_code);

-- Enable Row Level Security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create policies
-- View tickets: Event organizers can view all tickets for their events
CREATE POLICY "Event organizers can view event tickets"
  ON tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = tickets.event_id
      AND events.created_by = auth.uid()
    )
  );

-- View tickets: Users can view their own tickets
CREATE POLICY "Users can view their own tickets"
  ON tickets FOR SELECT
  USING (user_id = auth.uid());

-- Create tickets: Only authenticated users can create tickets
CREATE POLICY "Users can create tickets"
  ON tickets FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Update tickets: Event organizers can update tickets for their events
CREATE POLICY "Event organizers can update tickets"
  ON tickets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = tickets.event_id
      AND events.created_by = auth.uid()
    )
  );

-- Delete tickets: Event organizers can delete tickets for their events
CREATE POLICY "Event organizers can delete tickets"
  ON tickets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = tickets.event_id
      AND events.created_by = auth.uid()
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to check ticket availability
CREATE OR REPLACE FUNCTION check_ticket_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if ticket type has available quantity
  IF EXISTS (
    SELECT 1 FROM ticket_types
    WHERE id = NEW.ticket_type_id
    AND quantity IS NOT NULL
    AND (
      SELECT COUNT(*)
      FROM tickets
      WHERE ticket_type_id = NEW.ticket_type_id
      AND status NOT IN ('cancelled', 'refunded')
    ) >= quantity
  ) THEN
    RAISE EXCEPTION 'No tickets available for this ticket type';
  END IF;

  -- Check if ticket type is within sale period
  IF EXISTS (
    SELECT 1 FROM ticket_types
    WHERE id = NEW.ticket_type_id
    AND (
      (start_sale_date IS NOT NULL AND start_sale_date > NOW())
      OR
      (end_sale_date IS NOT NULL AND end_sale_date < NOW())
    )
  ) THEN
    RAISE EXCEPTION 'Ticket sales are not active for this ticket type';
  END IF;

  -- Check if event has reached max attendees
  IF EXISTS (
    SELECT 1 FROM events e
    WHERE e.id = NEW.event_id
    AND e.max_attendees IS NOT NULL
    AND (
      SELECT COUNT(*)
      FROM tickets t
      WHERE t.event_id = e.id
      AND t.status NOT IN ('cancelled', 'refunded')
    ) >= e.max_attendees
  ) THEN
    RAISE EXCEPTION 'Event has reached maximum attendees';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ticket availability check
CREATE TRIGGER check_ticket_availability_trigger
  BEFORE INSERT ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION check_ticket_availability();

-- Create function to update ticket counts
CREATE OR REPLACE FUNCTION update_ticket_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed to cancelled or refunded, check if anyone is waiting
  IF (TG_OP = 'UPDATE' AND 
      OLD.status NOT IN ('cancelled', 'refunded') AND 
      NEW.status IN ('cancelled', 'refunded'))
  THEN
    -- Could implement waitlist notification here
    NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating ticket counts
CREATE TRIGGER update_ticket_counts_trigger
  AFTER INSERT OR UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_counts(); 