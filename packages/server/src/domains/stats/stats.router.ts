import { z } from "zod";
import { procedureBuilder, router } from "../../builders/router.builder";
import { statsRepository } from "./stats.repository";

export const statsRouter = router({
  recordAccess: procedureBuilder
    .input(
      z.object({
        linkId: z.number(),
        uniqueUser: z.string(),
        device: z.enum(["mobile", "tablet", "desktop", "other"]),
        os: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return statsRepository.recordLinkAccess(
        input.linkId,
        input.uniqueUser,
        input.device,
        input.os
      );
    }),
});
