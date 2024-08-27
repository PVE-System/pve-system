-- Adicionar a coluna user_id à tabela salesInformation
ALTER TABLE sales_information ADD COLUMN "user_id" integer;

-- Adicionar a restrição de chave estrangeira ligando user_id à tabela users
ALTER TABLE sales_information
ADD CONSTRAINT sales_information_user_id_fkey FOREIGN KEY ("user_id") REFERENCES users (id);

UPDATE sales_information SET "user_id" = 1;