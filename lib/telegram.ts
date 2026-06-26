export async function sendTelegramNotification(message: string) {
  const token = process.env.OVERSEER_BOT_TOKEN;
  const chatId = process.env.OVERSEER_CHAT_ID;

  if (!token || !chatId) {
    console.log('Telegram credentials missing. Skipping notification.');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('Telegram notification failed:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
}
