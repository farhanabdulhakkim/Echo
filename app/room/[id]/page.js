"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
  useLocalParticipant,
  useRoomContext,
  useDisconnectButton,
  useIsSpeaking,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Mic, MicOff, Hand, HandMetal, Users, X, Check, PhoneOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { AppShell } from "@/components/layout/AppShell";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { Button } from "@/components/ui/button";
import { RoomChat } from "@/components/room/RoomChat";

function ParticipantAvatar({ participant, isHost, isCurrentUserHost, onDemote }) {
  const isSpeaking = useIsSpeaking(participant);
  const name = participant.name || participant.identity;
  const isMuted = !participant.isMicrophoneEnabled;
  
  return (
    <div className="flex flex-col items-center gap-2 p-2 relative group">
      <div className={`relative rounded-full p-1 transition-colors ${isSpeaking ? 'bg-echo' : 'bg-transparent'}`}>
        <InitialsAvatar name={name} size="lg" />
        {isHost && (
          <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
            HOST
          </div>
        )}
        {isMuted && (
          <div className="absolute bottom-0 right-0 bg-red-500 rounded-full p-1 border-2 border-white dark:border-gray-900">
            <MicOff className="w-3 h-3 text-white" />
          </div>
        )}
        {isCurrentUserHost && !isHost && participant.permissions?.canPublish && (
          <button 
            onClick={() => onDemote(participant.identity)}
            className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
            title="Revoke Speaker Access"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[80px]">
        {name.split('@')[0]}
      </span>
    </div>
  );
}

function RoomInterface({ roomMeta, isHost }) {
  const router = useRouter();
  const room = useRoomContext();
  const participants = useParticipants();
  const { localParticipant, isMicrophoneEnabled: isMicOn } = useLocalParticipant();
  const [raisedHands, setRaisedHands] = useState([]);
  const [micError, setMicError] = useState("");
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  
  const speakers = participants.filter(p => p.permissions?.canPublish);
  const listeners = participants.filter(p => !p.permissions?.canPublish);
  const isSpeaker = localParticipant.permissions?.canPublish;

  // Handle data channels for raise hand
  useEffect(() => {
    if (!room) return;
    const handleData = (payload, participant, kind, topic) => {
      const strData = new TextDecoder().decode(payload);
      if (topic === "RAISE_HAND") {
        const data = JSON.parse(strData);
        if (data.action === "raise") {
          setRaisedHands(prev => [...prev.filter(p => p.identity !== participant.identity), participant]);
        } else if (data.action === "lower") {
          setRaisedHands(prev => prev.filter(p => p.identity !== participant.identity));
        }
      }
    };
    room.on("dataReceived", handleData);
    return () => { room.off("dataReceived", handleData); };
  }, [room]);

  const handleManageParticipant = async (participantIdentity, action) => {
    try {
      await fetch('/api/livekit/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: roomMeta.id, participantIdentity, action })
      });
      if (action === 'promote') {
        setRaisedHands(prev => prev.filter(x => x.identity !== participantIdentity));
      }
    } catch (e) {
      console.error("Failed to manage participant", e);
    }
  };

  const toggleMic = async () => {
    try {
      setMicError("");
      if (isMicOn) {
        await localParticipant.setMicrophoneEnabled(false);
      } else {
        await localParticipant.setMicrophoneEnabled(true);
      }
    } catch (err) {
      setMicError("Microphone permission denied or unavailable.");
    }
  };

  const handleRaiseHand = async () => {
    if (!room) return;
    const payload = new TextEncoder().encode(JSON.stringify({ action: hasRaisedHand ? "lower" : "raise" }));
    await localParticipant.publishData(payload, { reliable: true, topic: "RAISE_HAND" });
    setHasRaisedHand(!hasRaisedHand);
  };

  const handleEndRoom = async () => {
    if (!isHost) return;
    const supabase = createClient();
    await supabase.from('rooms').update({ status: 'ended', ended_at: new Date().toISOString() }).eq('id', roomMeta.id);
    room.disconnect();
    router.push('/rooms');
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            {roomMeta.title}
          </h1>
          <p className="text-xs text-gray-500 mt-1">{roomMeta.topic_name || "Echo Live Room"}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
          <Users className="w-3.5 h-3.5" />
          {participants.length}
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-8 relative">
        {micError && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg shadow-md text-sm flex items-center gap-2">
            <MicOff className="w-4 h-4" /> {micError}
            <button onClick={() => setMicError("")}><X className="w-3 h-3 hover:opacity-70"/></button>
          </div>
        )}
        
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Speakers ({speakers.length})</h2>
          <div className="flex flex-wrap gap-4">
            {speakers.map(p => (
              <ParticipantAvatar 
                key={p.identity} 
                participant={p} 
                isHost={p.identity === roomMeta.host_id}
                isCurrentUserHost={isHost}
                onDemote={(id) => handleManageParticipant(id, 'demote')}
              />
            ))}
          </div>
        </div>

        {listeners.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4 border-t border-gray-100 dark:border-gray-800 pt-6">Listeners ({listeners.length})</h2>
            <div className="flex flex-wrap gap-4 opacity-70">
              {listeners.map(p => (
                <ParticipantAvatar 
                  key={p.identity} 
                  participant={p} 
                  isHost={false}
                  isCurrentUserHost={isHost}
                  onDemote={() => {}} 
                />
              ))}
            </div>
          </div>
        )}

        {isHost && raisedHands.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800/50 mt-4">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-3 flex items-center gap-2">
              <Hand className="w-4 h-4" /> Raised Hands
            </h3>
            <div className="space-y-2">
              {raisedHands.map(p => (
                <div key={p.identity} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-md text-sm">
                  <span>{p.name || p.identity}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleManageParticipant(p.identity, 'promote')} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Accept"><Check className="w-4 h-4"/></button>
                    <button onClick={() => setRaisedHands(prev => prev.filter(x => x.identity !== p.identity))} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Reject"><X className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center relative">
        <div className="flex gap-2">
          {isSpeaker ? (
             <Button variant={isMicOn ? "default" : "secondary"} onClick={toggleMic} className="rounded-full w-12 h-12 p-0 flex items-center justify-center">
               {isMicOn ? <Mic className="w-5 h-5"/> : <MicOff className="w-5 h-5"/>}
             </Button>
          ) : (
            <Button variant={hasRaisedHand ? "default" : "outline"} onClick={handleRaiseHand} className="rounded-full h-12 px-6 flex items-center gap-2">
               {hasRaisedHand ? <HandMetal className="w-4 h-4" /> : <Hand className="w-4 h-4" />} 
               {hasRaisedHand ? "Cancel Hand" : "Raise Hand"}
             </Button>
          )}
        </div>
        <div className="flex gap-2 relative">
          {isHost && (
            showEndConfirm ? (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-1 pr-4 rounded-full border border-red-200 dark:border-red-800 absolute right-0 -top-2 translate-y-[-100%] shadow-lg">
                <span className="text-sm font-medium text-red-800 dark:text-red-400 pl-3">End Room?</span>
                <Button variant="ghost" size="sm" onClick={() => setShowEndConfirm(false)} className="h-8 text-gray-500">Cancel</Button>
                <Button variant="destructive" size="sm" onClick={handleEndRoom} className="h-8">Confirm</Button>
              </div>
            ) : (
              <Button variant="destructive" onClick={() => setShowEndConfirm(true)} className="h-12 px-6 rounded-full font-medium">End Room</Button>
            )
          )}
          {!isHost && (
            <Button variant="secondary" onClick={() => { room.disconnect(); router.push('/rooms'); }} className="h-12 w-12 p-0 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50">
              <PhoneOff className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LiveRoomPage() {
  const { id: roomId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [roomMeta, setRoomMeta] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth"); return; }

    const initializeRoom = async () => {
      try {
        const supabase = createClient();
        const { data: roomData, error: dbError } = await supabase.from('rooms').select('*').eq('id', roomId).single();
        
        if (dbError || !roomData) throw new Error("Room not found");
        if (roomData.status === 'ended') throw new Error("This room has ended");
        
        setRoomMeta(roomData);

        // Transition status to live if host
        if (roomData.host_id === user.id && roomData.status === 'upcoming') {
          await supabase.from('rooms').update({ status: 'live' }).eq('id', roomId);
        }

        const res = await fetch("/api/livekit/token", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId, name: user.email }),
        });
        const data = await res.json();
        
        if (data.token) {
          setToken(data.token);
        } else {
          throw new Error(data.error || "Failed to get token");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    initializeRoom();
  }, [user, authLoading, roomId, router]);

  const [disconnected, setDisconnected] = useState(false);

  if (authLoading || (!token && !error)) {
    return (
      <AppShell showRightSidebar={false}>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-8 h-8 border-4 border-echo border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Connecting to live room...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showRightSidebar={false}>
      <div className="max-w-6xl mx-auto flex gap-4 h-full">
        {/* Main Room Area */}
        <div className="flex-1 min-w-0">
          {(error || disconnected) ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900 h-full">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2"><X className="w-8 h-8"/></div>
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">{disconnected ? "Disconnected" : "Audio Connection Failed"}</h2>
              <p className="text-gray-500 text-center max-w-md">{error || "You have been disconnected from the audio room. You can still use the chat."}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Retry Connection</Button>
            </div>
          ) : (
            <LiveKitRoom
              video={false}
              audio={false}
              token={token}
              serverUrl={(process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://echo-q6brxkdb.livekit.cloud").trim()}
              connect={true}
              onError={(err) => setError(err.message)}
            >
              <RoomAudioRenderer />
              <RoomInterface roomMeta={roomMeta} isHost={roomMeta?.host_id === user?.id} />
            </LiveKitRoom>
          )}
        </div>
        
        {/* Chat Area */}
        <RoomChat roomId={roomId} currentUser={user} roomStatus={roomMeta?.status} />
      </div>
    </AppShell>
  );
}
