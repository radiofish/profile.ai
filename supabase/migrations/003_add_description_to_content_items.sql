-- Add description field to content_items table
ALTER TABLE content_items 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add index for better query performance if needed
CREATE INDEX IF NOT EXISTS content_items_profile_id_description_idx 
ON content_items(profile_id) 
WHERE description IS NOT NULL;

