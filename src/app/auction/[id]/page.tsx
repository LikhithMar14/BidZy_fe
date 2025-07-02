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
  Zap as LiveIcon,
  LayoutGrid,
  BarChart3,
  Video
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
  const [activeTab, setActiveTab] = useState<'overview' | 'live' | 'analytics'>('overview');
  
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
      return response;
    },
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
      console.log('📊 Auction participants:', data.participants);
      
      // Only show toast for significant changes in participant count (more than 1 person difference)
      // This prevents flooding with notifications for every small change
      if (Math.abs(data.clientCount - prevCount) > 1 && prevCount > 0) {
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

      // Show toast for new bids (only if not from current user)
      if (bid.userName !== user?.user_name) {
        toast.success(`🔥 New bid: ₹${bid.price.toLocaleString('en-IN')} by ${bid.userName || 'Anonymous'}!`, {
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
      
      // Only show toast for significant changes (more than 1 person difference)
      // This prevents flooding with notifications
      if (Math.abs(count - prevCount) > 1 && prevCount > 0) {
        if (count > prevCount) {
          toast.success(`👋 Multiple users joined (${count} watching)`, { duration: 2000 });
        } else if (count < prevCount) {
          toast.info(`👋 Multiple users left (${count} watching)`, { duration: 2000 });
        }
      }
    };

    const handleUserJoined = (userId: string, userName: string) => {
      console.log(`👋 User joined: ${userId} (${userName})`);
      // Don't call wsGetAuctionData() on every join event to prevent flooding
      // Instead, update the participant count directly
      setParticipantCount(prev => prev + 1);
    };

    const handleUserLeft = (userId: string) => {
      console.log(`👋 User left: ${userId}`);
      // Don't call wsGetAuctionData() on every leave event to prevent flooding
      // Instead, update the participant count directly
      setParticipantCount(prev => Math.max(0, prev - 1));
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
      return `Bid must be higher than current price (₹${currentPrice.toLocaleString('en-IN')})`;
    }
    
    const minBid = currentPrice + increment;
    if (amount < minBid) {
      return `Minimum bid is ₹${minBid.toLocaleString('en-IN')}`;
    }
    
    if (amount > 1000000000) return 'Bid amount too large';
    
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
  
  // Debug auction winner data
  console.log("Auction winner data:", {
    WinnerName: auction?.WinnerName,
    winnerName: (auction as any)?.winnerName,
    winner_name: (auction as any)?.winner_name,
    winner: (auction as any)?.winner,
    highestBidder: auction?.highestBidder,
    status: auction?.Status,
    isEnded: isAuctionEnded,
    participants: auction?.participants
  });
  
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
  
  // Function to resolve user ID to username from participants
  const resolveUserIdToUsername = (userId: string): string => {
    // Check if it's already a username (not a UUID)
    if (userId && !userId.includes('-') && userId.length < 20) {
      return userId; // Already a username
    }
    
    // Try to find the user in participants array
    if (auction.participants && Array.isArray(auction.participants)) {
      const participant = auction.participants.find((p: any) => 
        p.id === userId || p.user_id === userId
      );
      if (participant) {
        return participant.user_name || 'Unknown User';
      }
    }
    
    // If we can't resolve it, return the original value
    return userId || 'Unknown User';
  };

  // Get the highest bidder name - prioritize real-time bid data over API data
  const currentHighestBidder = (() => {
    // If we have real-time bids, use the latest bidder's name
    if (realtimeBids.length > 0) {
      const latestBid = realtimeBids[0]; // Already sorted by latest first
      return latestBid.userName || 'Anonymous';
    }
    // Fallback to WebSocket auction data or API data
    const highestBidderId = wsAuctionData?.highestBidder || auction.highestBidder || '';
    return resolveUserIdToUsername(highestBidderId);
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

  const TabButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: React.ElementType, label: string }) => (
    <motion.button
      onClick={onClick}
      className={`relative flex items-center justify-center gap-2 px-4 sm:px-6 py-4 font-semibold text-base transition-all duration-300 w-full ${
        active
          ? 'text-rose-600'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
      }`}
      whileHover={{ scale: active ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      {active && (
        <motion.div
          layoutId="activeAuctionTab"
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-purple-600 rounded-t-full"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );

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

        {/* Tab Navigation */}
          <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-6"
        >
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden">
            <div className="flex items-center justify-around">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                icon={LayoutGrid}
                label="Overview"
              />
              <TabButton
                active={activeTab === 'live'}
                onClick={() => setActiveTab('live')}
                icon={Video}
                label="Live Stream"
              />
              <TabButton
                active={activeTab === 'analytics'}
                onClick={() => setActiveTab('analytics')}
                icon={BarChart3}
                label="Analytics"
              />
            </div>
          </Card>
        </motion.div>

        {/* Tab Content */}
        <div>
          {/* Overview Tab */}
          <div hidden={activeTab !== 'overview'}>
            <AnimatePresence mode="wait">
              <motion.div
                key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* 🎮 GAMIFIED TOP SECTION - Auction Arena & Battle Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* 🏆 ARENA DISPLAY - Main Item Showcase */}
                  <div className="lg:col-span-2">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="relative group"
                    >
                      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-lg rounded-3xl overflow-hidden h-full">
                        {/* 🎯 Arena Header */}
                        <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-r from-black/20 to-transparent">
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {(auction.categoryIds || []).map((categoryId: number) => {
                                const category = categories[categoryId as Category];
                                return (
                                  <motion.div
                                    key={categoryId}
                                    whileHover={{ scale: 1.05 }}
                                    className={`px-3 py-1 bg-gradient-to-r ${category.color} text-white rounded-full text-sm font-bold flex items-center gap-1 shadow-lg border border-white/20`}
                                  >
                                    <span className="text-lg">{category.icon}</span>
                                    {category.name}
                                  </motion.div>
                                );
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              {isAuctionActive && (
                                <motion.div
                                  animate={{ 
                                    scale: [1, 1.1, 1],
                                    boxShadow: ["0 0 0 rgba(34, 197, 94, 0.4)", "0 0 20px rgba(34, 197, 94, 0.8)", "0 0 0 rgba(34, 197, 94, 0.4)"]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg border border-white/20"
                                >
                                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                  <span className="text-lg">⚡ LIVE BATTLE</span>
                                </motion.div>
                              )}
                              {isAuctionNotStarted && (
                                <motion.div
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg border border-white/20"
                                >
                                  <Clock className="w-4 h-4" />
                                  <span>🚀 PREPARING ARENA</span>
                                </motion.div>
                              )}
                              {isAuctionEnded && (
                                <div className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full text-sm font-bold shadow-lg border border-white/20">
                                  🏁 BATTLE ENDED
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 🎮 Main Arena Display */}
                        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex-1 flex items-center justify-center min-h-[400px] max-h-[500px] overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                          <img
                            src={auction.Image || "/auction-placeholder.svg"}
                            alt={auction.Title}
                            className="max-h-[480px] max-w-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500"
                            style={{ width: "auto", height: "auto" }}
                          />
                          
                          {/* 🎯 Floating Stats */}
                          <div className="absolute bottom-4 left-4 right-4 z-20">
                            <div className="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-gray-700">
                                  <User className="w-4 h-4" />
                                  <span className="font-semibold">By {auction.user.user_name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-700">
                                  <Eye className="w-4 h-4" />
                                  <span className="font-semibold">{currentParticipants} watching</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {connectionStatus === 'connected' && (
                                  <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="flex items-center gap-1 text-green-600 font-bold"
                                  >
                                    <Wifi className="w-4 h-4" />
                                    <span>⚡ LIVE</span>
                                  </motion.div>
                                )}
                                {connectionStatus === 'connecting' && (
                                  <div className="flex items-center gap-1 text-blue-600">
                                    <Activity className="w-4 h-4 animate-pulse" />
                                    <span>Connecting...</span>
                                  </div>
                                )}
                                {connectionStatus === 'error' && (
                                  <div className="flex items-center gap-1 text-orange-600">
                                    <WifiOff className="w-4 h-4" />
                                    <span>Limited</span>
                                  </div>
                                )}
                                {connectionStatus === 'disconnected' && user && (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <WifiOff className="w-4 h-4" />
                                    <span>Offline</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 🎮 Item Info Panel */}
                        <CardContent className="p-6 bg-gradient-to-r from-white to-gray-50">
                          <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3"
                          >
                            {auction.Title}
                          </motion.h1>
                          <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed text-lg line-clamp-3">{auction.Description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* ⚔️ BATTLE COMMAND CENTER - Timer & Bid Controls */}
                  <div className="lg:col-span-1">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0, x: 20 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="h-full"
                    >
                      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-lg rounded-3xl overflow-hidden h-full">
                        <CardContent className="p-6 flex flex-col gap-6 h-full">
                          {/* ⏰ BATTLE TIMER */}
                          <div className="text-center">
                            <motion.div
                              animate={{ scale: [1, 1.02, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="mb-4"
                            >
                              <CountdownTimer startTime={auction.StartDate} endTime={auction.EndDate} isActive={isAuctionActive} />
                            </motion.div>
                          </div>

                          {/* 🏆 CURRENT CHAMPION */}
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <Crown className="w-6 h-6 text-amber-600" />
                              <span className="text-lg font-bold text-amber-800">CURRENT CHAMPION</span>
                            </div>
                            <motion.div
                              key={currentPrice}
                              initial={{ scale: 1.2, color: '#10b981' }}
                              animate={{ scale: 1, color: '#111827' }}
                              transition={{ duration: 0.8, type: "spring" }}
                              className="text-4xl font-bold text-gray-900 mb-3"
                            >
                              ₹{currentPrice.toLocaleString('en-IN')}
                            </motion.div>
                            {currentHighestBidder && (
                              <div className="flex items-center justify-center gap-2 text-gray-700">
                                <span className="text-lg font-semibold">👑 {currentHighestBidder}</span>
                                {connectionStatus === 'connected' && (
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="w-3 h-3 bg-green-500 rounded-full"
                                  ></motion.div>
                                )}
                              </div>
                            )}
                          </div>
                          {/* ⚔️ BATTLE CONTROLS */}
                          {isAuctionActive && user && (
                            <div className="space-y-4">
                              {/* 🎯 Quick Attack Buttons */}
                              <div className="text-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-3">⚔️ QUICK ATTACKS</h3>
                                <div className="grid grid-cols-3 gap-2">
                                  {quickBidAmounts.map((amount, index) => (
                                    <motion.div
                                      key={amount}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuickBid(amount)}
                                        className="w-full h-12 text-sm font-bold bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 hover:from-blue-100 hover:to-cyan-100 hover:border-blue-300"
                                      >
                                        +₹{amount.toLocaleString('en-IN')}
                                      </Button>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>

                              {/* 🎮 Custom Attack Input */}
                              <div className="text-center">
                                <h3 className="text-lg font-bold text-gray-800 mb-3">🎯 CUSTOM STRIKE</h3>
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Enter your bid amount"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    className="h-12 text-base border-2 border-purple-200 focus:border-purple-500 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50"
                                    step="0.01"
                                    min={auction.CurrentPrice + auction.Increment}
                                  />
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button
                                      onClick={handlePlaceBid}
                                      disabled={!bidAmount || connectionStatus !== 'connected'}
                                      className="h-12 px-6 bg-gradient-to-r from-rose-500 via-pink-600 to-purple-700 hover:from-rose-600 hover:via-pink-700 hover:to-purple-800 text-white font-bold shadow-lg"
                                    >
                                      <Gavel className="w-5 h-5 mr-2" />
                                      STRIKE!
                                    </Button>
                                  </motion.div>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                  Min: ₹{(currentPrice + currentIncrement).toLocaleString('en-IN')}
                                  {connectionStatus === 'connected' && (
                                    <span className="text-green-600 ml-2 font-medium">⚡ LIVE</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* 🚪 Login Gate */}
                          {!user && isAuctionActive && (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="text-center"
                            >
                              <Button asChild className="w-full h-14 text-lg bg-gradient-to-r from-rose-500 via-pink-600 to-purple-700 hover:from-rose-600 hover:via-pink-700 hover:to-purple-800 font-bold shadow-lg">
                                <Link href="/auth/login">🚪 ENTER THE ARENA</Link>
                              </Button>
                            </motion.div>
                          )}

                          {/* ⏳ Waiting Room */}
                          {isAuctionNotStarted && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl"
                            >
                              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                              <h3 className="text-xl font-bold text-gray-900 mb-2">⏳ WAITING ROOM</h3>
                              <p className="text-sm text-gray-600">
                                Battle begins on {new Date(auction.StartDate).toLocaleDateString()}
                              </p>
                            </motion.div>
                          )}

                          {/* 🔧 Connection Issues */}
                          {connectionStatus === 'error' && user && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl"
                            >
                              <div className="text-center">
                                <WifiOff className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                <p className="text-sm text-orange-700 mb-3 font-semibold">Connection Issues</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleReconnect}
                                  className="bg-white hover:bg-orange-50 border-orange-300 text-orange-700 font-semibold"
                                >
                                  <Wifi className="w-4 h-4 mr-1" />
                                  Reconnect
                                </Button>
                              </div>
                            </motion.div>
                          )}

                          {/* 🏁 Battle Results */}
                          {isAuctionEnded && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl"
                            >
                              <Trophy className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                              <h3 className="text-xl font-bold text-gray-900 mb-2">🏁 BATTLE RESULTS</h3>
                              {(() => {
                                const winnerName = auction.WinnerName || 
                                                  (auction as any).winnerName || 
                                                  (auction as any).winner_name ||
                                                  (auction as any).winner?.name ||
                                                  (auction as any).winner?.user_name ||
                                                  (auction as any).winner?.userName ||
                                                  (auction as any).highestBidder ||
                                                  auction.highestBidder ||
                                                  '';
                                
                                const resolveWinnerName = (winnerId: string): string => {
                                  return resolveUserIdToUsername(winnerId);
                                };
                                
                                if (!winnerName && uniqueBids.length > 0) {
                                  const highestBid = uniqueBids[0];
                                  return (
                                    <div>
                                      <p className="text-lg font-semibold text-gray-700 mb-1">
                                        👑 Champion: <span className="text-amber-600">{highestBid.bidderName}</span>
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Final Strike: ₹{highestBid.amount.toLocaleString('en-IN')}
                                      </p>
                                    </div>
                                  );
                                }
                                
                                if (winnerName && winnerName.trim()) {
                                  const resolvedWinnerName = resolveWinnerName(winnerName);
                                  return (
                                    <p className="text-lg font-semibold text-gray-700">
                                      👑 Champion: <span className="text-amber-600">{resolvedWinnerName}</span>
                                    </p>
                                  );
                                } else {
                                  return (
                                    <p className="text-sm text-gray-600">No champion determined</p>
                                  );
                                }
                              })()}
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Section - Bids & Stats - Only for Overview Tab */}
          <div hidden={activeTab !== 'overview'}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bids */}
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
                      <Gavel className="w-6 h-6 text-white" />
                    </div>
                    Recent Bids
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 flex-1">
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
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {uniqueBids.map((bid, index) => (
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
                              ₹{bid.amount.toLocaleString('en-IN')}
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
              {/* Auction Details */}
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    Auction Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 flex-1 flex flex-col justify-between">
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
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <DollarSign className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Starting Price</div>
                      <div className="font-bold text-lg">₹{auction.StartingPrice.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <TrendingUp className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Increment</div>
                      <div className="font-bold text-lg">₹{auction.Increment.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Started</div>
                      <div className="font-bold text-sm">{new Date(auction.StartDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {auction.Description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>



          {/* Live Stream Tab */}
          <div hidden={activeTab !== 'live'}>
            <AnimatePresence mode="wait">
              <motion.div
                key="live"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
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
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Analytics Tab */}
          <div hidden={activeTab !== 'analytics'}>
            <AnimatePresence mode="wait">
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
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
              </motion.div>
            </AnimatePresence>
          </div>
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
          winnerName={winnerData?.winnerName || ''}
          auctionTitle={winnerData?.auctionTitle || ''}
          finalBid={winnerData?.finalBid || 0}
          auctionImage={winnerData?.auctionImage || ''}
        />
      )}
    </div>
  );
} 