import { withPoolClient } from "../../builders/pg-client.builder";
import { TRPCError } from "@trpc/server";

export type User = {
  id: number;
  email: string;
  name: string;
};

export const userRepository = {
  async getUserById(userId: number): Promise<User | undefined> {
    const result = await withPoolClient((client) =>
      client.query("SELECT id, email, name FROM users WHERE id = $1", [userId])
    );

    if (result.rows.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return result.rows[0];
  },
};
