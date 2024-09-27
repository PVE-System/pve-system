CREATE TABLE tabs_viewed (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (id),
    client_id INTEGER NOT NULL REFERENCES clients (id),
    sales_tab_viewed_at TIMESTAMP,
    comments_tab_viewed_at TIMESTAMP
);