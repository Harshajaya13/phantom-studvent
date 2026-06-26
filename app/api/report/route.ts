import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { vent_id, fingerprint, action = 'add' } = await request.json();
    
    if (action === 'add') {
      const { data: existing } = await supabase
        .from('reported_vents')
        .select('id')
        .eq('vent_id', vent_id)
        .eq('fingerprint', fingerprint)
        .single();

      if (existing) {
        return NextResponse.json({ error: 'already_reported' }, { status: 400 });
      }

      const { error: insertError } = await supabase.from('reported_vents').insert([
        { vent_id, fingerprint }
      ]);
      if (insertError) throw insertError;

      const { error } = await supabase.rpc('report_vent', { vent_id });
      if (error) throw error;
    } else if (action === 'remove') {
      const { error: deleteError } = await supabase
        .from('reported_vents')
        .delete()
        .eq('vent_id', vent_id)
        .eq('fingerprint', fingerprint);
      if (deleteError) throw deleteError;

      const { error } = await supabase.rpc('unreport_vent', { vent_id });
      if (error) throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
