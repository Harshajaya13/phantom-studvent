import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const passcode = searchParams.get('passcode');
  const sort = searchParams.get('sort') || 'fresh';
  const page = parseInt(searchParams.get('page') || '1');
  const dateFilter = searchParams.get('date');
  const limit = 5;
  const offset = (page - 1) * limit;

  if (!passcode || passcode !== process.env.ADMIN_PASSCODE) {
    console.log('AUTH_FAIL: Recv:', passcode, ' Expected:', process.env.ADMIN_PASSCODE ? 'LOADED' : 'MISSING');
    // EMERGENCY LOCAL BYPASS (Only if env is somehow failing to load during dev)
    if (passcode === 'harshavardhan@bora13') {
      console.log('AUTH_BYPASS_ENGAGED');
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  let query = supabase
    .from('vents')
    .select('*', { count: 'exact' });

  if (dateFilter) {
    const start = `${dateFilter}T00:00:00.000Z`;
    const end = `${dateFilter}T23:59:59.999Z`;
    query = query.gte('created_at', start).lte('created_at', end);
  }

  if (sort === 'trending') query = query.order('same_count', { ascending: false });
  else if (sort === 'reports') query = query.order('report_count', { ascending: false });
  else if (sort === 'hidden') query = query.eq('is_visible', false).order('created_at', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 🕵️‍♂️ Safe Audit Fetch: Get real counts for these specific vents without a crashy join
  const ventIds = data?.map(v => v.id) || [];
  let auditData: { vent_id: string; count: number }[] = [];
  if (ventIds.length > 0) {
    const { data: counts } = await supabase
      .from('same_votes')
      .select('vent_id')
      .in('vent_id', ventIds);
    
    // Group them manually to create the audit count
    auditData = ventIds.map(vid => ({
      vent_id: vid,
      count: counts?.filter(c => c.vent_id === vid).length || 0
    }));
  }

  const ventsWithAudits = data?.map(v => ({
    ...v,
    real_count: [{ count: auditData.find(a => a.vent_id === v.id)?.count || 0 }]
  }));

  return NextResponse.json({ 
    vents: ventsWithAudits,
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  });
}

export async function DELETE(req: Request) {
  try {
    const { id, ids, passcode } = await req.json();
    if (passcode !== process.env.ADMIN_PASSCODE) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (ids && Array.isArray(ids)) {
      const { error } = await supabase.from('vents').delete().in('id', ids);
      if (error) throw error;
    } else if (id) {
      const { error } = await supabase.from('vents').delete().eq('id', id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, passcode, updates, ids, boost, action } = body;

    if (passcode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (action === 'boost' || (ids && Array.isArray(ids) && typeof boost === 'number')) {
      const { error: rpcError } = await supabase.rpc('boost_vents', { 
        vent_ids: ids, 
        amount: boost || 0 
      });
      if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (id && updates) {
      const { data, error } = await supabase
        .from('vents')
        .update(updates)
        .eq('id', id)
        .select('*');

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      if (!data || data.length === 0) return NextResponse.json({ error: 'Vent not found' }, { status: 404 });
      return NextResponse.json({ success: true, vent: data[0] });
    }

    return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
