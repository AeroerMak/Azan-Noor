import { type NextRequest } from 'next/server';

export const runtime = 'edge';

interface PreferencesRow {
  user_id: string;
  theme: string;
  calc_method: number;
  notif_enabled: number;
  notif_minutes: number;
  sound_enabled: number;
  muezzin: string;
  favorite_duas: string;
  updated_at: string;
}

function getDB(): D1Database | null {
  try {
    // Available only when deployed to Cloudflare Pages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx = (globalThis as any).__cf_pages_ctx__;
    return ctx?.env?.DB ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) return Response.json({ error: 'Missing userId' }, { status: 400 });

  const db = getDB();
  if (!db) return Response.json(null, { status: 503 });

  const row = await db
    .prepare('SELECT * FROM preferences WHERE user_id = ?')
    .bind(userId)
    .first<PreferencesRow>();

  return Response.json(row ?? null);
}

export async function PUT(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) return Response.json({ error: 'Missing userId' }, { status: 400 });

  const db = getDB();
  if (!db) return Response.json({ error: 'Database unavailable' }, { status: 503 });

  const body = await request.json() as Partial<PreferencesRow>;

  await db.prepare(`
    INSERT INTO preferences (user_id, theme, calc_method, notif_enabled, notif_minutes, sound_enabled, muezzin, favorite_duas, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(user_id) DO UPDATE SET
      theme         = excluded.theme,
      calc_method   = excluded.calc_method,
      notif_enabled = excluded.notif_enabled,
      notif_minutes = excluded.notif_minutes,
      sound_enabled = excluded.sound_enabled,
      muezzin       = excluded.muezzin,
      favorite_duas = excluded.favorite_duas,
      updated_at    = datetime('now')
  `).bind(
    userId,
    body.theme ?? 'dark',
    body.calc_method ?? 4,
    body.notif_enabled ?? 0,
    body.notif_minutes ?? 10,
    body.sound_enabled ?? 1,
    body.muezzin ?? 'alafasy',
    body.favorite_duas ?? '[]',
  ).run();

  return Response.json({ ok: true });
}
