CREATE MATERIALIZED VIEW link_access_metrics AS
SELECT
  l.id AS link_id,
  l.short_code,
  l.user_id,
  COUNT(ls.id) AS total_clicks,
  COUNT(DISTINCT ls.unique_user) AS unique_visitors,
  ls.device,
  DATE_TRUNC('day', ls.access_at) AS day
FROM links l
JOIN link_stats ls ON l.id = ls.link_id
GROUP BY l.id, l.short_code, l.user_id, ls.device, DATE_TRUNC('day', ls.access_at);

-- Index for faster lookups by link_id in link_access_metrics
CREATE INDEX idx_link_access_metrics_link_id ON link_access_metrics (link_id);

-- Index for faster lookups by link_id in link_stats
CREATE INDEX idx_link_stats_link_id ON link_stats (link_id);

-- Index for faster lookups by day in link_access_metrics
CREATE INDEX idx_link_access_metrics_day ON link_access_metrics (day);

-- Composite index for link_id and day in link_access_metrics
CREATE INDEX idx_link_access_metrics_link_id_day ON link_access_metrics (link_id, day);

-- Index for faster lookups by user_id in link_access_metrics
CREATE INDEX idx_link_access_metrics_user_id ON link_access_metrics (user_id);
