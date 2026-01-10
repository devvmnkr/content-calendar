-- Make password column nullable for Google-only users
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Add google_id column (unique identifier from Google)
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;

-- Add avatar_url column (profile picture from Google)
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- Create index on google_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
