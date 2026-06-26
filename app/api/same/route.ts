import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { vent_id, fingerprint, action = 'add' } = await request.json();
    
    if (action === 'add') {
      // Check if already voted
      const { data: existing } = await supabase
        .from('same_votes')
        .select('id')
        .eq('vent_id', vent_id)
        .eq('fingerprint', fingerprint)
        .single();

      if (existing) {
        return NextResponse.json({ error: 'already_voted' }, { status: 400 });
      }

      // Insert vote
      const { error: insertError } = await supabase.from('same_votes').insert([
        { vent_id, fingerprint }
      ]);

      if (insertError) throw insertError;

      // Increment safely using RPC
      const { error: rpcError } = await supabase.rpc('increment_same', { vent_id });
      if (rpcError) throw rpcError;
    } else if (action === 'remove') {
      // Remove vote
      const { error: deleteError } = await supabase
        .from('same_votes')
        .delete()
        .eq('vent_id', vent_id)
        .eq('fingerprint', fingerprint);

      if (deleteError) throw deleteError;

      // Decrement safely using RPC
      const { error: rpcError } = await supabase.rpc('decrement_same', { vent_id });
      if (rpcError) throw rpcError;
    }

    // Return new count
    const { data: vent } = await supabase.from('vents').select('same_count').eq('id', vent_id).single();
    
    return NextResponse.json({ success: true, new_count: vent?.same_count });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}