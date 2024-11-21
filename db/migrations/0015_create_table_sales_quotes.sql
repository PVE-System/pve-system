CREATE TABLE sales_quotes (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients (id),
    user_id INTEGER NOT NULL REFERENCES users (id),
    quote_name TEXT NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);