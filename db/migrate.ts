// Responsável por configurar e executar as migrações e interações com banco de dados.

import { drizzle } from 'drizzle-orm/postgres-js'; // Importa a função para configurar o Drizzle ORM com PostgreSQL
import { migrate } from 'drizzle-orm/postgres-js/migrator'; // Importa a função de migração do Drizzle para PostgreSQL
import postgres from 'postgres'; // Importa o cliente PostgreSQL
import { POSTGRES_URL } from '../config';

async function runMigrations() {
  // Cria uma conexão com o banco de dados PostgreSQL usando a URL completa
  const migrationClient = postgres(POSTGRES_URL, { max: 1 });
  
  // Log para verificar a URL de conexão
  console.log('Connecting to:', POSTGRES_URL);

  const db = drizzle(migrationClient); // Configura o Drizzle ORM usando o cliente de conexão PostgreSQL

  // Executa as migrações no banco de dados
  await migrate(db, {
    migrationsFolder: 'db/migrations', // Pasta onde as migrações estão localizadas
    migrationsSchema: 'public', // Esquema do banco de dados onde as migrações serão aplicadas.
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
No código, o método migrate é chamado para executar as migrações no banco de dados configurado. */
