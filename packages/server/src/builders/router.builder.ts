import { initTRPC } from "@trpc/server";
import { Context } from "./context.builder";

const t = initTRPC.context<Context>().create();

export const procedureBuilder = t.procedure;
export const router = t.router;
