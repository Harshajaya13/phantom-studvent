import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Admin-only endpoint for moderating vents
// Protected by a secret key stored in environment variables
// Usage: POST /api/admin/moderate
// Body: { "action": "delete" | "list_reported", "vent_id": "...", "secret": "your-secret" }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, vent_id, secret } = body;

    // ─── Auth Check ──────────────────────────────────────
    // Set ADMIN_SECRET in your Vercel environment variables
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret || secret !== adminSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    switch (action) {
      // ─── Delete a specific vent ────────────────────────
      case 'delete': {
        if (!vent_id) {
          return NextResponse.json({ error: 'vent_id is required' }, { status: 400 });
        }
        // Also delete associated votes
        await supabase.from('same_votes').delete().eq('vent_id', vent_id);
        const { error } = await supabase.from('vents').delete().eq('id', vent_id);
        if (error) throw error;
        return NextResponse.json({ success: true, message: `Vent ${vent_id} deleted.` });
      }

      // ─── List all reported vents (sorted by report count) ──
      case 'list_reported': {
        const { data, error } = await supabase
          .from('vents')
          .select('*')
          .gt('report_count', 0)
          .order('report_count', { ascending: false })
          .limit(50);
        if (error) throw error;
        return NextResponse.json({ reported_vents: data });
      }

      // ─── Bulk delete all vents with 3+ reports ─────────
      case 'purge_reported': {
        const { data, error } = await supabase
          .from('vents')
          .delete()
          .gte('report_count', 3)
          .select('id');
        if (error) throw error;
        return NextResponse.json({ 
          success: true, 
          message: `Purged ${data?.length || 0} heavily-reported vents.` 
        });
      }

      // ─── Get total stats ──────────────────────────────
      case 'stats': {
        const { count: totalVents } = await supabase
          .from('vents')
          .select('id', { count: 'exact', head: true });
        const { count: reportedVents } = await supabase
          .from('vents')
          .select('id', { count: 'exact', head: true })
          .gt('report_count', 0);
        return NextResponse.json({
          total_vents: totalVents || 0,
          reported_vents: reportedVents || 0,
        });
      }

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use: delete, list_reported, purge_reported, stats' 
        }, { status: 400 });
    }
  } catch (error: unknown) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
