//Responsável por configurar e executar as migrações e interações com banco de dados.

import { drizzle } from 'drizzle-orm/postgres-js'; // Importa a função para configurar o Drizzle ORM com PostgreSQL
import { migrate } from 'drizzle-orm/postgres-js/migrator'; // Importa a função de migração do Drizzle para PostgreSQL
import postgres from 'postgres'; // Importa o cliente PostgreSQL

async function runMigrations() {
  // Cria uma conexão com o banco de dados PostgreSQL
  const migrationClient = postgres(
    'postgres://postgres:postgres@0.0.0.0:5432/postgres', // URL de conexão com usuário, senha, host, porta e banco de dados
    { max: 1 }, // Limita a conexão a um cliente
  );

  const db = drizzle(migrationClient); // Configura o Drizzle ORM usando o cliente de conexão PostgreSQL

  // Executa as migrações no banco de dados
  await migrate(db, {
    migrationsFolder: 'db/migrations', // Pasta onde as migrações estão localizadas
    migrationsSchema: 'public', // Esquema do banco de dados onde as migrações serão aplicadas. /drizzle.config.ts
  });

  await migrationClient.end(); // Encerra a conexão com o banco de dados

  console.log('Migrations complete'); // Mensagem de sucesso no console
}
// Executa a função de migração e captura erros, se houver
runMigrations().catch((error) => {
  console.error('Migration failed:', error);
});

/* migrations: Refere-se aos arquivos que definem as mudanças no esquema do banco de dados. 
No código ele não é diretamente mencionado, mas as migrações são os arquivos localizados na pasta db/migrations. */

/* migrate: Este é o método que aplica as migrações definidas nos arquivos de migração ao banco de dados. 
Nocódigo, o método migrate é chamado para executar as migrações no banco de dados configurado. */
