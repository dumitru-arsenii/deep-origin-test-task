import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { Pool } from "pg";
import { createContext } from "./builders/context.builder";
import { router } from "./builders/router.builder";
import { authRouter } from "./domains/auth/auth.router";
import { usePoolClient } from "./builders/pg-client.builder";
import { runMigrations } from "./migrations";
import { linksRouter } from "./domains/links/links.router";
import { userRouter } from "./domains/user/user.router";
import { statsRouter } from "./domains/stats/stats.router";
import { metricsRouter } from "./domains/metrics/metrics.router";

const pool = new Pool({
  user: "myuser",
  host: "localhost",
  database: "mydb",
  port: 5432,
});

const appRouter = router({
  auth: authRouter,
  links: linksRouter,
  users: userRouter,
  stats: statsRouter,
  metrics: metricsRouter,
});

type AppRouter = typeof appRouter;

const PORT = 3000;

const server = createHTTPServer({
  router: appRouter,
  createContext,
});

pool.connect((err, client) => {
  if (err) {
    console.error(
      "Error connecting to the database:",
      err.message,
      "\nStack Trace:",
      err.stack
    );
    console.error(
      "Ensure the database credentials and server status are correct."
    );
  } else {
    console.log("Connected to the database");
    usePoolClient(client!);
    runMigrations();

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
});

export type { AppRouter };
