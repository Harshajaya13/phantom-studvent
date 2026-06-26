import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'trending';
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');

  let query = supabase
    .from('vents')
    .select('*', { count: 'exact' })
    .eq('is_visible', true) // Filter out shadowbanned posts
    .lt('report_count', 5); // Auto-hide if 5+ reports

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.ilike('text', `%${search}%`);
  }

  if (sort === 'trending') {
    query = query.order('same_count', { ascending: false }).order('created_at', { ascending: false }).order('id');
  } else {
    query = query.order('created_at', { ascending: false }).order('id');
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    if (error.code === 'PGRST103' || error.message.includes('Requested range not satisfiable')) {
      return NextResponse.json({
        vents: [],
        total: count || 0,
        page,
        hasMore: false
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    vents: data,
    total: count || 0,
    page,
    hasMore: count ? from + limit < count : false
  });
}

// ─── Rate Limiting Maps ──────────────────────────────────
// Layer 1: Per-IP rate limit
const ipRateLimit = new Map<string, { count: number, resetAt: number }>();
// Layer 2: Per-fingerprint rate limit (survives VPN rotation)
const fpRateLimit = new Map<string, { count: number, resetAt: number }>();
// Layer 3: Global rate limit (total vents across ALL users)
const globalRate = { count: 0, resetAt: 0 };
// Layer 4: Recent content hashes (block duplicate/similar spam)
const recentHashes = new Map<string, number>();

function checkRateLimit(map: Map<string, { count: number, resetAt: number }>, key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  if (map.size > 5000) map.clear(); // Memory safety

  const record = map.get(key);
  if (record && record.resetAt > now) {
    if (record.count >= max) return false;
    record.count += 1;
  } else {
    map.set(key, { count: 1, resetAt: now + windowMs });
  }
  return true;
}

// Simple hash for content similarity detection
function simpleHash(text: string): string {
  // Normalize: lowercase, remove spaces/punctuation, take first 100 chars
  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 100);
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    const now = Date.now();

    // ─── Layer 1: IP Rate Limit (3/min per IP) ───────────
    if (!checkRateLimit(ipRateLimit, ip, 3, 60_000)) {
      return NextResponse.json({ error: 'You are posting too fast! Please wait a minute.' }, { status: 429 });
    }

    // ─── Layer 3: Global Rate Limit (30 vents/min across ALL users) ───
    // This stops VPN-rotated mass attacks cold — even with infinite IPs,
    // the entire platform only accepts 30 vents per minute total
    if (globalRate.resetAt > now) {
      if (globalRate.count >= 30) {
        return NextResponse.json({ error: 'The platform is receiving too many submissions right now. Please try again shortly.' }, { status: 429 });
      }
      globalRate.count += 1;
    } else {
      globalRate.count = 1;
      globalRate.resetAt = now + 60_000;
    }

    const body = await request.json();
    const { text, category, fingerprint, deviceHash } = body;

    // ─── Layer 2: Fingerprint Rate Limit (5/hour per browser) ─────
    // VPN changes IP but NOT the browser fingerprint
    if (fingerprint && fingerprint !== 'server') {
      if (!checkRateLimit(fpRateLimit, fingerprint, 5, 3600_000)) {
        return NextResponse.json({ error: 'You have reached the hourly vent limit. Take a break and come back later!' }, { status: 429 });
      }
    }

    // ─── Validation ──────────────────────────────────────
    if (!text || text.length < 20 || text.length > 280) {
      return NextResponse.json({ error: 'Text must be between 20 and 280 characters' }, { status: 400 });
    }

    // Input sanitization — strip HTML/script tags
    const sanitized = text.replace(/<[^>]*>/g, '').trim();
    if (sanitized.length < 20) {
      return NextResponse.json({ error: 'Text must be between 20 and 280 characters' }, { status: 400 });
    }

    // ─── Layer 4: Duplicate Content Detection ────────────
    const contentHash = simpleHash(sanitized);
    const lastSeen = recentHashes.get(contentHash);
    if (lastSeen && now - lastSeen < 300_000) { // Block same content within 5 minutes
      return NextResponse.json({ error: 'A similar vent was posted recently. Try expressing it differently!' }, { status: 403 });
    }
    recentHashes.set(contentHash, now);
    // Clean up old hashes
    if (recentHashes.size > 2000) {
      recentHashes.forEach((time, key) => {
        if (now - time > 300_000) recentHashes.delete(key);
      });
    }

    // ─── Profanity Filter ────────────────────────────────
    const forbiddenWords = [
      'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'pussy', 'cunt',
      'whore', 'slut', 'nigger', 'nigga', 'faggot', 'retard', 'rape',
      'chutiya', 'madarchod', 'bhenchod', 'bhosdike', 'gaand', 'lund', 'randi',
      'motherfucker', 'bullshit', 'cocksucker', 'wanker', 'twat',
      'kill yourself', 'kys', 'go die', 'neck yourself'
    ];
    const lowerText = sanitized.toLowerCase();
    if (forbiddenWords.some(word => lowerText.includes(word))) {
      return NextResponse.json({ error: 'Please keep the language clean and respectful.' }, { status: 403 });
    }

    // ─── Spam Pattern Detection ──────────────────────────
    const spamPatterns = [
      /https?:\/\//i,
      /www\./i,
      /[\w.-]+@[\w.-]+\.\w+/,
      /(\+?\d[\d\s-]{8,})/,
      /(.)\1{6,}/,
      /\b(buy|sell|discount|click here|free money|earn money|whatsapp)\b/i,
    ];
    if (spamPatterns.some(pattern => pattern.test(sanitized))) {
      return NextResponse.json({ error: 'Spam content is not allowed.' }, { status: 403 });
    }
    
    // ─── Save to DB ──────────────────────────────────────
    const { data, error } = await supabase.from('vents').insert([
      { text: sanitized, category: category || 'Other', author_hash: deviceHash }
    ]).select().single();

    if (error) throw error;
    return NextResponse.json({ vent: data });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}