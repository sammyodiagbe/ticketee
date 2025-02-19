-- Remove price column from events table since pricing is now handled by ticket_types
ALTER TABLE events DROP COLUMN IF EXISTS price; 