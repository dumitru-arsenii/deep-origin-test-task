import { withPoolClient } from "../../builders/pg-client.builder";
import { metricsRepository } from "../metrics/metrics.repository";

export type LinkStats = {
  id: number;
  uniqueUser: string;
  device: "mobile" | "tablet" | "desktop" | "other";
  os: string;
  linkId: number;
  accessAt: Date;
};

export const statsRepository = {
  async recordLinkAccess(
    linkId: number,
    uniqueUser: string,
    device: "mobile" | "tablet" | "desktop" | "other",
    os: string
  ): Promise<LinkStats> {
    const result = await withPoolClient((client) =>
      client.query(
        `INSERT INTO link_stats (link_id, unique_user, device, os) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, unique_user, device, os, link_id, access_at`,
        [linkId, uniqueUser, device, os]
      )
    );

    metricsRepository.refreshMetricsView().catch(() => {});

    return result.rows[0];
  },

  async getLinkStats(linkId: number): Promise<LinkStats[]> {
    const result = await withPoolClient((client) =>
      client.query(
        `SELECT id, unique_user, device, os, link_id, access_at 
         FROM link_stats 
         WHERE link_id = $1 
         ORDER BY access_at DESC`,
        [linkId]
      )
    );

    return result.rows.map((row) => ({
      id: row.id,
      uniqueUser: row.unique_user,
      device: row.device,
      os: row.os,
      linkId: row.link_id,
      accessAt: row.access_at,
    }));
  },
};
