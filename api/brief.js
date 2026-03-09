import { put, list, del } from '@vercel/blob';

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
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      return json({ error: 'Invalid JSON body', detail: String(parseErr.message) }, 400);
    }
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
    const { blobs } = await list({ prefix: PREFIX, limit: 100 });

    if (user) {
      const target = blobs.find(b => b.pathname === PREFIX + user + '.json');
      if (!target) return json({ error: 'not found' }, 404);
      const res = await fetch(target.url, {
        headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      });
      const data = JSON.parse(await res.text());
      return json(data);
    }

    const out = {};
    for (const b of blobs) {
      const name = b.pathname.slice(PREFIX.length).replace(/\.json$/, '');
      try {
        const res = await fetch(b.url, {
          headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
        });
        const data = JSON.parse(await res.text());
        out[name] = data;
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
    const { blobs } = await list({ prefix: PREFIX + user + '.json', limit: 1 });
    if (blobs.length) {
      await del(blobs[0].url);
    }
    return json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/brief', err);
    return json({ error: String(err.message) }, 500);
  }
}
