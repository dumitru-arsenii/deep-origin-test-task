CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Add an index on the email column for quick lookups during login
CREATE INDEX idx_users_email ON users (email);

-- Add an index on the id column for quick lookups by user ID
CREATE INDEX idx_users_id ON users (id);