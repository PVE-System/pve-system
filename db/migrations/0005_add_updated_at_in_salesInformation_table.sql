-- 1. Adicionar a coluna "updated_at" com o valor padrão como NOW() e permitir NULL inicialmente
ALTER TABLE sales_information
ADD COLUMN "updated_at" TIMESTAMP DEFAULT NOW();

-- 2. Atualizar todos os registros existentes para garantir que "updated_at" tenha um valor
UPDATE sales_information
SET
    "updated_at" = NOW()
WHERE
    "updated_at" IS NULL;

-- 3. Alterar a coluna "updated_at" para NOT NULL, garantindo que todos os novos registros tenham um valor
ALTER TABLE sales_information ALTER COLUMN "updated_at" SET NOT NULL;