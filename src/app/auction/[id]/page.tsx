"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  Clock,
  Users,
  Gavel,
  DollarSign,
  Timer,
  Heart,
  Share2,
  AlertCircle,
  Trophy,
  Star,
  Sparkles,
  Zap,
  TrendingUp,
  Eye,
  Calendar,
  Tag,
  User,
  Crown,
  CheckCircle,
  Flame,
  Wifi,
  WifiOff,
  Activity,
  Zap as LiveIcon
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAuctionById } from "@/connecting/auction";
import { useAuth } from "@/hooks/useAuth";
import { Status, Category } from "@/types/auction";
import { 
  connectToAuction,
  joinAuction as wsJoinAuction,
  leaveAuction as wsLeaveAuction,
  placeBid as wsPlaceBid,
  getAuctionData as wsGetAuctionData,
  auctionWebSocket,
  isConnectedToAuction,
  getConnectionStatus,
  useAuctionWebSocket,
  type AuctionConnection,
  type AuctionData as WSAuctionData,
  type Bid as WSBid
} from "@/connecting/ws-singleton";
import { useAuthStore } from "@/lib/auth";
import { GraffitiCongratulations } from "@/components/ui/congratulations";
import LiveBiddingChart from "@/components/auction/LiveBiddingChart";
import AuctionRoom from "@/components/auction/AuctionRoom";

const categories = {
  [Category.ART]: { name: "Art", icon: "🎨", color: "from-rose-500 to-pink-600" },
  [Category.COLLECTIBLES]: { name: "Collectibles", icon: "🏆", color: "from-amber-500 to-orange-600" },
  [Category.ELECTRONICS]: { name: "Electronics", icon: "📱", color: "from-violet-500 to-purple-600" },
  [Category.FASHION]: { name: "Fashion", icon: "👗", color: "from-emerald-500 to-teal-600" },
  [Category.HOME]: { name: "Home", icon: "🏠", color: "from-blue-500 to-cyan-600" },
  [Category.OTHER]: { name: "Other", icon: "📦", color: "from-gray-500 to-slate-600" },
};

