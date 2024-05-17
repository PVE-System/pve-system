-- Nome da Migração: Altera Colunas na Tabela 'users'
-- Descrição: Altera o nome das colunas 'full_name' para 'email' e 'phone' para 'password' na tabela 'users'

-- Altera o nome da coluna 'full_name' para 'email'
ALTER TABLE "users" RENAME COLUMN "full_name" TO "email";

-- Altera o tipo da coluna 'email' para 'varchar(256)'
ALTER TABLE "users" ALTER COLUMN "email" TYPE varchar(256);

-- Altera o nome da coluna 'phone' para 'password'
ALTER TABLE "users" RENAME COLUMN "phone" TO "password";

-- Altera o tipo da coluna 'password' para 'varchar(256)'
ALTER TABLE "users" ALTER COLUMN "password" TYPE varchar(256);