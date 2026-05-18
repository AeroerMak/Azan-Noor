-- Azan Noor — Cloudflare D1 schema
-- Run: wrangler d1 execute azan-noor-db --file=cloudflare/schema.sql

CREATE TABLE IF NOT EXISTS preferences (
  user_id         TEXT        PRIMARY KEY,
  theme           TEXT        NOT NULL DEFAULT 'dark',
  calc_method     INTEGER     NOT NULL DEFAULT 4,
  notif_enabled   INTEGER     NOT NULL DEFAULT 0,   -- boolean 0/1
  notif_minutes   INTEGER     NOT NULL DEFAULT 10,
  sound_enabled   INTEGER     NOT NULL DEFAULT 1,   -- boolean 0/1
  muezzin         TEXT        NOT NULL DEFAULT 'alafasy',
  favorite_duas   TEXT        NOT NULL DEFAULT '[]', -- JSON array of dua IDs
  updated_at      TEXT        NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_preferences_updated ON preferences(updated_at);
