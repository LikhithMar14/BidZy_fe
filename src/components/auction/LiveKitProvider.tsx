//@ts-nocheck
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, RoomEvent, RemoteParticipant, LocalParticipant, Participant } from 'livekit-client';

interface LiveKitContextType {
  room: Room | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  participants: {
    id: string;
    name: string;
    isActive: boolean;
    hasVideo: boolean;
    hasAudio: boolean;
    isSpeaking: boolean;
  }[];
}

const LiveKitContext = createContext<LiveKitContextType>({
  room: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  participants: [],
});

interface LiveKitProviderProps {
  children: React.ReactNode;
  roomName: string;
  token: string;
}

export function LiveKitProvider({ children, roomName, token }: LiveKitProviderProps) {
  const [room] = useState(() => new Room({
    adaptiveStream: true,
    dynacast: true,
    videoCaptureDefaults: {
      resolution: { width: 640, height: 360 }
    }
  }));
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);

  // Connect to room when token is available
  useEffect(() => {
    if (!token || !roomName) return;
    
    const connectToRoom = async () => {
      try {
        setIsConnecting(true);
        setError(null);
        
        await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);
        setIsConnected(true);
      } catch (err) {
        console.error('Failed to connect to LiveKit room:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect to video room');
        setIsConnected(false);
      } finally {
        setIsConnecting(false);
      }
    };
    
    connectToRoom();
    
    return () => {
      room.disconnect();
      setIsConnected(false);
    };
  }, [room, token, roomName]);

  // Update participants list when participants change
  useEffect(() => {
    const updateParticipants = () => {
      const allParticipants = room ? [room.localParticipant, ...room.remoteParticipants] : [];
      
      const mappedParticipants = allParticipants.map((participant) => {
        if (!participant) return null;
        
        const videoTracks = participant.getTracks().filter(track => 
          track.source === 'camera' && track.isSubscribed && !track.isMuted
        );
        
        const audioTracks = participant.getTracks().filter(track => 
          track.source === 'microphone' && track.isSubscribed && !track.isMuted
        );
        
        return {
          id: participant.identity,
          name: participant.name || participant.identity,
          isActive: participant.connectionQuality !== 'poor',
          hasVideo: videoTracks.length > 0,
          hasAudio: audioTracks.length > 0,
          isSpeaking: participant.isSpeaking,
        };
      }).filter(Boolean) as any[];
      
      setParticipants(mappedParticipants);
    };
    
    // Initial update
    updateParticipants();
    
    // Set up event listeners
    const events = [
      RoomEvent.ParticipantConnected,
      RoomEvent.ParticipantDisconnected,
      RoomEvent.TrackSubscribed,
      RoomEvent.TrackUnsubscribed,
      RoomEvent.TrackMuted,
      RoomEvent.TrackUnmuted,
      RoomEvent.ConnectionQualityChanged,
      RoomEvent.ActiveSpeakersChanged,
    ];
    
    events.forEach(event => {
      room.on(event, updateParticipants);
    });
    
    // Clean up event listeners
    return () => {
      events.forEach(event => {
        room.off(event, updateParticipants);
      });
    };
  }, [room]);

  const value = {
    room,
    isConnected,
    isConnecting,
    error,
    participants,
  };

  return (
    <LiveKitContext.Provider value={value}>
      {children}
    </LiveKitContext.Provider>
  );
}

export const useLiveKit = () => useContext(LiveKitContext); 