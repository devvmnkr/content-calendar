-- Create post status enum
CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'published', 'failed');

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    channels TEXT[] NOT NULL DEFAULT '{}',
    scheduled_time TIMESTAMPTZ NOT NULL,
    file_url TEXT,
    file_name VARCHAR(255),
    status post_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);

-- Create index on scheduled_time for date range queries
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_time ON posts(scheduled_time);

-- Create GIN index on channels for array contains queries
CREATE INDEX IF NOT EXISTS idx_posts_channels ON posts USING GIN(channels);

-- Create index on deleted_at for soft delete queries
CREATE INDEX IF NOT EXISTS idx_posts_deleted_at ON posts(deleted_at);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to bypass RLS
CREATE POLICY "Service role can do anything on posts" ON posts
    FOR ALL
    USING (auth.role() = 'service_role');
