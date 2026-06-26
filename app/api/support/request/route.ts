import { NextResponse } from 'next/server';
import { kv, ALL_REQUESTS_KEY, getChatRequestKey } from '@/lib/kv';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hardwareId = searchParams.get('hardwareId');

  if (!hardwareId) {
    return NextResponse.json({ error: 'Missing Hardware ID' }, { status: 400 });
  }

  const data = await kv.get(getChatRequestKey(hardwareId));
  return NextResponse.json({ request: data || { status: 'none' } });
}

export async function POST(request: Request) {
  const { hardwareId, cause } = await request.json();

  if (!hardwareId || !cause || cause.length < 10) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const newRequest = {
    cause,
    status: 'pending',
    created_at: Date.now(),
  };

  await kv.set(getChatRequestKey(hardwareId), newRequest);
  await kv.sadd(ALL_REQUESTS_KEY, hardwareId);

  // 🦉 Notify Overseer via Telegram
  try {
    const { sendTelegramNotification } = await import('@/lib/telegram');
    const telegramMsg = `
<b>🤝 NEW CHAT REQUEST</b>
-------------------------
<b>Hardware ID:</b> <code>${hardwareId.slice(0, 12)}...</code>
<b>Reason:</b>
<i>"${cause}"</i>
-------------------------
<a href="https://studvent.vercel.app/admin">Open Command Deck</a>
    `;
    sendTelegramNotification(telegramMsg).catch(console.error);
  } catch (e) {
    console.error('Telegram Chat Notify Failed:', e);
  }

  return NextResponse.json({ success: true });
}
