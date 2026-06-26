import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get('tab') || 'posts';
  const hash = searchParams.get('hash');
  const starsParam = searchParams.get('stars');

  if (tab === 'posts') {
    if (!hash) return NextResponse.json({ vents: [] });
    
    const { data, error } = await supabase
      .from('vents')
      .select('*')
      .eq('author_hash', hash)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ vents: data });
  } 
  
  if (tab === 'saved') {
    if (!starsParam) return NextResponse.json({ vents: [] });
    
    const starIds = starsParam.split(',').filter(id => id.trim().length > 0);
    if (starIds.length === 0) return NextResponse.json({ vents: [] });

    const { data, error } = await supabase
      .from('vents')
      .select('*')
      .in('id', starIds)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ vents: data });
  }

  return NextResponse.json({ vents: [] });
}
