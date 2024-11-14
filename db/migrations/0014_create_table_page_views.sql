CREATE TABLE page_views (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (id),
    page_excel TIMESTAMP DEFAULT NOW(),
    page_dashboard TIMESTAMP DEFAULT NOW(),
    page_sales_quote TIMESTAMP DEFAULT NOW(),
    last_viewed_at TIMESTAMP DEFAULT NOW(), -- Última vez que o usuário visualizou a página
    last_updated_at TIMESTAMP DEFAULT NOW() -- Última vez que o conteúdo da página foi atualizado (por exemplo, novo upload)
);