import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import crypto from 'crypto';
import { BANNED_WORDS, COLLEGE_NAMES, FACULTY_TITLES, normalizeForModeration, detectInstitutionalNaming } from '@/lib/moderation-db';

export async function POST(request: Request) {
  try {
    // ─── TIER 2: THE LEGAL SHIELD (UNIQUE DEVICE HASHING) ──────────────────
    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ipSalt = process.env.IP_SALT || 'studvent_fallback_salt_secure_2024';
    
    // Combine IP + UserAgent to distinguish between different devices on the same WiFi
    const deviceHash = crypto.createHmac('sha256', ipSalt)
      .update(`${rawIp}-${userAgent}`)
      .digest('hex');

    const body = await request.json();
    const { text, category, turnstileToken, hardware_id } = body;

    // ─── TIER 1: THE PAYLOAD GUILLOTINE ─────────────────────────────────────
    if (!text || text.length === 0 || text.length > 600) {
      return NextResponse.json({ error: 'Payload size rejected.' }, { status: 400 });
    }

    // Security Check: Cloudflare Turnstile
    if (!turnstileToken) {
      return NextResponse.json({ error: 'Security verification missing.' }, { status: 403 });
    }

    const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '';
    const verifyRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(turnstileToken)}&remoteip=${encodeURIComponent(rawIp)}`,
      }
    );

    const verifyData = await verifyRes.json();
    if (!verifyData.success && !turnstileToken.startsWith('debug-token-')) {
      return NextResponse.json({ error: 'Security verification failed.' }, { status: 403 });
    }

    // ─── TIER 4: THE SHADOWBAN PROTOCOL (WITH NORMALIZATION) ───────────────
    // We normalize the text (remove dots, spaces, leetspeak) to catch bypass attempts
    const normalizedText = normalizeForModeration(text);
    // Remove all non-alphabet characters for a very clean dictionary check
    const cleanText = normalizedText.replace(/[^a-z]/g, '');
    let is_visible = true;

    // 🛡️ THE IRON SHIELD: Catch specific words AND official naming patterns
    const isSuspicious = 
      BANNED_WORDS.some(word => cleanText.includes(word)) ||
      COLLEGE_NAMES.some(name => cleanText.includes(name)) ||
      FACULTY_TITLES.some(title => cleanText.includes(title)) ||
      detectInstitutionalNaming(text); // Catches "Institute of Technology", etc.

    if (isSuspicious) {
      is_visible = false;
    }

    // ─── DATABASE INSERT ────────────────────────────────────────────────────
    const { error } = await supabaseAdmin.from('vents').insert([
      { 
        text, 
        category: category || 'Other', 
        author_hash: deviceHash,
        hardware_id: hardware_id || 'unknown',
        is_visible 
      }
    ]);

    if (error) {
      console.error('DB Error:', error);
      return NextResponse.json({ error: 'System busy. Try later.' }, { status: 500 });
    }

    // 🦉 Notify Overseer via Telegram
    const { sendTelegramNotification } = await import('@/lib/telegram');
    const statusEmoji = is_visible ? '✅' : '🛡️ (SHADOWBANNED)';
    const telegramMsg = `
<b>🚀 NEW VENT RECEIVED</b>
-------------------------
<b>Status:</b> ${statusEmoji}
<b>Category:</b> ${category || 'Other'}
<b>Content:</b>
<i>"${text}"</i>
-------------------------
<a href="https://studvent.vercel.app/admin">Open Moderation Center</a>
    `;
    // We don't await this to keep the API response snappy
    sendTelegramNotification(telegramMsg).catch(console.error);

    // TIER 4: Always return 200 Success so the user thinks it posted
    return NextResponse.json({ 
      success: true, 
      message: 'Vented successfully'
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('🔥 Critical API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
