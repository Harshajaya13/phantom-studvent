import { NextResponse } from 'next/server';
import { kv, ALL_REQUESTS_KEY, getChatRequestKey } from '@/lib/kv';

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE;

interface ChatRequestData {
  cause: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const passcode = searchParams.get('passcode');

  if (passcode !== ADMIN_PASSCODE) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const requestIds = await kv.smembers(ALL_REQUESTS_KEY);
  if (!requestIds || requestIds.length === 0) {
    return NextResponse.json({ requests: [] });
  }

  const requests = await Promise.all(
    requestIds.map(async (id) => {
      const data = await kv.get<ChatRequestData>(getChatRequestKey(id));
      return data ? { ...data, id } : null;
    })
  );

  const filteredRequests = requests
    .filter((r): r is (ChatRequestData & { id: string }) => r !== null)
    .sort((a, b) => b.created_at - a.created_at);
    
  return NextResponse.json({ requests: filteredRequests });
}

export async function PATCH(request: Request) {
  const { id, passcode, status, ids } = await request.json();

  if (passcode !== ADMIN_PASSCODE) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updateSingle = async (requestId: string) => {
    const data = await kv.get<ChatRequestData>(getChatRequestKey(requestId));
    if (data) {
      data.status = status;
      await kv.set(getChatRequestKey(requestId), data);
    }
  };

  if (ids && Array.isArray(ids)) {
    await Promise.all(ids.map(updateSingle));
  } else {
    await updateSingle(id);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  try {
    const { passcode, id, ids, deleteAllRejected, deleteAllAccepted } = await request.json();

    if (passcode !== ADMIN_PASSCODE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Handle Targeted Deletion (ID or IDs)
    if (ids && Array.isArray(ids)) {
      await Promise.all(ids.map(async (rid) => {
        await kv.del(getChatRequestKey(rid));
        await kv.srem(ALL_REQUESTS_KEY, rid);
      }));
    } else if (id) {
      await kv.del(getChatRequestKey(id));
      await kv.srem(ALL_REQUESTS_KEY, id);
    }

    // 2. Handle Bulk Category Deletion
    if (deleteAllRejected || deleteAllAccepted) {
      const allIds = await kv.smembers(ALL_REQUESTS_KEY);
      await Promise.all(
        allIds.map(async (rid) => {
          const data = await kv.get<ChatRequestData>(getChatRequestKey(rid));
          if (data) {
            if ((deleteAllRejected && data.status === 'rejected') || (deleteAllAccepted && data.status === 'accepted')) {
              await kv.del(getChatRequestKey(rid));
              await kv.srem(ALL_REQUESTS_KEY, rid);
            }
          }
        })
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
