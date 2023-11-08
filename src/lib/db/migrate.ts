import "dotenv/config";

import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

const runMigrate = async () => {
  console.log("⏳ Loading database configuration...");
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  neonConfig.fetchEndpoint = (host) => {
    const protocol = host === 'db.localtest.me' ? 'http' : 'https';
    const port = host === 'db.localtest.me' ? 4444 : 443;
    return `${protocol}://${host}:${port}/sql`;
  };

  neonConfig.fetchConnectionCache = true;

  console.log("⏳ Connecting to database...");
  const sql = neon(process.env.DATABASE_URL!);

  console.log("⏳ Creating database client...");
  const db = drizzle(sql, { schema: schema });

  console.log("⏳ Running migrations...");

  const start = Date.now();

  await migrate(db, { migrationsFolder: 'src/lib/db/migrations' });

  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});