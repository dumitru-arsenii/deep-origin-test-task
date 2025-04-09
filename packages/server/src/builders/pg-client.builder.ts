import { PoolClient } from "pg";

let client: PoolClient | null = null;

export type RepositoryCallback<TRepositories> = (
  client: PoolClient
) => TRepositories;

export function withPoolClient<TResponse>(
  callback: RepositoryCallback<TResponse>
) {
  if (!client) {
    throw new Error("Database client is not initialized");
  }

  return callback(client);
}

export function usePoolClient(newClient: PoolClient) {
  client = newClient;
}
