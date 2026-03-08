import 'dotenv/config';
import { DataSource } from 'typeorm';

interface TableRow {
  tablename: string;
}

interface DatabaseRow {
  current_database: string;
}

const db = new DataSource({
  type: 'postgres',
  url: process.env.MAIN_DB_URL as string,
});

async function test(): Promise<void> {
  await db.initialize();

  const dbResult = await db.query<DatabaseRow[]>('SELECT current_database()');

  const tables = await db.query<TableRow[]>(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname='public'
  `);

  console.log('Connected database:', dbResult[0].current_database);

  if (tables.length === 0) {
    console.log('Tables: (none)');
  } else {
    console.log('Tables:');
    tables.forEach((t) => console.log('-', t.tablename));
  }

  await db.destroy();
}

void test();
