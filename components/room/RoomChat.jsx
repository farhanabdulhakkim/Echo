"use client";

import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, MessageSquare } from "lucide-react";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";

function ChatInputForm({ roomId, currentUser, isEnded, onMessageSent, onMessageSuccess, onMessageError }) {
  const [input, setInput] = useState("");
  const [supabase] = useState(() => createClient());

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isEnded) return;

    setInput("");
    
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const optimisticMsg = {
      id: tempId,
      room_id: roomId,
      user_id: currentUser.id,
      message: trimmed.substring(0, 500),
      created_at: new Date().toISOString(),
      users: { display_name: currentUser?.user_metadata?.display_name || "You" },
      isSending: true,
      isFailed: false,
    };
    onMessageSent(optimisticMsg);
    
    try {
      const { data: insertedMsg, error: sendError } = await supabase
        .from("room_messages")
        .insert({
          room_id: roomId,
          user_id: currentUser.id,
          message: trimmed.substring(0, 500)
        })
        .select(`id, message, created_at, user_id, users(display_name)`)
        .single();

      if (sendError) throw sendError;
      onMessageSuccess(tempId, insertedMsg);
    } catch (e) {
      onMessageError(tempId, e.message || "Failed to send");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <>
      {isEnded ? (
        <div className="p-2 text-center text-sm text-gray-500 font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg">
          Room has ended. Chat is closed.
        </div>
      ) : (
        <form onSubmit={handleSend} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-echo resize-none"
            rows={1}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-echo hover:bg-echo/10 rounded-full disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </>
  );
}

export function RoomChat({ roomId, currentUser, roomStatus }) {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Mobile drawer toggle
  const messagesEndRef = useRef(null);
  const [supabase] = useState(() => createClient());
  const isEnded = roomStatus === "ended";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from("room_messages")
          .select("id, message, created_at, user_id, users(display_name)")
          .eq("room_id", roomId)
          .order("created_at", { ascending: false })
          .limit(100);
        
        if (dbError) throw dbError;
        // Reverse to get chronological order (oldest -> newest)
        setMessages(data.reverse());
      } catch (e) {
        console.error("Failed to load messages", e);
      }
    };

    fetchMessages();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`room_messages_${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_messages",
        },
        async (payload) => {
          const rawMsg = payload.new;
          if (rawMsg.room_id !== roomId) return;
          
          // 1. Immediately insert the message to eliminate latency
          setMessages((prev) => {
            if (prev.some(m => m.id === rawMsg.id)) return prev;
            
            // Try to find the user's name from previous messages for instant display
            const previousMsgFromUser = prev.find(m => m.user_id === rawMsg.user_id && m.users?.display_name);
            const optimisticName = previousMsgFromUser ? previousMsgFromUser.users.display_name : "User...";
            
            const optimisticMsg = {
              ...rawMsg,
              users: { display_name: optimisticName }
            };
            return [...prev, optimisticMsg];
          });

          // 2. Fetch the actual display name in the background and silently update
          const { data: fullMessage } = await supabase
            .from("room_messages")
            .select("id, message, created_at, user_id, users(display_name)")
            .eq("id", rawMsg.id)
            .single();
            
          if (fullMessage) {
            setMessages((prev) => 
              prev.map(m => (m.id === fullMessage.id ? fullMessage : m))
            );
          }
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.log(`[RoomChat] realtime status: ${status}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  // Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleMessageSent = (optimisticMsg) => {
    setMessages((prev) => [...prev, optimisticMsg]);
  };

  const handleMessageSuccess = (tempId, realMsg) => {
    setMessages((prev) => {
      // If realtime already delivered it, just drop the temp duplicate
      if (prev.some((m) => m.id === realMsg.id)) {
        return prev.filter((m) => m.id !== tempId);
      }
      return prev.map((m) => (m.id === tempId ? realMsg : m));
    });
  };

  const handleMessageError = (tempId, errorMsg) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === tempId ? { ...m, isSending: false, isFailed: true } : m))
    );
  };

  return (
    <>
      {/* Mobile Toggle Button (only visible when chat is closed on mobile) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden fixed bottom-4 right-4 z-40 bg-echo text-white p-3 rounded-full shadow-lg"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}

      {/* Desktop Chat Panel */}
      <div className="hidden md:block w-80 h-[80vh] rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-echo" /> Room Chat
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-10">No messages yet. Say hello!</p>
            )}
            
            {messages.map((msg) => {
              const isMe = msg.user_id === currentUser.id;
              const name = msg.users?.display_name || "Unknown";
              const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${msg.isSending ? 'opacity-80' : ''}`}>
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {!isMe && <div className="shrink-0 mb-5"><InitialsAvatar name={name} size="sm" /></div>}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] text-gray-400 font-medium px-1">{name}</span>
                      <div className={`px-3 py-2 rounded-2xl text-sm ${isMe ? 'bg-echo text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm'} ${msg.isFailed ? 'border border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' : ''}`}>
                        {msg.message}
                      </div>
                      {msg.isFailed ? (
                        <span className="text-[10px] text-red-500 font-bold px-1 mt-0.5">Failed to send</span>
                      ) : (
                        <span className="text-[10px] text-gray-400 px-1 mt-0.5">{msg.isSending ? 'Sending...' : time}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <ChatInputForm 
              roomId={roomId} 
              currentUser={currentUser} 
              isEnded={isEnded} 
              onMessageSent={handleMessageSent} 
              onMessageSuccess={handleMessageSuccess}
              onMessageError={handleMessageError}
            />
          </div>
        </div>
      </div>

      {/* Mobile Chat Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-black/50">
          <div className="flex-1" onClick={() => setIsOpen(false)} />
          <div className="h-[75vh] bg-white dark:bg-gray-900 rounded-t-2xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-echo" /> Room Chat
              </h3>
              <button className="text-gray-500" onClick={() => setIsOpen(false)}>Close</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <p className="text-center text-gray-400 text-sm mt-10">No messages yet. Say hello!</p>
              )}
              {messages.map((msg) => {
                const isMe = msg.user_id === currentUser.id;
                const name = msg.users?.display_name || "Unknown";
                const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${msg.isSending ? 'opacity-80' : ''}`}>
                    <div className="flex items-end gap-2 max-w-[85%]">
                      {!isMe && <div className="shrink-0 mb-5"><InitialsAvatar name={name} size="sm" /></div>}
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-gray-400 font-medium px-1">{name}</span>
                        <div className={`px-3 py-2 rounded-2xl text-sm ${isMe ? 'bg-echo text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm'} ${msg.isFailed ? 'border border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' : ''}`}>
                          {msg.message}
                        </div>
                        {msg.isFailed ? (
                          <span className="text-[10px] text-red-500 font-bold px-1 mt-0.5">Failed to send</span>
                        ) : (
                          <span className="text-[10px] text-gray-400 px-1 mt-0.5">{msg.isSending ? 'Sending...' : time}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <ChatInputForm 
                roomId={roomId} 
                currentUser={currentUser} 
                isEnded={isEnded} 
                onMessageSent={handleMessageSent} 
                onMessageSuccess={handleMessageSuccess}
                onMessageError={handleMessageError}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
