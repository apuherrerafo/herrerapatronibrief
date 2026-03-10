import { createClient } from '@supabase/supabase-js';

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

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  return createClient(url, key);
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
    const supabase = getSupabase();
    const row = {
      user_id: user,
      state: state,
      report: report || null,
      saved_at: savedAt ?? Date.now(),
      submitted_at: submittedAt ?? null,
    };
    const { error } = await supabase.from('briefs').upsert(row, {
      onConflict: 'user_id',
    });
    if (error) {
      console.error('POST /api/brief', error);
      return json({ error: error.message }, 500);
    }
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
    const supabase = getSupabase();

    if (user) {
      const { data, error } = await supabase
        .from('briefs')
        .select('state, report, saved_at, submitted_at')
        .eq('user_id', user)
        .maybeSingle();
      if (error) {
        console.error('GET /api/brief?user=', error);
        return json({ error: error.message }, 500);
      }
      if (!data) {
        return json({ state: {}, report: null, savedAt: null, submittedAt: null });
      }
      return json({
        state: data.state,
        report: data.report,
        savedAt: data.saved_at,
        submittedAt: data.submitted_at,
      });
    }

    const { data: rows, error } = await supabase
      .from('briefs')
      .select('user_id, state, report, saved_at, submitted_at');
    if (error) {
      console.error('GET /api/brief', error);
      return json({ error: error.message }, 500);
    }
    const out = {};
    for (const r of rows || []) {
      out[r.user_id] = {
        state: r.state,
        report: r.report,
        savedAt: r.saved_at,
        submittedAt: r.submitted_at,
      };
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
    const supabase = getSupabase();
    const { error } = await supabase.from('briefs').delete().eq('user_id', user);
    if (error) {
      console.error('DELETE /api/brief', error);
      return json({ error: error.message }, 500);
    }
    return json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/brief', err);
    return json({ error: String(err.message) }, 500);
  }
}
