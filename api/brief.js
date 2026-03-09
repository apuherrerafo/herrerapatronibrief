// API para guardar y leer briefs en Vercel Blob (datos compartidos entre cliente y backoffice)
import { put, get, list, del } from '@vercel/blob';

const PREFIX = 'briefs/';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { user, state, report, savedAt, submittedAt } = body || {};
    if (!user || state === undefined) {
      return json({ error: 'user and state required' }, 400);
    }
    const pathname = PREFIX + user + '.json';
    const payload = {
      state,
      report: report || null,
      savedAt: savedAt || Date.now(),
      submittedAt: submittedAt || null,
    };
    await put(pathname, JSON.stringify(payload), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return json({ ok: true });
  } catch (err) {
    console.error('POST /api/brief', err);
    return json({ error: String(err.message) }, 500);
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');
    if (user) {
      const pathname = PREFIX + user + '.json';
      let data;
      try {
        const result = await get(pathname, { access: 'private' });
        if (!result) return json({ error: 'not found' }, 404);
        const stream = result.stream || result.body;
        const text = stream ? await new Response(stream).text() : '';
        data = JSON.parse(text || '{}');
      } catch (e) {
        if (e && (e.message || '').toLowerCase().includes('not found')) return json({ error: 'not found' }, 404);
        throw e;
      }
      return json(data);
    }
    const { blobs } = await list({ prefix: PREFIX, limit: 100 });
    const out = {};
    for (const b of blobs) {
      const name = b.pathname.slice(PREFIX.length).replace(/\.json$/, '');
      try {
        const result = await get(b.pathname, { access: 'private' });
        if (result && result.statusCode !== 404) {
          const stream = result.stream || result.body;
          const text = stream ? await new Response(stream).text() : '';
          out[name] = JSON.parse(text || '{}');
        }
      } catch (_) {}
    }
    return json(out);
  } catch (err) {
    console.error('GET /api/brief', err);
    return json({ error: String(err.message) }, 500);
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');
    if (!user) return json({ error: 'user required' }, 400);
    const pathname = PREFIX + user + '.json';
    try {
      await del(pathname, { access: 'private' });
    } catch (_) {}
    return json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/brief', err);
    return json({ error: String(err.message) }, 500);
  }
}
