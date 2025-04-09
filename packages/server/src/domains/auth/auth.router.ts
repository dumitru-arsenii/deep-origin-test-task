import { z } from "zod";
import { procedureBuilder, router } from "../../builders/router.builder";
import { authRepository } from "./auth.repository";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  login: procedureBuilder
    .input(
      z.object({
        email: z.string().email("Invalid email format"),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return authRepository.login(input.email, input.password);
    }),
  signup: procedureBuilder
    .input(
      z.object({
        email: z.string().email("Invalid email format"),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long")
          .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
          .regex(/[a-z]/, "Password must contain at least one lowercase letter")
          .regex(/[0-9]/, "Password must contain at least one number")
          .regex(
            /[@$!%*?&#]/,
            "Password must contain at least one special character"
          ),
        confirmPassword: z.string(),
        name: z.string().min(1, "Name is required"),
      })
    )
    .mutation(async ({ input }) => {
      if (input.password !== input.confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match",
        });
      }
      return authRepository.signup(input);
    }),
});
