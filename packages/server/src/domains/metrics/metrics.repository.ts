import { withPoolClient } from "../../builders/pg-client.builder";
import { linksRepository } from "../links/links.repository";

export type LinkMetrics = {
  linkId: number;
  userId: number;
  shortCode: string;
  totalClicks: number;
  uniqueVisitors: number;
  device: "mobile" | "tablet" | "desktop" | "other";
  day: Date;
};

const mapRowToLinkMetrics = (row: any): LinkMetrics => ({
  linkId: row.link_id,
  userId: row.user_id,
  shortCode: row.short_code,
  totalClicks: row.total_clicks,
  uniqueVisitors: row.unique_visitors,
  device: row.device,
  day: row.day,
});

export const metricsRepository = {
  async getMetricsByLinkId(linkId: number): Promise<LinkMetrics[]> {
    const result = await withPoolClient((client) =>
      client.query(
        `SELECT link_id, short_code, total_clicks, unique_visitors, device, day 
        FROM link_access_metrics 
        WHERE link_id = $1
        ORDER BY day DESC`,
        [linkId]
      )
    );

    return result.rows.map(mapRowToLinkMetrics);
  },

  async getTotalMetricsByLinkId(
    linkId: number
  ): Promise<Omit<LinkMetrics, "device" | "day" | "userId">> {
    const result = await withPoolClient((client) =>
      client.query(
        `SELECT link_id, short_code, SUM(total_clicks) AS total_clicks, SUM(unique_visitors) AS unique_visitors
        FROM link_access_metrics 
        WHERE link_id = $1
        GROUP BY link_id, short_code`,
        [linkId]
      )
    );

    return {
      linkId: result.rows[0].link_id,
      shortCode: result.rows[0].short_code,
      totalClicks: result.rows[0].total_clicks,
      uniqueVisitors: result.rows[0].unique_visitors,
    };
  },

  async getTotalMetrics() {
    const result = await withPoolClient((client) =>
      client.query(
        `SELECT SUM(total_clicks) AS total_clicks, COUNT(DISTINCT unique_visitors) AS unique_visitors
        FROM link_access_metrics`
      )
    );

    const { active: activeLinks, total: totalLinks } =
      await linksRepository.getTotalsLinks();

    return {
      totalClicks: result.rows[0]?.total_clicks ?? 0,
      uniqueVisitors: result.rows[0]?.unique_visitors ?? 0,
      totalLinks,
      activeLinks,
    };
  },

  async getMetricsByUser(userId: number): Promise<LinkMetrics[]> {
    const result = await withPoolClient((client) =>
      client.query(
        `SELECT link_id, short_code, total_clicks, unique_visitors, device, day 
        FROM link_access_metrics 
        WHERE user_id = $1
        ORDER BY day DESC`,
        [userId]
      )
    );

    return result.rows.map(mapRowToLinkMetrics);
  },

  async getTotalMetricsByUser(userId: number) {
    const result = await withPoolClient((client) =>
      client.query(
        `SELECT user_id, SUM(total_clicks) AS total_clicks, SUM(unique_visitors) AS unique_visitors
        FROM link_access_metrics 
        WHERE user_id = $1
        GROUP BY user_id`,
        [userId]
      )
    );

    const { active: activeLinks, total: totalLinks } =
      await linksRepository.getUserTotalsLinks(userId);

    return {
      totalClicks: result.rows[0]?.total_clicks ?? 0,
      uniqueVisitors: result.rows[0]?.unique_visitors ?? 0,
      totalLinks,
      activeLinks,
    };
  },

  async refreshMetricsView(): Promise<void> {
    await withPoolClient((client) =>
      client.query(`REFRESH MATERIALIZED VIEW link_access_metrics`)
    );
  },
};