interface CountdownTimerProps {
  startTime: string;
  endTime: string;
  isActive: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ startTime, endTime, isActive }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });
  const [auctionState, setAuctionState] = useState<'not-started' | 'active' | 'ended'>('not-started');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      if (now < start) {
        // Auction hasn't started yet
        const difference = start - now;
        setAuctionState('not-started');
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
          total: difference
        });
      } else if (now >= start && now < end) {
        // Auction is active
        const difference = end - now;
        setAuctionState('active');
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
          total: difference
        });
      } else {
        // Auction has ended
        setAuctionState('ended');
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (auctionState === 'ended') {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <div className="text-6xl mb-4">🏁</div>
        <h3 className="text-2xl font-bold text-red-600 mb-2">Auction Ended</h3>
        <p className="text-gray-600">This auction has concluded</p>
      </motion.div>
    );
  }

  if (auctionState === 'not-started') {
    if (timeLeft.total <= 0) {
      // Auction should start now
      return (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8"
        >
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Auction is Starting!</h3>
          <p className="text-gray-600 mb-6">The auction is now ready to begin</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <Gavel className="w-5 h-5" />
            Join the Auction
          </motion.button>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-6"
      >
        <div className="text-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold text-lg mb-2"
          >
            <Clock className="w-5 h-5" />
            STARTING SOON
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Starts In</h3>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                key={item.value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl p-4 mb-2 shadow-lg"
              >
                <div className="text-3xl font-bold">{formatNumber(item.value)}</div>
              </motion.div>
              <div className="text-sm font-medium text-gray-600">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl"
        >
          <div className="flex items-center gap-2 text-blue-700">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Get ready to bid!</span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="p-6"
    >
      <div className="text-center mb-6">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-2 text-orange-600 font-semibold text-lg mb-2"
        >
          <Flame className="w-5 h-5" />
          LIVE AUCTION
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Time Remaining</h3>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <motion.div
              key={item.value}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-rose-500 to-purple-600 text-white rounded-2xl p-4 mb-2 shadow-lg"
            >
              <div className="text-3xl font-bold">{formatNumber(item.value)}</div>
            </motion.div>
            <div className="text-sm font-medium text-gray-600">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {timeLeft.total < 24 * 60 * 60 * 1000 && timeLeft.total > 0 && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl"
        >
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Ending Soon!</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default function AuctionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [bidAmount, setBidAmount] = useState("");
  const [showBidHistory, setShowBidHistory] = useState(false);
  
  // WebSocket Integration States
  const [isConnected, setIsConnected] = useState(false);
  const [wsAuctionData, setWsAuctionData] = useState<WSAuctionData | null>(null);
  const [realtimeBids, setRealtimeBids] = useState<WSBid[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('disconnected');
  
  // Congratulations modal state
  const [congratsVisible, setCongratsVisible] = useState(false);
  const [winnerData, setWinnerData] = useState<{
    winnerName: string;
    auctionTitle: string;
    finalBid: number;
    auctionImage?: string;
  } | null>(null);

  const auctionId = params.id as string;

  
  const { data: auction, isLoading, error } = useQuery({
    queryKey: ['auction', auctionId],
    queryFn: async () => {
      const response = await getAuctionById(auctionId);
      if (response) {
        
        const apiResponse = response as any;
        return {
          ...response,
          CurrentPrice: apiResponse.currentPrice || response.CurrentPrice,
          StartDate: apiResponse.startTime || response.StartDate,
          EndDate: apiResponse.endTime || response.EndDate,
          ClientCount: apiResponse.clientCount || response.ClientCount,
          Status: apiResponse.status || response.Status,
          Increment: apiResponse.increment || response.Increment,
          StartingPrice: apiResponse.startingPrice || response.StartingPrice,
          Image: apiResponse.image || response.Image,
          Title: apiResponse.title || response.Title,
          Description: apiResponse.description || response.Description,
          categoryIds: apiResponse.categoryIds || response.categoryIds,
          user: apiResponse.user || response.user,
          participants: apiResponse.participants || response.participants || [],
          isActive: apiResponse.isActive || response.isActive,
          highestBidder: apiResponse.highestBidder || response.highestBidder || '',
          WinnerName: apiResponse.WinnerName || response.WinnerName || '',
          ID: apiResponse.auctionId || response.ID
        };
      }
      return response;
    },
    refetchInterval: 2000, // Reduced to 2 seconds for better real-time updates 
  });




  // Note: Bid data is now received via WebSocket real-time updates
  // No need for HTTP API calls to fetch bids since they come through WebSocket events
  const bids: any[] = []; // Placeholder - real bids come through WebSocket events

  // WebSocket Connection Management
  useEffect(() => {
    if (!auction || !user) return;

    const { token: authToken } = useAuthStore.getState();
    
    const connection: AuctionConnection = {
      auctionId: auction.ID,
      token: authToken || '',
      userId: user.id,
      userName: user.user_name,
    };

    const initializeWebSocket = async () => {
      setConnectionStatus('connecting');
      
      // Add timeout to prevent infinite connecting state
      const connectTimeout = setTimeout(() => {
        if (connectionStatus === 'connecting') {
          setConnectionStatus('error');
          setIsConnected(false);
          toast.error('⚠️ Connection timeout', {
            description: 'WebSocket connection timed out. Using fallback mode.',
          });
        }
      }, 15000); // 15 second timeout
      
      try {
        console.log('🔄 Initializing WebSocket connection...', connection);
        const success = await connectToAuction(connection);
        
        clearTimeout(connectTimeout);
        
        if (success) {
          setConnectionStatus('connected');
          setIsConnected(true);
          
          // Join auction room
          wsJoinAuction();
          
          // Get initial auction data
          wsGetAuctionData();
          
          toast.success('🚀 Connected to live auction!', {
            description: 'You will receive real-time updates',
          });
        } else {
          setConnectionStatus('error');
          setIsConnected(false);
          toast.error('⚠️ Limited connectivity', {
            description: 'WebSocket unavailable - using fallback mode',
          });
        }
      } catch (error) {
        clearTimeout(connectTimeout);
        setConnectionStatus('error');
        setIsConnected(false);
        console.error('WebSocket connection error:', error);
        toast.error('⚠️ Connection failed', {
          description: 'Using fallback mode - some features may be limited',
        });
      }
    };

    initializeWebSocket();

    // Cleanup on unmount
    return () => {
      wsLeaveAuction();
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };
  }, [auction?.ID, user?.id]);

  // WebSocket Event Listeners
  useEffect(() => {
    // Connection events
    const handleConnected = (auctionId: string) => {
      setIsConnected(true);
      setConnectionStatus('connected');
      console.log(`✅ Connected to auction: ${auctionId}`);
      
      // Immediately request participant count for real-time updates
      wsGetAuctionData();
    };

    const handleDisconnected = (auctionId: string) => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      console.log(`❌ Disconnected from auction: ${auctionId}`);
    };

    // Auction data events - with real-time participant updates
    const handleAuctionData = (data: WSAuctionData) => {
      setWsAuctionData(data);
      const prevCount = participantCount;
      setParticipantCount(data.clientCount);
      console.log('📊 Auction data received with participant count:', data.clientCount);
      
      // Update participant count instantly for no latency
      if (data.clientCount !== prevCount && prevCount > 0) {
        toast.info(`👥 ${data.clientCount} people watching`, {
          duration: 2000,
        });
      }
    };

    // Bid update events
    const handleBidUpdate = (bid: WSBid) => {
      setRealtimeBids(prev => {
        const newBids = [bid, ...prev];
        // Keep only last 20 bids
        return newBids.slice(0, 20);
      });

      // Update WebSocket auction data with the latest bid information
      setWsAuctionData(prev => {
        if (prev) {
          return {
            ...prev,
            currentPrice: bid.price,
            highestBidder: bid.userName || bid.senderId // Use username when available
          };
        }
        return prev;
      });

      // Show notification for other users' bids
      if (bid.userName !== user?.user_name) {
        toast.info(`💰 New bid: $${bid.price}`, {
          description: `${bid.userName} placed a bid`,
          duration: 3000,
        });
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
    };

    // Participant events - real-time updates
    const handleCountUpdate = (count: number) => {
      const prevCount = participantCount;
      setParticipantCount(count);
      
      // Show toast for participant changes with no latency
      if (count > prevCount) {
        toast.success(`👋 Someone joined (${count} watching)`, { duration: 2000 });
      } else if (count < prevCount && prevCount > 0) {
        toast.info(`👋 Someone left (${count} watching)`, { duration: 2000 });
      }
    };

    const handleUserJoined = (userId: string) => {
      console.log(`👋 User joined: ${userId}`);
      // Request updated participant count immediately
      wsGetAuctionData();
    };

    const handleUserLeft = (userId: string) => {
      console.log(`👋 User left: ${userId}`);
      // Request updated participant count immediately
      wsGetAuctionData();
    };

    // Status events
    const handleSuccess = (message: string) => {
      console.log('✅ Success:', message);
    };

    const handleError = (message: string) => {
      console.error('❌ Error:', message);
      toast.error('Auction Error', {
        description: message,
      });
    };

    const handleAuctionEnded = () => {
      console.log('🏁 Auction ended - checking for winner');
      
      // Check if current user won the auction
      setTimeout(async () => {
        try {
          const updatedAuction = await queryClient.fetchQuery({
            queryKey: ['auction', auctionId],
            queryFn: () => getAuctionById(auctionId),
          });
          
          if (updatedAuction && updatedAuction.WinnerName === user?.user_name) {
            // Current user won the auction!
            setWinnerData({
              winnerName: user.user_name || user.userName || 'You',
              auctionTitle: updatedAuction.Title,
              finalBid: updatedAuction.CurrentPrice,
              auctionImage: updatedAuction.Image,
            });
            setCongratsVisible(true);
          } else {
            toast.info('🏁 Auction has ended!', {
              description: 'Check the results to see who won',
            });
          }
        } catch (error) {
          console.error('Error checking auction winner:', error);
          toast.info('🏁 Auction has ended!', {
            description: 'Check the results to see who won',
          });
        }
      }, 1000); // Small delay to ensure data is updated
      
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
    };

    // Attach event listeners
    auctionWebSocket.on('connected', handleConnected);
    auctionWebSocket.on('disconnected', handleDisconnected);
    auctionWebSocket.on('auctionData', handleAuctionData);
    auctionWebSocket.on('bidUpdate', handleBidUpdate);
    auctionWebSocket.on('countUpdate', handleCountUpdate);
    auctionWebSocket.on('userJoined', handleUserJoined);
    auctionWebSocket.on('userLeft', handleUserLeft);
    auctionWebSocket.on('success', handleSuccess);
    auctionWebSocket.on('error', handleError);
    auctionWebSocket.on('auctionEnded', handleAuctionEnded);

    // Cleanup event listeners
    return () => {
      auctionWebSocket.off('connected', handleConnected);
      auctionWebSocket.off('disconnected', handleDisconnected);
      auctionWebSocket.off('auctionData', handleAuctionData);
      auctionWebSocket.off('bidUpdate', handleBidUpdate);
      auctionWebSocket.off('countUpdate', handleCountUpdate);
      auctionWebSocket.off('userJoined', handleUserJoined);
      auctionWebSocket.off('userLeft', handleUserLeft);
      auctionWebSocket.off('success', handleSuccess);
      auctionWebSocket.off('error', handleError);
      auctionWebSocket.off('auctionEnded', handleAuctionEnded);
    };
  }, [auctionId, user?.user_name, queryClient]);


  // Note: All bidding is now handled through WebSocket only
  // No HTTP API mutation needed since bids are placed via WebSocket messages

  console.log("Auction from auction page", auction);
  console.log("Bids from: ", bids);
  console.log("Bids type:", typeof bids, "Is array:", Array.isArray(bids));

  // Smart bid validation and placement
  const validateBid = (amount: number): string | null => {
    if (!auction) return 'Auction data not available';
    
    // Use WebSocket data if available, fallback to API data
    const currentPrice = wsAuctionData?.currentPrice || auction.CurrentPrice;
    const increment = wsAuctionData?.increment || auction.Increment;
    const isActive = wsAuctionData?.isActive ?? (auction.Status === Status.ACTIVE);
    
    if (!isActive) return 'Auction is not active';
    
    if (new Date() > new Date(auction.EndDate)) return 'Auction has ended';
    
    if (amount <= currentPrice) {
      return `Bid must be higher than current price ($${currentPrice})`;
    }
    
    const minBid = currentPrice + increment;
    if (amount < minBid) {
      return `Minimum bid is $${minBid.toFixed(2)}`;
    }
    
    if (amount > 1000000) return 'Bid amount too large';
    
    return null; // Valid bid
  };

  const handlePlaceBid = () => {
    if (!user) {
      toast.error("Please log in to place a bid");
      router.push("/auth/login");
      return;
    }

    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    // Validate bid
    const validationError = validateBid(amount);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Use WebSocket for real-time bidding
    if (isConnected && isConnectedToAuction(auctionId)) {
      const result = wsPlaceBid(amount);
      if (result.success) {
        toast.success("🎯 Bid placed successfully!", {
          description: "Your bid has been submitted in real-time"
        });
        setBidAmount("");
      } else {
        toast.error("Failed to place bid", {
          description: result.message
        });
      }
    } else {
      toast.error("WebSocket not connected", {
        description: "Please wait for connection or refresh the page"
      });
    }
  };

  const handleQuickBid = (additionalAmount: number) => {
    if (!auction) return;
    
    // Use WebSocket data if available
    const currentPrice = wsAuctionData?.currentPrice || auction.CurrentPrice;
    const newBid = currentPrice + additionalAmount;
    setBidAmount(newBid.toFixed(2));
  };

  // Manual reconnection function
  const handleReconnect = async () => {
    if (!auction || !user) return;
    
    const { token: authToken } = useAuthStore.getState();
    const connection: AuctionConnection = {
      auctionId: auction.ID,
      token: authToken || '',
      userId: user.id,
      userName: user.user_name,
    };
    
    setConnectionStatus('connecting');
    
    try {
      const success = await connectToAuction(connection);
      if (success) {
        wsJoinAuction();
        wsGetAuctionData();
        toast.success('🔄 Reconnected to live auction!');
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Failed to reconnect');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
        />
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Auction Not Found</h2>
            <p className="text-gray-600 mb-6">The auction you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/">Go Back Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const now = new Date().getTime();
  const startTime = new Date(auction.StartDate).getTime();
  const endTime = new Date(auction.EndDate).getTime();
  
  const isAuctionNotStarted = now < startTime;
  const isAuctionActive = now >= startTime && now < endTime && auction.Status === Status.ACTIVE;
  const isAuctionEnded = now >= endTime || auction.Status === Status.ENDED;
  
  // Use WebSocket data when available for more accurate info
  const currentPrice = (() => {
    // If we have real-time bids, use the latest bid price
    if (realtimeBids.length > 0) {
      const latestBid = realtimeBids[0]; // Already sorted by latest first
      return latestBid.price;
    }
    // Fallback to WebSocket auction data or API data
    return wsAuctionData?.currentPrice || auction.CurrentPrice;
  })();
  const currentIncrement = wsAuctionData?.increment || auction.Increment;
  const currentParticipants = participantCount || auction.ClientCount;
  
  // Get the highest bidder name - prioritize real-time bid data over API data
  const currentHighestBidder = (() => {
    // If we have real-time bids, use the latest bidder's name
    if (realtimeBids.length > 0) {
      const latestBid = realtimeBids[0]; // Already sorted by latest first
      return latestBid.userName || 'Anonymous';
    }
    // Fallback to WebSocket auction data or API data
    return wsAuctionData?.highestBidder || auction.highestBidder || '';
  })();
  
  const quickBidAmounts = [currentIncrement, currentIncrement * 2, currentIncrement * 5];
  
  // Safely process bids data
  const safeBids = (() => {
    if (!bids) return [];
    if (Array.isArray(bids)) return bids;
    // Handle wrapped response structure
    if (bids && typeof bids === 'object' && 'data' in bids && Array.isArray((bids as any).data)) {
      return (bids as any).data;
    }
    console.warn('Unexpected bids data structure:', bids);
    return [];
  })();

  // Merge real-time bids with API bids
  const allBids = [
    ...realtimeBids.map(bid => ({
      id: `ws-${bid.timestamp}`,
      amount: bid.price,
      bidderName: bid.userName || 'Anonymous',
      createdAt: bid.timestamp,
      auctionId: auctionId,
      isRealtime: true
    })), 
    ...safeBids.map((bid: any) => ({ ...bid, isRealtime: false }))
  ];
  
  // Sort by timestamp and remove duplicates
  const uniqueBids = allBids
    .filter((bid, index, self) => 
      index === self.findIndex(b => b.amount === bid.amount && b.bidderName === bid.bidderName)
    )
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
      return timeB - timeA;
    });

  return (
          <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 2px, transparent 2px)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <Link 
            href="/" 
            className="inline-flex items-center text-white/80 hover:text-white mb-4 sm:mb-6 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Auctions
          </Link>
        </motion.div>

        {/* Top Section - Auction Info & Timer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Auction Image and Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden h-full">
              <div className="relative bg-gray-100">
                <div className="relative w-full flex justify-center items-center" style={{ minHeight: "300px", maxHeight: "400px" }}>
                  <img
                    src={auction.Image || "/auction-placeholder.svg"}
                    alt={auction.Title}
                    className="max-h-[400px] max-w-full object-contain"
                    style={{ width: "auto", height: "auto" }}
                  />
                  
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    {(auction.categoryIds || []).map((categoryId: number) => {
                      const category = categories[categoryId as Category];
                      return (
                        <div
                          key={categoryId}
                          className={`px-3 py-1 bg-gradient-to-r ${category.color} text-white rounded-full text-sm font-medium flex items-center gap-1 shadow-md`}
                        >
                          <span>{category.icon}</span>
                          {category.name}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="absolute top-4 right-4 z-10">
                    {isAuctionActive && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-bold flex items-center gap-1 shadow-md"
                      >
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </motion.div>
                    )}
                    {isAuctionNotStarted && (
                      <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full text-sm font-bold flex items-center gap-1 shadow-md">
                        <Clock className="w-3 h-3" />
                        STARTS SOON
                      </div>
                    )}
                    {isAuctionEnded && (
                      <div className="px-3 py-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full text-sm font-bold shadow-md">
                        ENDED
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{auction.Title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>By {auction.user.user_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{currentParticipants} watching</span>
                      </div>
                      
                      {/* WebSocket Connection Status */}
                      <div className="flex items-center gap-1">
                        {connectionStatus === 'connected' && (
                          <>
                            <Wifi className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium text-sm">LIVE</span>
                          </>
                        )}
                        {connectionStatus === 'connecting' && (
                          <>
                            <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                            <span className="text-blue-600 text-sm">Connecting...</span>
                          </>
                        )}
                        {connectionStatus === 'error' && (
                          <>
                            <WifiOff className="w-4 h-4 text-orange-600" />
                            <span className="text-orange-600 text-sm">Limited</span>
                          </>
                        )}
                        {connectionStatus === 'disconnected' && user && (
                          <>
                            <WifiOff className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-600 text-sm">Offline</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed line-clamp-3">{auction.Description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timer & Current Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            {/* Timer Card */}
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden">
              <CountdownTimer startTime={auction.StartDate} endTime={auction.EndDate} isActive={isAuctionActive} />
            </Card>

            {/* Current Price Card */}
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-600 mb-2">Current Highest Bid</div>
                  <motion.div
                    key={currentPrice}
                    initial={{ scale: 1.1, color: '#10b981' }}
                    animate={{ scale: 1, color: '#111827' }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold text-gray-900 mb-2"
                  >
                    ${currentPrice}
                  </motion.div>
                  {currentHighestBidder && (
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Crown className="w-4 h-4 text-amber-600" />
                      <span className="text-sm">Leading: {currentHighestBidder}</span>
                      {connectionStatus === 'connected' && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
                      )}
                    </div>
                  )}
                </div>

                {isAuctionActive && user && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      {quickBidAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickBid(amount)}
                          className="flex-1 text-xs"
                        >
                          +${amount}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Enter bid"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="text-base"
                        step="0.01"
                        min={auction.CurrentPrice + auction.Increment}
                      />
                      <Button
                        onClick={handlePlaceBid}
                        disabled={!bidAmount || connectionStatus !== 'connected'}
                        className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 px-4"
                      >
                        <Gavel className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-600 text-center">
                      Min: ${(currentPrice + currentIncrement).toFixed(2)}
                      {connectionStatus === 'connected' && (
                        <span className="text-green-600 ml-2 font-medium">• Live</span>
                      )}
                    </p>
                  </div>
                )}

                                 {!user && isAuctionActive && (
                   <Button asChild className="w-full bg-gradient-to-r from-rose-500 to-purple-600">
                     <Link href="/auth/login">Login to Bid</Link>
                   </Button>
                 )}

                 {isAuctionNotStarted && (
                   <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                     <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                     <h3 className="text-base font-bold text-gray-900 mb-1">Auction Not Started</h3>
                     <p className="text-sm text-gray-600">
                       This auction will begin on {new Date(auction.StartDate).toLocaleDateString()}
                     </p>
                   </div>
                 )}

                 {/* Reconnection section */}
                 {connectionStatus === 'error' && user && (
                   <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl">
                     <div className="text-center">
                       <WifiOff className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                       <p className="text-xs text-orange-700 mb-2">Limited connectivity</p>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={handleReconnect}
                         className="bg-white hover:bg-orange-50 border-orange-300 text-orange-700"
                       >
                         <Wifi className="w-3 h-3 mr-1" />
                         Reconnect
                       </Button>
                       
                       {/* Development Test Button */}
                       {process.env.NODE_ENV === 'development' && (
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => {
                             const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
                             const wsUrl = apiUrl.replace('http://', 'ws://').replace('https://', 'wss://');
                             const testUrl = `${wsUrl}/join-auction?auctionId=${auction.ID}&token=test`;
                             console.log('🧪 Testing WebSocket URL:', testUrl);
                             toast.info('Check browser console for WebSocket test details');
                             
                             // Simple WebSocket test
                             try {
                               const testWs = new WebSocket(testUrl);
                               testWs.onopen = () => {
                                 console.log('✅ WebSocket test connection successful');
                                 testWs.close();
                                 toast.success('WebSocket server is reachable');
                               };
                               testWs.onerror = (error) => {
                                 console.error('❌ WebSocket test failed:', error);
                                 toast.error('WebSocket server is not reachable');
                               };
                               testWs.onclose = (event) => {
                                 console.log('🔌 WebSocket test closed:', event.code, event.reason);
                               };
                             } catch (error) {
                               console.error('💥 WebSocket test error:', error);
                               toast.error('WebSocket test failed');
                             }
                           }}
                           className="bg-white hover:bg-blue-50 border-blue-300 text-blue-700 ml-2"
                         >
                           🧪 Test WS
                         </Button>
                       )}
                     </div>
                   </div>
                 )}

                 {isAuctionEnded && (
                   <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                     <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                     <h3 className="text-base font-bold text-gray-900 mb-1">Auction Ended</h3>
                     {auction.WinnerName ? (
                       <p className="text-sm text-gray-600">
                         Won by <span className="font-semibold">{auction.WinnerName}</span>
                       </p>
                     ) : (
                       <p className="text-sm text-gray-600">No winner</p>
                     )}
                   </div>
                 )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

                 {/* Live Bidding Chart - Full Width Section */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="mb-6"
         >
           <LiveBiddingChart 
             auctionId={auction.ID}
             currentUserName={user?.user_name}
             startingPrice={auction.StartingPrice}
             isActive={isAuctionActive}
           />
         </motion.div>

        {/* LiveKit Video Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <AuctionRoom 
            auctionId={auction.ID}
            userName={user?.user_name}
            userId={user?.id}
            isActive={isAuctionActive}
            participants={currentParticipants}
            token={user?.token}
          />
        </motion.div>

        {/* Bottom Section - Bids & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Bids - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
                      <Gavel className="w-6 h-6 text-white" />
                    </div>
                    Recent Bids
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBidHistory(!showBidHistory)}
                    className="text-sm"
                  >
                    {showBidHistory ? 'Hide' : 'Show'} All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6">
                {/* Real-time indicator */}
                {connectionStatus === 'connected' && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <LiveIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Real-time bidding active</span>
                    </div>
                  </div>
                )}
                
                <AnimatePresence>
                  {Array.isArray(uniqueBids) && uniqueBids.length > 0 ? (
                    <div className="space-y-3">
                      {(showBidHistory ? uniqueBids : uniqueBids.slice(0, 8)).map((bid, index) => (
                        <motion.div
                          key={bid.id}
                          initial={{ opacity: 0, x: -20, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -20, scale: 0.95 }}
                          transition={{ 
                            delay: index * 0.03,
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                          }}
                          className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                            index === 0 ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-md' : 
                            (bid as any).isRealtime ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {index === 0 && (
                              <Crown className="w-5 h-5 text-amber-600" />
                            )}
                            {(bid as any).isRealtime && index !== 0 && (
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{bid.bidderName}</span>
                                {(bid as any).isRealtime && (
                                  <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0.5">
                                    LIVE
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {bid.createdAt ? new Date(bid.createdAt as string).toLocaleString() : 'Just now'}
                              </div>
                            </div>
                          </div>
                          <div className={`font-bold text-lg ${index === 0 ? 'text-amber-700' : 'text-gray-900'}`}>
                            ${bid.amount}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-600">
                      <Gavel className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No bids yet. Be the first to bid!</p>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Auction Stats - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  Auction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Key Stats */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Bids</span>
                    <span className="font-semibold">{Array.isArray(uniqueBids) ? uniqueBids.length : 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Watching</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{currentParticipants}</span>
                      {connectionStatus === 'connected' && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-semibold">{(auction.participants || []).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-semibold ${
                      isAuctionActive ? 'text-green-600' : 
                      isAuctionNotStarted ? 'text-blue-600' :
                      isAuctionEnded ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {isAuctionNotStarted ? 'NOT STARTED' : 
                       isAuctionActive ? 'ACTIVE' : 
                       isAuctionEnded ? 'ENDED' : auction.Status}
                    </span>
                  </div>
                </div>

                {/* Detailed Info */}
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <DollarSign className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Starting Price</div>
                    <div className="font-bold text-lg">${auction.StartingPrice}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Increment</div>
                    <div className="font-bold text-lg">${auction.Increment}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Started</div>
                    <div className="font-bold text-sm">{new Date(auction.StartDate).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Auction description */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {auction.Description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-2xl"
      >
        <Sparkles className="w-10 h-10 text-amber-800" />
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl"
      >
        <Zap className="w-8 h-8 text-violet-800" />
      </motion.div>

      {/* Graffiti Congratulations Modal */}
      {winnerData && (
        <GraffitiCongratulations
          isVisible={congratsVisible}
          onClose={() => {
            setCongratsVisible(false);
            setWinnerData(null);
          }}
          winnerName={winnerData.winnerName}
          auctionTitle={winnerData.auctionTitle}
          finalBid={winnerData.finalBid}
          auctionImage={winnerData.auctionImage}
        />
      )}
    </div>
  );
} 