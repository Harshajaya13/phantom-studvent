import { NextResponse } from 'next/server';
import { kv, REST_MODE_KEY } from '@/lib/kv';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message || !message.text) return NextResponse.json({ ok: true });

    const text = message.text.toLowerCase();
    const chatId = message.chat.id.toString();
    const overseerChatId = process.env.OVERSEER_CHAT_ID;

    // 🛡️ Security: Only respond to the Master Admin
    if (chatId !== overseerChatId) {
      console.log('Unauthorized Telegram request from:', chatId);
      return NextResponse.json({ ok: true });
    }

    const reportCmd = text.includes('/stats') || text.includes('traffic') || text.includes('status');
    const quotaCmd = text.includes('/quota');
    const restOnCmd = text.includes('/rest_on');
    const restOffCmd = text.includes('/rest_off');
    const helpCmd = text.includes('/help') || text.includes('/start');

    let replyText = '';

    if (helpCmd) {
      replyText = `
<b>🛠 OVERSEER COMMAND DECK</b>
-------------------------
<b>📊 /stats</b> - Full Traffic & Quota Report
<b>🛡️ /quota</b> - Quick Quota Safety Check
<b>💤 /rest_on</b> - Activate Read-Only Mode
<b>🟢 /rest_off</b> - Deactivate Read-Only Mode
<b>❓ /help</b> - Show this menu
-------------------------
<i>Awaiting your command, Overseer.</i>
      `;
    } else if (reportCmd || quotaCmd) {
      const today = new Date().toISOString().split('T')[0];
      const quotaKey = `global_quota:${today}`;
      const visitorKey = `unique_visitors:${today}`;

      const quotaRaw = await kv.get<number>(quotaKey);
      const visitorsRaw = await kv.scard(visitorKey);
      const isRestMode = await kv.get(REST_MODE_KEY);

      const quota = quotaRaw || 0;
      const visitors = visitorsRaw || 0;

      if (reportCmd) {
        replyText = `
<b>📊 OVERSEER REPORT (${today})</b>
-------------------------
<b>👥 Unique Visitors:</b> ${visitors}
<b>🔥 Total API Hits:</b> ${quota}
<b>💤 Rest Mode:</b> ${isRestMode ? '🔴 ON (Read-Only)' : '🟢 OFF (Active)'}
<b>🛡️ Quota Safety:</b> ${((quota / 1000) * 100).toFixed(1)}%
-------------------------
        `;
      } else {
        replyText = `<b>🛡️ QUOTA CHECK:</b> ${quota}/1000 used (${((quota / 1000) * 100).toFixed(1)}%)`;
      }
    } else if (restOnCmd || restOffCmd) {
      const newState = restOnCmd;
      await kv.set(REST_MODE_KEY, newState);
      replyText = `<b>${newState ? '💤 SYSTEM REST ACTIVATED' : '🟢 SYSTEM BROUGHT ONLINE'}</b>\nMode: ${newState ? 'Read-Only' : 'Full Access'}`;
    }

    if (replyText) {
      const token = process.env.OVERSEER_BOT_TOKEN;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: replyText,
          parse_mode: 'HTML',
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
