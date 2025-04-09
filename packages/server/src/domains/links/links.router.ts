import { z } from "zod";
import { procedureBuilder, router } from "../../builders/router.builder";
import { linksRepository } from "./links.repository";

export const linksRouter = router({
  create: procedureBuilder
    .input(
      z.object({
        originalUrl: z.string().url(),
        shortCode: z.string().optional(),
        expireDate: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const shortCode =
        input.shortCode ?? (await linksRepository.getShortUnique());

      return linksRepository.createShortLink(
        input.originalUrl,
        shortCode,
        userId,
        input.expireDate ? new Date(input.expireDate) : undefined
      );
    }),

  update: procedureBuilder
    .input(
      z.object({
        id: z.number(),
        originalUrl: z.string().url(),
        expireDate: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      return linksRepository.updateShortLink(
        input.id,
        input.originalUrl,
        userId,
        input.expireDate
      );
    }),

  delete: procedureBuilder
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      return linksRepository.deleteShortLink(input.id, userId);
    }),

  resolve: procedureBuilder
    .input(
      z.object({
        shortCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      return linksRepository.resolveShortLink(input.shortCode);
    }),

  getAllByUser: procedureBuilder.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    return linksRepository.getAllByUser(userId);
  }),

  changeShortCode: procedureBuilder
    .input(
      z.object({
        id: z.number(),
        newShortCode: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      return linksRepository.changeShortCode(
        input.id,
        userId,
        input.newShortCode
      );
    }),

  reenable: procedureBuilder
    .input(
      z.object({
        id: z.number(),
        newExpireDate: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      return linksRepository.reenableShortLink(
        input.id,
        userId,
        input.newExpireDate
      );
    }),

  checkUniqueShortCode: procedureBuilder
    .input(
      z.object({
        shortCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      return linksRepository.checkUniqueShortCode(input.shortCode);
    }),
});
