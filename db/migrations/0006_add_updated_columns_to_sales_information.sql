-- 1. Adicionar colunas de data de atualização para cada campo
ALTER TABLE sales_information
ADD COLUMN "commercial_updated_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "marketing_updated_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "invoicing_updated_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "cables_updated_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "financial_updated_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "invoice_updated_at" TIMESTAMP DEFAULT NOW();

-- 2. Adicionar colunas para o usuário que fez a atualização
ALTER TABLE sales_information
ADD COLUMN "commercial_updated_by" INTEGER REFERENCES users (id),
ADD COLUMN "marketing_updated_by" INTEGER REFERENCES users (id),
ADD COLUMN "invoicing_updated_by" INTEGER REFERENCES users (id),
ADD COLUMN "cables_updated_by" INTEGER REFERENCES users (id),
ADD COLUMN "financial_updated_by" INTEGER REFERENCES users (id),
ADD COLUMN "invoice_updated_by" INTEGER REFERENCES users (id);

-- 3. Atualizar registros existentes para garantir que todos os registros tenham valores nas novas colunas
UPDATE sales_information
SET
    "commercial_updated_at" = NOW(),
    "marketing_updated_at" = NOW(),
    "invoicing_updated_at" = NOW(),
    "cables_updated_at" = NOW(),
    "financial_updated_at" = NOW(),
    "invoice_updated_at" = NOW();