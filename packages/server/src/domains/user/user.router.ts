import { TRPCError } from "@trpc/server";
import { procedureBuilder, router } from "../../builders/router.builder";
import { userRepository } from "./user.repository";

export const userRouter = router({
  me: procedureBuilder.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),
});
