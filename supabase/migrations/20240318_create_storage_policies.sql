-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-media', 'event-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view files (since bucket is public)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-media');

-- Allow authenticated users to upload files
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'event-media' 
    AND auth.role() = 'authenticated'
);

-- Allow users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'event-media' 
    AND owner = auth.uid()
)
WITH CHECK (
    bucket_id = 'event-media' 
    AND owner = auth.uid()
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'event-media' 
    AND owner = auth.uid()
); 