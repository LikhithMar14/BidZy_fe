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

interface AuctionRoomProps {
  auctionId: string;
  token: string;
  userId: string;
  userName: string;
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Hero Section with Live Stats */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                ${liveBids.length > 0 ? liveBids[liveBids.length - 1].amount.toFixed(2) : (auctionData?.startingPrice?.toFixed(2) || '0.00')}
              </div>
              <div className="text-sm opacity-90">Current Highest</div>
              {currentLeader && (
                <div className="text-xs mt-1 px-2 py-1 bg-white/20 rounded-full inline-block">
                  🏆 {getBidderDisplayName(currentLeader)}
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">{liveBids.length}</div>
              <div className="text-sm opacity-90">Total Bids</div>
              {isPolling && (
                <div className="text-xs mt-1 flex items-center justify-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Live Updates
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">{participantCount}</div>
              <div className="text-sm opacity-90">Active Bidders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">{bidStreak}</div>
              <div className="text-sm opacity-90">Your Streak</div>
              {bidStreak > 0 && (
                <div className="text-xs mt-1">🔥 On Fire!</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Auction Info & Bidding */}
        <div className="lg:col-span-2 space-y-6">
          {/* Auction Information */}
          {auctionData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{auctionData.title || 'Live Auction'}</span>
                  <Badge 
                    variant={auctionData.isActive ? "default" : "secondary"}
                    className={auctionData.isActive ? "animate-pulse" : ""}
                  >
                    {auctionData.isActive ? "🔴 LIVE" : "Ended"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Starting Price</p>
                    <p className="text-lg font-semibold">
                      ${auctionData.startingPrice?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Min Increment</p>
                    <p className="text-lg font-semibold">${auctionData.increment}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Connection</p>
                    <Badge variant={isConnected ? "default" : "destructive"}>
                      {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
                    </Badge>
                  </div>
                </div>
                
                {auctionData.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm bg-muted p-3 rounded-lg">{auctionData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Enhanced Bid Placement */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Place Your Bid
                {bidStreak > 2 && <span className="text-orange-500">🔥</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter bid amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={liveBids.length > 0 ? 
                      liveBids[liveBids.length - 1].amount + (auctionData?.increment || 1) : 
                      (auctionData?.startingPrice || 0) + (auctionData?.increment || 1)
                    }
                    step="0.01"
                    disabled={!isConnected || isPlacingBid || !isAuctionActive}
                    className="flex-1 text-lg"
                  />
                  <Button
                    onClick={handlePlaceBid}
                    disabled={!isConnected || isPlacingBid || !bidAmount || !isAuctionActive}
                    size="lg"
                    className="px-8 font-bold"
                  >
                    {isPlacingBid ? '🚀 Bidding...' : '💰 BID NOW'}
                  </Button>
                </div>
                
                {auctionData && liveBids.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Minimum bid: ${(liveBids[liveBids.length - 1].amount + auctionData.increment).toFixed(2)}
                    </span>
                    <span className="text-primary font-semibold">
                      Beat: ${liveBids[liveBids.length - 1].amount.toFixed(2)}
                    </span>
                  </div>
                )}
                
                {bidStreak > 0 && (
                  <div className="text-center">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                      🔥 Bid Streak: {bidStreak} {bidStreak > 5 ? "- Legendary!" : bidStreak > 3 ? "- Hot!" : ""}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Live Bid Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  📈 Live Bid Timeline
                  {isPolling && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  )}
                </span>
                <Badge variant="outline">{liveBids.length} bids</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={bidTimelineRef}
                className="space-y-3 max-h-96 overflow-y-auto pr-2"
              >
                {liveBids.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">⏳</div>
                    <p>Waiting for the first bid...</p>
                    <p className="text-sm">Be the first to make a move!</p>
                  </div>
                ) : (
                  liveBids.slice().reverse().map((bid, index) => (
                    <div
                      key={bid.bid_id}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-500 ${
                        index === 0 
                          ? 'bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 shadow-lg transform scale-105' 
                          : index === 1 
                          ? 'bg-yellow-50 border border-yellow-200'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {index === 0 && <span className="text-2xl">👑</span>}
                        {index === 1 && <span className="text-xl">🥈</span>}
                        {index === 2 && <span className="text-xl">🥉</span>}
                        <div>
                          <p className={`font-semibold ${
                            bid.bidder === userName ? 'text-primary' : ''
                          }`}>
                            {getBidderDisplayName(bid.bidder)}
                            {index === 0 && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">LEADING</span>}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(bid.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          index === 0 ? 'text-green-600' : 'text-primary'
                        }`}>
                          ${bid.amount.toFixed(2)}
                        </p>
                        {index === 0 && (
                          <p className="text-xs text-green-600 font-medium">Current High</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Leaderboard & Stats */}
        <div className="space-y-6">
          {/* Bidder Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏆 Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bidLeaderboard.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No bids yet
                  </p>
                ) : (
                  bidLeaderboard.slice(0, 10).map((entry, index) => (
                    <div
                      key={entry.bidder}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        entry.bidder === userName ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {getBidderDisplayName(entry.bidder)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {entry.totalBids} bid{entry.totalBids !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">${entry.highestBid.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          Last: ${entry.latestBid.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          {auctionData?.participants && auctionData.participants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>👥 Active Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {auctionData.participants.map((participant) => (
                    <Badge 
                      key={participant.id} 
                      variant={participant.name === userName ? "default" : "outline"}
                      className="text-xs"
                    >
                      {participant.name === userName ? `${participant.name} (You)` : participant.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Your Bids</span>
                  <span className="font-semibold">
                    {liveBids.filter(bid => bid.bidder === userName).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Highest Bid</span>
                  <span className="font-semibold">
                    ${Math.max(...liveBids.filter(bid => bid.bidder === userName).map(bid => bid.amount), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Streak</span>
                  <span className="font-semibold">{bidStreak}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Leading</span>
                  <span className="font-semibold">
                    {currentLeader === userName ? '🟢 Yes!' : '🔴 No'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom; 