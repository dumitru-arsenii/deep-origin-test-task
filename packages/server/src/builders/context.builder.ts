import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { decodeJwt } from "../utils/jwt";
import { User, userRepository } from "../domains/user/user.repository";

export async function createContext(
  opts: CreateHTTPContextOptions
): Promise<Context> {
  const authHeader = opts.req?.headers?.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;
  const decoded = token ? decodeJwt(token) : undefined;

  if (
    decoded &&
    "userId" in decoded &&
    typeof decoded.userId === "number" &&
    decoded.userId > 0
  ) {
    const user = await userRepository.getUserById(decoded.userId);
    if (user) return { user: { ...user, isAnonymous: false } };
  }

  return {
    user: {
      id: 0,
      email: "john@doe.nope",
      name: "John Doe",
      isAnonymous: true,
    },
  };
}

export type Context = {
  user: User & {
    isAnonymous: boolean;
  };
};
