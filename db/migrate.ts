import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

async function runMigrations() {
  const migrationClient = postgres(
    'postgres://postgres:postgres@0.0.0.0:5432/postgres',
    { max: 1 },
  );
  const db = drizzle(migrationClient);

  await migrate(db, {
    migrationsFolder: 'db/migrations',
    migrationsSchema: 'public',
  });

  await migrationClient.end();

  console.log('Migrations complete');
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error);
});
