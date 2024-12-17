ALTER TABLE sales_quotes ADD COLUMN industry TEXT;

ALTER TABLE sales_quotes ALTER COLUMN industry SET NOT NULL;

ALTER TABLE sales_quotes ADD COLUMN quote_number INTEGER NOT NULL;