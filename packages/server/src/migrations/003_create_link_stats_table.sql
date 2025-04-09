CREATE TABLE link_stats (
    id SERIAL PRIMARY KEY,
    unique_user VARCHAR(255) NOT NULL,
    device VARCHAR(10) CHECK (device IN ('mobile', 'tablet', 'desktop', 'other')) NOT NULL,
    os VARCHAR(255) NOT NULL,
    link_id INTEGER NOT NULL,
    access_at TIMESTAMP DEFAULT NOW() NOT NULL,
    FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
);