'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuctionWebSocket, useBidHistory } from '../../hooks/useAuctionWebSocket';
import { AuctionConnection, Bid as LegacyBid } from '../../connecting/ws-singleton';
import { Bid } from '@/types/bids';
import { getAuctionBidsDataLive } from '@/connecting/auction';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Video, VideoOff, Maximize2, Minimize2 } from 'lucide-react';
import AuctionVideoRoom from './AuctionVideoRoom';
import ParticipantsList from './ParticipantsList';

interface AuctionRoomProps {
  auctionId: string;
  token: string;
  userId: string;
  userName: string;
  isActive: boolean;
  participants: number;
}

interface BidLeaderboardEntry {
  bidder: string;
  totalBids: number;
  highestBid: number;
  latestBid: number;
}

export const AuctionRoom: React.FC<AuctionRoomProps> = ({
  auctionId,
  token,
  userId,
  userName,
  isActive,
  participants,
}) => {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [liveBids, setLiveBids] = useState<Bid[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [bidLeaderboard, setBidLeaderboard] = useState<BidLeaderboardEntry[]>([]);
  const [lastBidId, setLastBidId] = useState<string>('');
  const [bidStreak, setBidStreak] = useState<number>(0);
  const [currentLeader, setCurrentLeader] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isAuctionActive, setIsAuctionActive] = useState<boolean>(true);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const bidTimelineRef = useRef<HTMLDivElement>(null);
  const [showVideo, setShowVideo] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mockParticipants, setMockParticipants] = useState<any[]>([]);
  
  const {
    isConnected,
    isConnecting,
    connectionError,
    auctionData,
    currentBids,
    participantCount,
    connect,
    disconnect,
    join,
    leave,
    placeBid,
    getAuctionData,
  } = useAuctionWebSocket();

  const { bids, addBid, clearBids } = useBidHistory(20);

  // Enhanced bid polling function
  const pollBids = useCallback(async () => {
    if (!isAuctionActive || !auctionId) return;
    
    try {
      const bidsData = await getAuctionBidsDataLive(auctionId);
      if (bidsData && bidsData.length > 0) {
        setLiveBids(bidsData);
        
        // Check for new bids and create animations
        const latestBid = bidsData[bidsData.length - 1];
        if (latestBid.bid_id !== lastBidId) {
          setLastBidId(latestBid.bid_id);
          
          // Animate new bid
          if (bidTimelineRef.current) {
            bidTimelineRef.current.scrollTop = 0;
          }
          
          // Update current leader
          setCurrentLeader(latestBid.bidder);
          
          // Show exciting toast for new bid
          toast.success(`🔥 New bid: $${latestBid.amount} by ${latestBid.bidder}!`, {
            duration: 3000,
          });
          
          // Update bid streak for current user
          if (latestBid.bidder === userName) {
            setBidStreak(prev => prev + 1);
          } else {
            setBidStreak(0);
          }
        }
        
        // Update leaderboard
        updateLeaderboard(bidsData);
      }
    } catch (error) {
      console.error('Error polling bids:', error);
    }
  }, [auctionId, isAuctionActive, lastBidId, userName]);

  // Update leaderboard function
  const updateLeaderboard = (bids: Bid[]) => {
    const leaderboardMap = new Map<string, BidLeaderboardEntry>();
    
    bids.forEach(bid => {
      const existing = leaderboardMap.get(bid.bidder);
      if (existing) {
        existing.totalBids += 1;
        existing.highestBid = Math.max(existing.highestBid, bid.amount);
        existing.latestBid = bid.amount;
      } else {
        leaderboardMap.set(bid.bidder, {
          bidder: bid.bidder,
          totalBids: 1,
          highestBid: bid.amount,
          latestBid: bid.amount,
        });
      }
    });
    
    const sortedLeaderboard = Array.from(leaderboardMap.values())
      .sort((a, b) => b.highestBid - a.highestBid);
    
    setBidLeaderboard(sortedLeaderboard);
  };

  // Start/stop polling based on auction status
  useEffect(() => {
    if (isAuctionActive && auctionId) {
      setIsPolling(true);
      pollBids(); // Initial poll
      pollingIntervalRef.current = setInterval(pollBids, 2000); // Poll every 2 seconds
    } else {
      setIsPolling(false);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isAuctionActive, auctionId, pollBids]);

  // Connect to auction on mount
  useEffect(() => {
    const connection: AuctionConnection = {
      auctionId,
      token,
      userId,
      userName,
    };

    const initializeConnection = async () => {
      const success = await connect(connection);
      if (success) {
        join();
        getAuctionData();
        toast.success('🎯 Welcome to the auction arena!');
      } else {
        toast.error('Failed to connect to auction room');
      }
    };

    initializeConnection();

    return () => {
      leave();
      disconnect();
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [auctionId, token, userId, userName, connect, join, leave, disconnect, getAuctionData]);

  // Handle bid placement with enhanced feedback
  const handlePlaceBid = async () => {
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    if (!isConnected) {
      toast.error('Not connected to auction');
      return;
    }

    const currentHighest = liveBids.length > 0 ? liveBids[liveBids.length - 1].amount : (auctionData?.startingPrice || 0);
    const minBid = currentHighest + (auctionData?.increment || 1);
    
    if (amount < minBid) {
      toast.error(`Bid must be at least $${minBid.toFixed(2)}`);
      return;
    }

    setIsPlacingBid(true);
    try {
      const result = placeBid(amount);
      if (result.success) {
        toast.success(`🚀 Bid placed successfully! $${amount.toFixed(2)}`, {
          duration: 4000,
        });
        setBidAmount('');
        // Trigger immediate poll to get updated data
        setTimeout(pollBids, 500);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to place bid');
    } finally {
      setIsPlacingBid(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getBidderDisplayName = (bidder: string) => {
    if (bidder === userName) return `${bidder} (You)`;
    return bidder;
  };

  // Generate some mock participants data for the participants list
  useEffect(() => {
    if (userName && userId) {
      const currentUser = {
        id: userId,
        name: userName,
        isActive: true,
        hasVideo: true,
        hasAudio: true,
        isSpeaking: false
      };
      
      // Generate random participants based on the participants count
      const otherParticipants = Array.from({ length: Math.min(participants - 1, 10) }, (_, i) => ({
        id: `participant-${i}`,
        name: `User ${i + 1}`,
        isActive: Math.random() > 0.2, // 80% chance of being active
        hasVideo: Math.random() > 0.4, // 60% chance of having video
        hasAudio: Math.random() > 0.3, // 70% chance of having audio
        isSpeaking: i === 0 && Math.random() > 0.7 // First user might be speaking
      }));
      
      setMockParticipants([currentUser, ...otherParticipants]);
    } else {
      // If no user, just generate mock participants
      const randomParticipants = Array.from({ length: Math.min(participants, 10) }, (_, i) => ({
        id: `participant-${i}`,
        name: `User ${i + 1}`,
        isActive: Math.random() > 0.2,
        hasVideo: Math.random() > 0.4,
        hasAudio: Math.random() > 0.3,
        isSpeaking: i === 0 && Math.random() > 0.7
      }));
      
      setMockParticipants(randomParticipants);
    }
  }, [participants, userName, userId]);

  const toggleVideo = () => {
    setShowVideo(!showVideo);
    toast.info(showVideo ? 'Video paused' : 'Video resumed');
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-primary/20 mx-auto animate-pulse"></div>
          </div>
          <p className="text-lg font-semibold">Connecting to auction arena...</p>
          <p className="text-sm text-muted-foreground">Preparing your bidding experience</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isExpanded ? 'fixed inset-0 z-50 p-4 bg-black/80' : ''}`}
    >
      <Card className={`border-0 shadow-lg overflow-hidden ${
        isExpanded ? 'h-full max-w-6xl mx-auto' : ''
      }`}>
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Live Auction Room
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20"
                onClick={toggleVideo}
              >
                {showVideo ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20"
                onClick={toggleExpand}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className={`grid ${isExpanded ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'} gap-0`}>
            {/* Main video area */}
            <div className={`${isExpanded ? 'lg:col-span-3' : ''} ${showVideo ? '' : 'hidden'}`}>
              <AuctionVideoRoom
                auctionId={auctionId}
                userName={userName}
                isActive={isActive}
                participants={participants}
              />
            </div>
            
            {/* Participants sidebar */}
            <div className={`${showVideo && isExpanded ? 'border-l border-gray-200' : ''} p-4 bg-gray-50`}>
              <ParticipantsList 
                participants={mockParticipants} 
                maxDisplayed={isExpanded ? 15 : 5}
                currentUserId={userId}
              />
              
              {!isExpanded && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleExpand}
                    className="w-full"
                  >
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Expand View
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuctionRoom; 