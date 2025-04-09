import path from "path";
import { withPoolClient } from "../builders/pg-client.builder";
import { readdirSync, readFileSync } from "fs";

export async function runMigrations() {
  const files = readdirSync(__dirname)
    .filter((name) => name.endsWith(".sql"))
    .sort();

  const appliedMigrations = await withPoolClient(async (client) => {
    await client.query(`CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMP DEFAULT NOW()
    );`);

    return client.query("SELECT filename FROM migrations");
  });

  const appliedSet = new Set(appliedMigrations.rows.map((row) => row.filename));

  for (const file of files) {
    if (!appliedSet.has(file)) {
      const filePath = path.join(__dirname, file);
      const sql = readFileSync(filePath, "utf8");
      try {
        console.log(`Running migration: ${file}`);
        await withPoolClient(async (client) => {
          await client.query("BEGIN");
          await client.query(sql);
          await client.query("INSERT INTO migrations (filename) VALUES ($1)", [
            file,
          ]);
          await client.query("COMMIT");
        });
      } catch (err) {
        console.error(`Failed on ${file}`, err);
        await withPoolClient((client) => client.query("ROLLBACK"));
        process.exit(1);
      }
    }
  }

  console.log("All migrations applied.");
}
