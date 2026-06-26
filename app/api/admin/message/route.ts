import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, type } = await req.json();

    if (!message || message.length < 5) {
      return NextResponse.json({ error: 'Message too short' }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error('❌ Missing Telegram Environment Variables');
      return NextResponse.json({ error: 'Messaging is temporarily unavailable' }, { status: 500 });
    }

    const prefix = type === 'suggestion' ? '💡 [SUGGESTION]' : '🤝 [ASSURANCE]';

    // Forwarding the message to Telegram
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `${prefix} New Anonymous Message:\n\n"${message}"`,
        parse_mode: 'Markdown',
      }),
    });

    if (!tgRes.ok) {
      const errorData = await tgRes.json();
      console.error('❌ Telegram API Error:', errorData);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('🔥 Server Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
