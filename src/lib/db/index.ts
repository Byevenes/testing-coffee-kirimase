import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import "dotenv/config";

import * as schema from './schema';

neonConfig.fetchEndpoint = (host) => {
  const protocol = host === 'db.localtest.me' ? 'http' : 'https';
  const port = host === 'db.localtest.me' ? 4444 : 443;
  return `${protocol}://${host}:${port}/sql`;
};

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema: schema });
