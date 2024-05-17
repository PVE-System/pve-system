/* Este arquivo SQL define uma migração específica para criar a tabela users no banco de dados PostgreSQL. */
/* Propósito: Os arquivos de migração são usados para aplicar alterações no esquema do banco de dados APÓS ele ter sido inicialmente definido no /schema.ts. 
Permitem aplicar alterações de forma incremental ao longo do tempo, mantendo um histórico das alterações feitas.*/

CREATE TABLE IF NOT EXISTS "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "full_name" text,
    "phone" varchar(256)
);