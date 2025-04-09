import bcrypt from "bcrypt";
import { encodeJwt } from "../../utils/jwt";
import { Duration } from "luxon";
import { withPoolClient } from "../../builders/pg-client.builder";
import { TRPCError } from "@trpc/server";
import { User } from "../user/user.repository";

export const authRepository = {
  async login(email: string, password: string) {
    const result = await withPoolClient((client) =>
      client.query("SELECT id, password FROM users WHERE email = $1", [email])
    );

    if (
      result.rows.length === 0 ||
      !(await bcrypt.compare(password, result.rows[0].password))
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const token = encodeJwt(
      { userId: user.id },
      Duration.fromObject({ days: 30 })
    );

    return token;
  },

  async signup({
    email,
    password,
    name,
  }: Omit<User, "id"> & { password: string }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const result = await withPoolClient((client) =>
        client.query(
          "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id",
          [email, hashedPassword, name]
        )
      );

      const token = encodeJwt(
        { userId: result.rows[0].id },
        Duration.fromObject({ days: 30 })
      );

      return { userId: result.rows[0].id, token };
    } catch (error: any) {
      if (error.code === "23505") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }
      throw error;
    }
  },
};
