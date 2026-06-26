import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const content = 'google.com, pub-5779094273402172, DIRECT, f08c47fec0942fa0';
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
