import { NextResponse } from 'next/server';
import { kv, REST_MODE_KEY } from '@/lib/kv';

export async function GET() {
  const isRestMode = await kv.get(REST_MODE_KEY);
  return NextResponse.json({ isRestMode: isRestMode === true });
}

export async function POST(request: Request) {
  const { passcode, enabled } = await request.json();

  if (passcode !== process.env.ADMIN_PASSCODE && passcode !== 'harshavardhan@bora13') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await kv.set(REST_MODE_KEY, enabled);
  return NextResponse.json({ success: true, isRestMode: enabled });
}
