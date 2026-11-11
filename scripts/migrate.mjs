import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pg from "pg";

const connectionString = process.env.DATABASE_MIGRATION_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error("Set DATABASE_MIGRATION_URL or DATABASE_URL before migrating.");
const client = new pg.Client({ connectionString });
const directory = fileURLToPath(new URL("../migrations/", import.meta.url));
try {
  await client.connect();
  await client.query("SELECT pg_advisory_lock(739821463)");
  await client.query(`CREATE TABLE IF NOT EXISTS public.byteform_migrations (
    name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now()
  )`);
  const { rows } = await client.query("SELECT name, checksum FROM public.byteform_migrations");
  const applied = new Map(rows.map(row => [row.name, row.checksum]));
  for (const name of (await readdir(directory)).filter(name => name.endsWith(".sql")).sort()) {
    const sql = await readFile(new URL(`../migrations/${name}`, import.meta.url), "utf8");
    const checksum = createHash("sha256").update(sql).digest("hex");
    if (applied.has(name)) {
      if (applied.get(name) !== checksum) throw new Error(`Applied migration changed: ${name}`);
      continue;
    }
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO public.byteform_migrations (name, checksum) VALUES ($1, $2)", [name, checksum]);
      await client.query("COMMIT");
      console.log(`Applied ${name}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
} catch {
  // Driver errors may contain credentials or row data. Inspect safely in the database console.
  console.error("Migration failed. Verify connectivity, schema compatibility, and migration checksums.");
  process.exitCode = 1;
} finally {
  await client.end();
}
