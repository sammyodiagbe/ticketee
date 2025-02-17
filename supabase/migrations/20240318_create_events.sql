-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    cover_image_url TEXT,
    media_urls JSONB DEFAULT '[]'::jsonb,
    max_attendees INTEGER,
    price DECIMAL(10,2),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public users can view published events"
    ON events FOR SELECT
    USING (is_published = true);

CREATE POLICY "Users can view their own events regardless of status"
    ON events FOR SELECT
    USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own events"
    ON events FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events"
    ON events FOR UPDATE
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events"
    ON events FOR DELETE
    USING (auth.uid() = created_by);

-- Create updated_at trigger
CREATE TRIGGER set_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at(); 