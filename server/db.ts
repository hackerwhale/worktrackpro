// filepath: r:\Client Work\ennovatewebdesign\WorkTrackPro\WorkTrackPro\server\db.ts
import 'dotenv/config'; // <-- add this line at the very top
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "postgresql://postgres:PYICpTTKSPNXWxkZybonikFRjIBBIEHE@switchback.proxy.rlwy.net:14194/railway",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });