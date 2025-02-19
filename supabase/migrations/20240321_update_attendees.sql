-- Add communication preferences and blacklist status to attendees
ALTER TABLE attendees
ADD COLUMN email_notifications boolean DEFAULT true,
ADD COLUMN sms_notifications boolean DEFAULT false,
ADD COLUMN phone_number text,
ADD COLUMN is_blacklisted boolean DEFAULT false,
ADD COLUMN blacklist_reason text,
ADD COLUMN blacklisted_at timestamp with time zone,
ADD COLUMN blacklisted_by uuid REFERENCES auth.users(id),
ADD COLUMN last_email_sent_at timestamp with time zone,
ADD COLUMN last_sms_sent_at timestamp with time zone;

-- Create an index for blacklist status for faster queries
CREATE INDEX idx_attendees_blacklist ON attendees(is_blacklisted);

-- Create a function to track blacklist changes
CREATE OR REPLACE FUNCTION track_blacklist_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_blacklisted = true AND OLD.is_blacklisted = false THEN
    NEW.blacklisted_at = now();
    NEW.blacklisted_by = auth.uid();
  ELSIF NEW.is_blacklisted = false AND OLD.is_blacklisted = true THEN
    NEW.blacklisted_at = null;
    NEW.blacklisted_by = null;
    NEW.blacklist_reason = null;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for blacklist tracking
CREATE TRIGGER track_blacklist_changes
  BEFORE UPDATE ON attendees
  FOR EACH ROW
  EXECUTE FUNCTION track_blacklist_changes();

-- Create a view for blacklisted attendees
CREATE VIEW blacklisted_attendees AS
SELECT 
  a.*,
  u.email as blacklisted_by_email
FROM attendees a
LEFT JOIN auth.users u ON a.blacklisted_by = u.id
WHERE a.is_blacklisted = true;

-- Add RLS policies for blacklist management
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Only allow viewing blacklist status if user has permission
CREATE POLICY "View blacklist status"
  ON attendees FOR SELECT
  USING (
    auth.role() = 'authenticated' AND (
      -- Event organizers can see blacklist status
      EXISTS (
        SELECT 1 FROM events e
        WHERE e.created_by = auth.uid()
        AND e.id = attendees.event_id
      )
      OR
      -- Or if the user is viewing their own record
      auth.uid() = user_id
    )
  );

-- Only allow blacklisting if user has permission
CREATE POLICY "Manage blacklist status"
  ON attendees FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM events e
      WHERE e.created_by = auth.uid()
      AND e.id = attendees.event_id
    )
  ); 