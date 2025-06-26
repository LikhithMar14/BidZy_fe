import { useEffect, useState } from 'react';
import { 
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  RoomName,
  TrackReference
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import '@livekit/components-styles';

interface AuctionVideoRoomProps {
  auctionId: string;
  userName: string | undefined;
  isActive: boolean;
  participants: number;
}

export default function AuctionVideoRoom({ auctionId, userName, isActive, participants }: AuctionVideoRoomProps) {
  const [token, setToken] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(true);

  // Generate token for LiveKit room
  useEffect(() => {
    const getToken = async () => {
      if (!userName || !auctionId || !isActive) return;
      
      setIsConnecting(true);
      setError(null);
      
      try {
        // Create room name from auction ID (ensure it's URL safe)
        const roomName = `auction-${auctionId.replace(/[^a-zA-Z0-9-]/g, '-')}`;
        
        const response = await fetch(
          `/api/livekit-token?room=${roomName}&username=${encodeURIComponent(userName)}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get token');
        }
        
        const data = await response.json();
        setToken(data.token);
      } catch (err) {
        console.error('Error getting token:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect to video room');
      } finally {
        setIsConnecting(false);
      }
    };
    
    getToken();
  }, [auctionId, userName, isActive]);

  // Custom video renderer with minimalistic design
  function VideoRenderer() {
    // Get all camera and screen share tracks
    const tracks = useTracks(
      [
        { source: Track.Source.Camera, withPlaceholder: true },
        { source: Track.Source.ScreenShare, withPlaceholder: false },
      ],
      { onlySubscribed: false }
    );

    if (!showVideo) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl">
          <div className="text-center">
            <VideoOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Video paused</p>
            <button 
              onClick={() => setShowVideo(true)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-full"
            >
              Show Video
            </button>
          </div>
        </div>
      );
    }

    return (
      <GridLayout 
        tracks={tracks} 
        style={{ height: '100%', borderRadius: '0.75rem', overflow: 'hidden' }}
      >
        <ParticipantTile />
      </GridLayout>
    );
  }

  if (!isActive) {
    return (
      <div className="rounded-xl bg-gray-100 p-6 text-center h-64 flex flex-col items-center justify-center">
        <Users className="w-10 h-10 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-700">Video Room</h3>
        <p className="text-gray-500 text-sm mt-1">
          Live video will be available when the auction is active
        </p>
      </div>
    );
  }

  if (!userName) {
    return (
      <div className="rounded-xl bg-gray-100 p-6 text-center h-64 flex flex-col items-center justify-center">
        <Users className="w-10 h-10 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-700">Video Room</h3>
        <p className="text-gray-500 text-sm mt-1">
          Please log in to join the video room
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center h-64 flex flex-col items-center justify-center">
        <VideoOff className="w-10 h-10 text-red-400 mb-3" />
        <h3 className="text-lg font-medium text-red-700">Connection Error</h3>
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      </div>
    );
  }

  if (isConnecting || !token) {
    return (
      <div className="rounded-xl bg-gray-100 p-6 text-center h-64 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3"></div>
        <h3 className="text-lg font-medium text-gray-700">Connecting...</h3>
        <p className="text-gray-500 text-sm mt-1">
          Setting up the video room
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-lg border border-gray-100" style={{ height: '400px' }}>
      <div className="relative h-full">
        <LiveKitRoom
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          connect={true}
          video={true}
          audio={true}
          data-lk-theme="default"
        >
          {/* Video Grid */}
          <div className="h-full relative">
            <VideoRenderer />
            
            {/* Room Info Overlay */}
            <div className="absolute top-3 left-3 z-10">
              <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-md">
                <Users className="w-3 h-3 mr-1" />
                {participants} Watching
              </Badge>
            </div>
            
            {/* Controls Overlay */}
            <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center">
              <div className="bg-black/50 backdrop-blur-md rounded-full px-2 py-1">
                <ControlBar
                  controls={{
                    camera: true,
                    microphone: true,
                    screenShare: false,
                    leave: false
                  }}
                />
              </div>
            </div>
            
            {/* Toggle Video Button */}
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <VideoOff className="w-4 h-4" />
            </button>
          </div>
          
          {/* Audio Renderer */}
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </div>
  );
} 