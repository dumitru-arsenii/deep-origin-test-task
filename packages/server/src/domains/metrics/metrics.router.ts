import { z } from "zod";
import { procedureBuilder, router } from "../../builders/router.builder";
import { metricsRepository } from "./metrics.repository";

export const metricsRouter = router({
  getMetricsByLinkId: procedureBuilder
    .input(
      z.object({
        linkId: z.number(),
      })
    )
    .query(async ({ input }) => {
      return metricsRepository.getMetricsByLinkId(input.linkId);
    }),

  getTotalMetricsByLinkId: procedureBuilder
    .input(
      z.object({
        linkId: z.number(),
      })
    )
    .query(async ({ input }) => {
      return metricsRepository.getTotalMetricsByLinkId(input.linkId);
    }),

  getTotalMetrics: procedureBuilder.query(async () => {
    return metricsRepository.getTotalMetrics();
  }),

  getMetricsByUser: procedureBuilder
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .query(async ({ input }) => {
      return metricsRepository.getMetricsByUser(input.userId);
    }),

  getTotalMetricsByUser: procedureBuilder
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .query(async ({ input }) => {
      return metricsRepository.getTotalMetricsByUser(input.userId);
    }),

  refreshMetricsView: procedureBuilder.mutation(async () => {
    await metricsRepository.refreshMetricsView();
    return { success: true };
  }),
});
