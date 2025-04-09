import { withPoolClient } from "../../builders/pg-client.builder";
import { TRPCError } from "@trpc/server";
import { userRepository } from "../user/user.repository";

export type ShortLink = {
  id: number;
  shortCode: string;
  originalUrl: string;
  userId: number;
  createdAt: Date;
  expireDate?: Date;
};

const mapDbRowToShortLink = (row: any): ShortLink => ({
  id: row.id,
  shortCode: row.short_code,
  originalUrl: row.original_url,
  userId: row.user_id,
  createdAt: row.created_at,
  expireDate: row.expire_date ?? undefined,
});

export const linksRepository = {
  async createShortLink(
    originalUrl: string,
    shortCode: string,
    userId: number,
    expireDate?: Date
  ): Promise<ShortLink> {
    const result = await withPoolClient((client) =>
      client.query(
        "INSERT INTO links (original_url, short_code, user_id, expire_date) VALUES ($1, $2, $3, $4) RETURNING id, short_code, original_url, created_at, user_id, expire_date",
        [originalUrl, shortCode, userId, expireDate ?? null]
      )
    );

    return mapDbRowToShortLink(result.rows[0]);
  },

  async updateShortLink(
    id: number,
    originalUrl: string,
    userId: number,
    expireDate?: Date
  ): Promise<ShortLink> {
    const result = await withPoolClient((client) =>
      client.query(
        "UPDATE links SET original_url = $1, expire_date = $2 WHERE id = $3 AND user_id = $4 RETURNING id, short_code, original_url, created_at, user_id, expire_date",
        [originalUrl, expireDate, id, userId]
      )
    );

    if (result.rows.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Shortlink not found or you do not have permission to update it",
      });
    }

    return mapDbRowToShortLink(result.rows[0]);
  },

  async deleteShortLink(
    id: number,
    userId: number
  ): Promise<{ success: boolean }> {
    const result = await withPoolClient((client) =>
      client.query(
        "DELETE FROM links WHERE id = $1 AND user_id = $2 RETURNING id",
        [id, userId]
      )
    );

    if (result.rows.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Shortlink not found or you do not have permission to delete it",
      });
    }

    return { success: true };
  },

  async resolveShortLink(
    shortCode: string
  ): Promise<ShortLink & Partial<Record<"userName" | "userEmail", string>>> {
    const result = await withPoolClient((client) =>
      client.query(
        "SELECT id, short_code, original_url, created_at, user_id, expire_date FROM links WHERE short_code = $1",
        [shortCode]
      )
    );

    if (result.rows.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Shortlink not found",
      });
    }

    const shortLink = mapDbRowToShortLink(result.rows[0]);

    if (shortLink.expireDate && new Date(shortLink.expireDate) < new Date()) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Shortlink has expired",
      });
    }

    if (shortLink.userId) {
      const user = await userRepository.getUserById(shortLink.userId);

      if (user)
        return {
          ...shortLink,
          userName: user.name,
          userEmail: user.email,
        };
    }

    return shortLink;
  },

  async getAllByUser(
    userId: number
  ): Promise<(ShortLink & Record<"clicks" | "uniqueVisitors", number>)[]> {
    const result = await withPoolClient((client) =>
      client.query(
        `SELECT l.id, l.short_code, l.original_url, l.created_at, l.user_id, l.expire_date, 
          COALESCE(lam.total_clicks, 0) AS clicks, 
          COALESCE(lam.unique_visitors, 0) AS unique_visitors
       FROM links l
       LEFT JOIN link_access_metrics lam ON l.id = lam.link_id
       WHERE l.user_id = $1`,
        [userId]
      )
    );

    return result.rows.map((row) => ({
      ...mapDbRowToShortLink(row),
      clicks: row.clicks,
      uniqueVisitors: row.unique_visitors,
    }));
  },

  async changeShortCode(
    id: number,
    userId: number,
    newShortCode: string
  ): Promise<ShortLink> {
    const result = await withPoolClient((client) =>
      client.query(
        "UPDATE links SET short_code = $1 WHERE id = $2 AND user_id = $3 RETURNING id, short_code, original_url, created_at, user_id, expire_date",
        [newShortCode, id, userId]
      )
    );

    if (result.rows.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Shortlink not found or you do not have permission to change the short code",
      });
    }

    return mapDbRowToShortLink(result.rows[0]);
  },

  async checkUniqueShortCode(
    shortCode: string
  ): Promise<Record<"exists" | "expired", boolean>> {
    const result = await withPoolClient((client) =>
      client.query("SELECT 1 FROM links WHERE short_code = $1", [shortCode])
    );

    return {
      exists: result.rows.length > 0,
      expired:
        result.rows.length > 0 &&
        new Date(result.rows[0].expire_date) < new Date(),
    };
  },

  async getShortUnique(): Promise<string> {
    let unique = false;
    let shortCode = "";

    while (!unique) {
      const length = Math.floor(Math.random() * (24 - 4 + 1)) + 4;
      shortCode = Math.random()
        .toString(36)
        .substring(2, 2 + length);

      const { exists } = await this.checkUniqueShortCode(shortCode);

      unique = !exists;
    }

    return shortCode;
  },

  async reenableShortLink(
    id: number,
    userId: number,
    newExpireDate: Date
  ): Promise<ShortLink> {
    const result = await withPoolClient((client) =>
      client.query(
        "UPDATE links SET expire_date = $1 WHERE id = $2 AND user_id = $3 RETURNING id, short_code, original_url, created_at, user_id, expire_date",
        [newExpireDate, id, userId]
      )
    );

    if (result.rows.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Shortlink not found or you do not have permission to reenable it",
      });
    }

    return mapDbRowToShortLink(result.rows[0]);
  },

  async getTotalsLinks(): Promise<Record<"total" | "active", number>> {
    const result = await withPoolClient((client) =>
      client.query(
        `SELECT COUNT(*) AS total_links, 
                SUM(CASE WHEN expire_date IS NULL OR expire_date > NOW() THEN 1 ELSE 0 END) AS active_links 
         FROM links`
      )
    );

    return {
      total: parseInt(result.rows[0].total_links, 10),
      active: parseInt(result.rows[0].active_links, 10),
    };
  },

  async getUserTotalsLinks(
    userId: number
  ): Promise<Record<"total" | "active", number>> {
    const result = await withPoolClient((client) =>
      client.query(
        `SELECT COUNT(*) AS total_links,
            SUM(CASE WHEN expire_date IS NULL OR expire_date > NOW() THEN 1 ELSE 0 END) AS active_links
         FROM links
         WHERE user_id = $1`,
        [userId]
      )
    );

    return {
      total: parseInt(result.rows[0].total_links, 10),
      active: parseInt(result.rows[0].active_links, 10),
    };
  },
};
