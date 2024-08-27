-- 1. Adicionar a coluna "user_id" como NULL inicialmente
ALTER TABLE comments ADD COLUMN "user_id" integer;

-- 2. Atualizar os registros existentes com um "user_id" válido
-- Substitua DEFAULT_USER_ID pelo ID de um usuário existente
UPDATE comments SET "user_id" = 1;

-- 3. Alterar a coluna "user_id" para NOT NULL
ALTER TABLE comments ALTER COLUMN "user_id" SET NOT NULL;

-- 4. Adicionar a restrição de chave estrangeira
ALTER TABLE comments
ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY ("user_id") REFERENCES users (id);