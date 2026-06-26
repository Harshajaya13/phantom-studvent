import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new ratelimiter, that allows 3 requests per 60 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "60 s"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, category, author_hash, turnstileToken } = body;

    // Check 1: Payload Size
    if (!text || text.trim().length === 0 || text.length > 300) {
      return NextResponse.json({ error: 'Text must be between 1 and 300 characters' }, { status: 400 });
    }

    // Check 2: IP Rate Limiting
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Check 3: Turnstile Verification
    if (!turnstileToken) {
      return NextResponse.json({ error: 'Turnstile verification failed' }, { status: 403 });
    }

    const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '';
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(turnstileToken)}`,
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return NextResponse.json({ error: 'Turnstile verification failed' }, { status: 403 });
    }

    // Action: Insert to Supabase
    const { data, error } = await supabase.from('vents').insert([
      { 
        text: text.trim(), 
        category: category || 'Other', 
        author_hash: author_hash || null 
      }
    ]).select().single();

    if (error) throw error;

    return NextResponse.json({ vent: data });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
