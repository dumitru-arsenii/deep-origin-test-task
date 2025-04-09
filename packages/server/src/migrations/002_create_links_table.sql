CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(24) NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expire_date TIMESTAMP NULL
);

-- Add an index on the short_code column for quick lookups when resolving shortlinks
CREATE UNIQUE INDEX idx_links_short_code ON links (short_code);

-- Add an index on the user_id column for quick lookups of links by user
CREATE INDEX idx_links_user_id ON links (user_id);

-- Add an index on the id column for quick lookups by link ID
CREATE INDEX idx_links_id ON links (id);

-- Add a composite index on user_id and id for queries that filter by both
CREATE INDEX idx_links_user_id_id ON links (user_id, id);

-- Add an index on the expire_date column for quick filtering of expired links
CREATE INDEX idx_links_expire_date ON links (expire_date);
