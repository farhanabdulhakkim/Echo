import { RoomServiceClient } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req) {
  try {
    const supabase = await createClient();
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId, participantIdentity, action } = await req.json();

    if (!roomId || !participantIdentity || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Verify requester is host
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('host_id')
      .eq('id', roomId)
      .single();

    if (roomError || !room || room.host_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: Only host can manage participants' }, { status: 403 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    // Convert wsUrl to httpUrl for RoomServiceClient
    const httpUrl = wsUrl.replace('wss://', 'https://').replace('ws://', 'http://');
    
    const roomService = new RoomServiceClient(httpUrl, apiKey, apiSecret);
    const livekitRoomName = `echo_${roomId}`;

    const canPublish = action === 'promote';

    await roomService.updateParticipant(livekitRoomName, participantIdentity, undefined, {
      canPublish,
      canSubscribe: true,
      canPublishData: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating participant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
