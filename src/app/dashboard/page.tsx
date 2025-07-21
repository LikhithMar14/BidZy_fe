"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Gavel,
  TrendingUp,
  Award,
  DollarSign,
  Calendar,
  Clock,
  Trophy,
  Star,
  Eye,
  Heart,
  Settings,
  Crown,
  Sparkles,
  Target,
  Activity,
  Users,
  ArrowRight,
  Timer,
  History,
  Flame,
  CheckCircle,
  AlertCircle,
  Plus,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Search,
  Filter,
  Grid,
  List,
  Zap,
  Gem,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserInfo, getUserStats, getAuctionsOfUser, getBidsOfUser, getParticipatedAuctions } from "@/connecting/user";
import { getAllAuctions } from "@/connecting/auction";
import { AuctionResponse, Status, Category } from "@/types/auction";
import { Bid } from "@/types/bids";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { auctionWebSocket } from "@/connecting/ws-singleton";
import { GraffitiCongratulations } from "@/components/ui/congratulations";

const categories = {
  [Category.ART]: { name: "Art", icon: "🎨", color: "from-rose-500 to-pink-600" },
  [Category.COLLECTIBLES]: { name: "Collectibles", icon: "🏆", color: "from-amber-500 to-orange-600" },
  [Category.ELECTRONICS]: { name: "Electronics", icon: "📱", color: "from-violet-500 to-purple-600" },
  [Category.FASHION]: { name: "Fashion", icon: "👗", color: "from-emerald-500 to-teal-600" },
  [Category.HOME]: { name: "Home", icon: "🏠", color: "from-blue-500 to-cyan-600" },
  [Category.OTHER]: { name: "Other", icon: "📦", color: "from-gray-500 to-slate-600" },
};

const useUserInfo = () => {
  return useQuery({
    queryKey: ['user', 'info'],
    queryFn: getUserInfo,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const useUserStats = () => {
  return useQuery({
    queryKey: ['user', 'stats'],
    queryFn: getUserStats,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

const useUserAuctions = () => {
  return useQuery({
    queryKey: ['user', 'auctions'],
    queryFn: getAuctionsOfUser,
    refetchOnWindowFocus: true,
    select: (data) => data?.data || [],
    staleTime: 30 * 1000, // 30 seconds
  });
};

const useParticipatedAuctions = () => {
  return useQuery({
    queryKey: ['user', 'participated-auctions'],
    queryFn: getParticipatedAuctions,
    refetchOnWindowFocus: true,
    select: (data) => (data as any)?.data || [],
    staleTime: 30 * 1000, // 30 seconds
  });
};

const useAllAuctions = () => {
  return useQuery({
    queryKey: ['all-auctions'],
    queryFn: getAllAuctions,
    refetchInterval: 60 * 1000, // Refresh every minute for active auctions
    refetchOnWindowFocus: true,
    select: (data) => data || [],
    staleTime: 30 * 1000, // 30 seconds
  });
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
  count: number;
  gradient: string;
}

const TabButton = ({ active, onClick, icon: Icon, label, count, gradient }: TabButtonProps) => (
  <motion.button
    onClick={onClick}
    className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${active
        ? `bg-gradient-to-r ${gradient} text-white shadow-xl scale-105`
        : 'bg-gray-800/50 backdrop-blur-lg text-gray-300 hover:bg-gray-700/50 hover:shadow-lg'
      }`}
    whileHover={{ scale: active ? 1.05 : 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className={`p-2 rounded-xl ${active ? 'bg-white/20' : `bg-gradient-to-r ${gradient}`}`}>
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-white'}`} />
    </div>
    <span>{label}</span>
    <div className={`px-3 py-1 rounded-full text-sm font-bold ${active ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300'
      }`}>
      {count}
    </div>
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-white/10"
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </motion.button>
);

interface StatCardProps {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  gradient: string;
}

const StatCard = ({ icon: Icon, title, value, subtitle, gradient }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ duration: 0.3 }}
    className="group"
  >
    <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gray-900/95 backdrop-blur-lg border border-gray-800">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-15 transition-opacity duration-300`} />
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white">{title.includes('Spent') || title.includes('Price') ? `₹${value.toLocaleString('en-IN')}` : value}</h3>
          <p className="text-gray-300 font-medium">{title}</p>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      </CardContent>
    </Card>
  </motion.div>
);

interface AuctionCardProps {
  auction: AuctionResponse;
  isUpcoming?: boolean;
}

const AuctionCard = ({ auction, isUpcoming = false }: AuctionCardProps) => {
  const getTimeDisplay = () => {
    const now = new Date();
    const startTime = new Date(auction.StartDate);
    const endTime = new Date(auction.EndDate);

    if (isUpcoming && startTime > now) {
      const diff = startTime.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (days > 0) return `Starts in ${days}d ${hours}h`;
      if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
      return `Starts in ${minutes}m`;
    } else if (auction.Status === Status.ACTIVE && endTime > now) {
      const diff = endTime.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (days > 0) return `${days}d ${hours}h left`;
      if (hours > 0) return `${hours}h ${minutes}m left`;
      return `${minutes}m left`;
    } else {
      return `Ended ${endTime.toLocaleDateString()}`;
    }
  };

  const getStatusColor = () => {
    if (isUpcoming) return "from-blue-500 to-cyan-600";
    if (auction.Status === Status.ACTIVE) return "from-green-500 to-emerald-600";
    if (auction.Status === Status.ENDED) return "from-gray-500 to-slate-600";
    return "from-red-500 to-rose-600";
  };

  const getStatusText = () => {
    if (isUpcoming) return "UPCOMING";
    if (auction.Status === Status.ACTIVE) return "LIVE";
    if (auction.Status === Status.ENDED) return "ENDED";
    return "CANCELLED";
  };

  // Function to resolve user ID to username from participants
  const resolveUserIdToUsername = (userId: string): string => {
    if (userId && !userId.includes('-') && userId.length < 20) {
      return userId; // Already a username
    }
    if (auction.participants && Array.isArray(auction.participants)) {
      const participant = auction.participants.find((p: any) =>
        p.id === userId || p.user_id === userId
      );
      if (participant) {
        return participant.user_name || 'Unknown User';
      }
    }
    return userId || 'Unknown User';
  };

  // Enhanced winner display with proper fallback
  const getWinnerDisplay = () => {
    if (auction.Status !== Status.ENDED) return null;
    const winnerName = auction.WinnerName || 
      (auction as any).winnerName || 
      (auction as any).winner_name ||
      (auction as any).winner?.name ||
      (auction as any).winner?.user_name ||
      (auction as any).winner?.userName ||
      (auction as any).highestBidder ||
      auction.highestBidder ||
      '';
    if (winnerName && winnerName.trim()) {
      const resolvedWinnerName = resolveUserIdToUsername(winnerName);
      return (
        <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                🏆 Winner: {resolvedWinnerName}
              </p>
              <p className="text-xs text-amber-600">
                Final bid: ₹{Number(auction.CurrentPrice || auction.StartingPrice || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-gray-500" />
          <p className="text-sm text-gray-600">No winner determined</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gray-900/95 backdrop-blur-lg border border-gray-800">
        <div className="relative">
          <img
            src={auction.Image || "/auction-placeholder.svg"}
            alt={auction.Title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/auction-placeholder.svg";
            }}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {(auction.categoryIds || []).map((categoryId) => {
              const category = categories[categoryId as Category];
              if (!category) return null;
              return (
                <div
                  key={`${auction.ID}-category-${categoryId}`}
                  className={`px-2 py-1 bg-gradient-to-r ${category.color} text-white rounded-lg text-xs font-medium`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </div>
              );
            })}
          </div>
          <div className="absolute top-3 right-3">
            <motion.div
              animate={auction.Status === Status.ACTIVE ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`px-3 py-1 bg-gradient-to-r ${getStatusColor()} text-white rounded-full text-xs font-bold flex items-center gap-1`}
            >
              {auction.Status === Status.ACTIVE && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
              {getStatusText()}
            </motion.div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{auction.Title || 'Untitled Auction'}</h3>
            <p className="text-gray-300 text-sm line-clamp-2">{auction.Description || 'No description available'}</p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400">Current Price</p>
              <p className="text-2xl font-bold text-white">₹{Number(auction.CurrentPrice || auction.StartingPrice || 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">{getTimeDisplay()}</p>
              <div className="flex items-center gap-1 text-gray-300">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{auction.ClientCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Winner Display */}
          {getWinnerDisplay()}

          <div className="flex items-center gap-3 mt-4">
            <Button asChild className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
              <Link href={`/auction/${auction.ID}`}>
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'past'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wsConnectionStatus, setWsConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error'>('disconnected');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [congratsVisible, setCongratsVisible] = useState(false);
  const [winnerData, setWinnerData] = useState<{
    winnerName: string;
    auctionTitle: string;
    finalBid: number;
    auctionImage?: string;
  } | null>(null);

  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfo();
  const { data: userStats, isLoading: isUserStatsLoading } = useUserStats();
  const { data: userAuctions, isLoading: isUserAuctionsLoading } = useUserAuctions();
  const { data: participatedAuctions, isLoading: isParticipatedAuctionsLoading } = useParticipatedAuctions();
  const { data: allAvailableAuctions, isLoading: isAllAuctionsLoading } = useAllAuctions();

  // Enhanced data refresh function with lower latency
  const refreshAllData = useCallback(async () => {
    setLastRefresh(new Date());
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['user', 'stats'] }),
        queryClient.invalidateQueries({ queryKey: ['user', 'auctions'] }),
        queryClient.invalidateQueries({ queryKey: ['user', 'participated-auctions'] }),
        queryClient.invalidateQueries({ queryKey: ['all-auctions'] }),
      ]);
      toast.success('Data refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh data');
    }
  }, [queryClient]);

  // Enhanced WebSocket connection management
  useEffect(() => {
    if (!user) return;

    // Set initial connection status
    setWsConnectionStatus('connecting');

    const handleAuctionEnded = () => {
      console.log('🏁 Auction ended - refreshing dashboard data');
      refreshAllData();
      
      // Check if the user won any auction
      setTimeout(async () => {
        try {
          const freshUserStats = await queryClient.fetchQuery({
            queryKey: ['user', 'stats'],
            queryFn: getUserStats,
          });
          
          const freshUserAuctions = await queryClient.fetchQuery({
            queryKey: ['user', 'auctions'],
            queryFn: getAuctionsOfUser,
          });
          
          // Check for newly won auctions
          const newWonAuctions = (freshUserAuctions?.data || []).filter((auction: AuctionResponse) => 
            auction.Status === Status.ENDED && 
            auction.WinnerName === user.user_name &&
            !userRelatedAuctions.some(prevAuction => 
              prevAuction.ID === auction.ID && prevAuction.Status === Status.ENDED
            )
          );
          
          if (newWonAuctions.length > 0) {
            const wonAuction = newWonAuctions[0];
            setWinnerData({
              winnerName: user.user_name || user.userName || 'You',
              auctionTitle: wonAuction.Title,
              finalBid: wonAuction.CurrentPrice,
              auctionImage: wonAuction.Image,
            });
            setCongratsVisible(true);
          } else {
            toast.info('🏁 An auction you participated in has ended!');
          }
        } catch (error) {
          console.error('Error checking for won auctions:', error);
          toast.info('🏁 An auction you participated in has ended!');
        }
      }, 1000); // Small delay to ensure data is fresh
    };

    const handleAuctionData = (data: any) => {
      console.log('📊 Auction data received:', data);
      // Invalidate specific auction queries for real-time updates
      queryClient.invalidateQueries({ queryKey: ['auction', data.auctionId] });
    };

    const handleBidUpdate = (bid: any) => {
      console.log('💰 New bid received:', bid);
      // Real-time bid notifications for user's auctions
      const isUserAuction = userRelatedAuctions.some(auction => 
        auction.ID === bid.auctionId || auction.id === bid.auctionId
      );
      
      if (isUserAuction && bid.userName !== user.user_name) {
        toast.info(`💰 New bid: ₹${bid.price.toLocaleString('en-IN')}`, {
          description: `${bid.userName} placed a bid on your auction`,
        });
      }
      
      // Refresh stats immediately for real-time updates
      queryClient.invalidateQueries({ queryKey: ['user', 'stats'] });
    };

    const handleConnected = (auctionId: string) => {
      setWsConnectionStatus('connected');
      console.log(`✅ Connected to auction: ${auctionId}`);
    };

    const handleDisconnected = (auctionId: string) => {
      setWsConnectionStatus('disconnected');
      console.log(`❌ Disconnected from auction: ${auctionId}`);
    };

    const handleError = (message: string) => {
      setWsConnectionStatus('error');
      console.error('❌ WebSocket error:', message);
    };

    // Attach enhanced event listeners
    auctionWebSocket.on('auctionEnded', handleAuctionEnded);
    auctionWebSocket.on('auctionData', handleAuctionData);
    auctionWebSocket.on('bidUpdate', handleBidUpdate);
    auctionWebSocket.on('connected', handleConnected);
    auctionWebSocket.on('disconnected', handleDisconnected);
    auctionWebSocket.on('error', handleError);

    // Try to maintain connection status
    const connectionStatusInterval = setInterval(() => {
      const status = auctionWebSocket.getConnectionStatus();
      setWsConnectionStatus(status.isConnected ? 'connected' : 'disconnected');
    }, 1000); // Check every second for low latency

    return () => {
      clearInterval(connectionStatusInterval);
      auctionWebSocket.off('auctionEnded', handleAuctionEnded);
      auctionWebSocket.off('auctionData', handleAuctionData);
      auctionWebSocket.off('bidUpdate', handleBidUpdate);
      auctionWebSocket.off('connected', handleConnected);
      auctionWebSocket.off('disconnected', handleDisconnected);
      auctionWebSocket.off('error', handleError);
    };
  }, [user, queryClient, refreshAllData]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAllData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshAllData]);

  const userRelatedAuctions = useMemo(() => {
    const created = userAuctions || [];
    const participated = participatedAuctions || [];
    
    console.log('🔍 Dashboard Debug - Created auctions:', created.length);
    console.log('🔍 Dashboard Debug - Participated auctions:', participated.length);
    console.log('🔍 Dashboard Debug - Created auction titles:', created.map((a: AuctionResponse) => a.Title));
    console.log('🔍 Dashboard Debug - Participated auction titles:', participated.map((a: AuctionResponse) => a.Title));
    
    // Look for TEST-101 specifically
    const testAuction = created.find((a: AuctionResponse) => a.Title?.includes('TEST-101'));
    if (testAuction) {
      console.log('🔍 TEST-101 found in created auctions:', {
        id: testAuction.ID,
        title: testAuction.Title,
        status: testAuction.Status,
        startDate: testAuction.StartDate,
        endDate: testAuction.EndDate,
        isActive: testAuction.isActive,
        user: testAuction.user
      });
    } else {
      console.log('🔍 TEST-101 NOT found in created auctions');
    }
    
    const combined = [...created, ...participated];
    console.log('🔍 Dashboard Debug - Combined auctions:', combined.length);
    
    return combined;
  }, [userAuctions, participatedAuctions]);

  const { activeAuctions, upcomingAuctions, pastAuctions } = useMemo(() => {
    const now = new Date();
    // Use global auctions for categorization
    const globalAuctions = allAvailableAuctions || [];

    const active = globalAuctions.filter(auction => {
      const startTime = new Date(auction.StartDate);
      const endTime = new Date(auction.EndDate);
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) return false;
      const isActiveByTime = now >= startTime && now < endTime;
      const isActiveByStatus = auction.Status === Status.ACTIVE;
      return isActiveByTime && isActiveByStatus;
    });

    const upcoming = globalAuctions.filter(auction => {
      const startTime = new Date(auction.StartDate);
      if (isNaN(startTime.getTime())) return false;
      const isUpcomingByTime = startTime > now;
      const isUpcomingByStatus = auction.Status === Status.INACTIVE;
      return isUpcomingByTime || isUpcomingByStatus;
    });

    const past = globalAuctions.filter(auction => {
      const endTime = new Date(auction.EndDate);
      if (isNaN(endTime.getTime())) return false;
      const isPastByTime = endTime <= now;
      const isPastByStatus = auction.Status === Status.ENDED;
      return isPastByTime || isPastByStatus;
    });

    return { activeAuctions: active, upcomingAuctions: upcoming, pastAuctions: past };
  }, [allAvailableAuctions]);

  const isLoading = isUserInfoLoading || isUserStatsLoading || isUserAuctionsLoading || isParticipatedAuctionsLoading || isAllAuctionsLoading;

  const filteredAuctions = useMemo(() => {
    let auctions;
    if (activeTab === 'active') auctions = activeAuctions;
    else if (activeTab === 'upcoming') auctions = upcomingAuctions;
    else auctions = pastAuctions;

    if (!searchQuery) return auctions;

    return auctions.filter(auction =>
      auction.Title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.Description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, activeAuctions, upcomingAuctions, pastAuctions, searchQuery]);

  const stats = [
    {
      icon: Gavel,
      title: "Total Auctions",
      value: userStats?.data?.auctions_created || 0,
      subtitle: "Created by you",
      gradient: "from-emerald-500 to-green-600"
    },
    {
      icon: Trophy,
      title: "Auctions Won",
      value: userStats?.data?.won_auctions || 0,
      subtitle: "Victory count",
      gradient: "from-amber-500 to-yellow-600"
    },
    {
      icon: TrendingUp,
      title: "Total Bids",
      value: userStats?.data?.total_bids || 0,
      subtitle: "All time",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: DollarSign,
      title: "Total Spent",
      value: `${userStats?.data?.total_amount_bid?.toLocaleString() || '0'}`,
      subtitle: "In auctions",
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-8 border-white/20 border-t-white rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">Please log in to view your dashboard.</p>
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/5 via-transparent to-amber-900/5"></div>
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.03) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                Welcome back,
                <span className="block bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                  {user.user_name || user.userName}!
                </span>
              </h1>
              <p className="text-emerald-100 text-lg">
                Manage your auctions and track your bidding activity
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Connection Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-lg rounded-lg">
                {wsConnectionStatus === 'connected' ? (
                  <Wifi className="w-4 h-4 text-green-300" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-300" />
                )}
                <span className="text-white text-sm">
                  {wsConnectionStatus === 'connected' ? 'Live' : 'Offline'}
                </span>
              </div>
              
              {/* Refresh Button */}
              <Button
                onClick={refreshAllData}
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Last Refresh Time */}
          <div className="text-emerald-100/80 text-sm">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={`stat-${stat.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-2xl bg-gray-900/95 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-800">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                <div className="flex gap-4">
                  <TabButton
                    active={activeTab === 'active'}
                    onClick={() => setActiveTab('active')}
                    icon={Flame}
                    label="Active"
                    count={activeAuctions.length}
                    gradient="from-emerald-500 to-green-600"
                  />
                  <TabButton
                    active={activeTab === 'upcoming'}
                    onClick={() => setActiveTab('upcoming')}
                    icon={Timer}
                    label="Upcoming"
                    count={upcomingAuctions.length}
                    gradient="from-amber-500 to-yellow-600"
                  />
                  <TabButton
                    active={activeTab === 'past'}
                    onClick={() => setActiveTab('past')}
                    icon={History}
                    label="Past"
                    count={pastAuctions.length}
                    gradient="from-teal-500 to-cyan-600"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search auctions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 border-2 focus:border-emerald-500 rounded-xl bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="flex rounded-xl border border-gray-700 overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-none"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Auctions Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredAuctions.length > 0 ? (
                    <div className={`grid gap-6 ${viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1'
                      }`}>
                      {filteredAuctions.map((auction, index) => (
                        <motion.div
                          key={`${activeTab}-auction-${auction.ID}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <AuctionCard
                            auction={auction}
                            isUpcoming={activeTab === 'upcoming'}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">
                        {activeTab === 'active' ? '🔥' : activeTab === 'upcoming' ? '⏰' : '📚'}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        No {activeTab} auctions
                      </h3>
                      <p className="text-gray-400 mb-6">
                        {activeTab === 'active'
                          ? "No active auctions available right now. Check back later or create your own!"
                          : activeTab === 'upcoming'
                          ? "You don't have any upcoming auctions. Create one to get started!"
                          : "You haven't participated in any completed auctions yet."
                        }
                      </p>
                      {(activeTab === 'upcoming' || activeTab === 'active') && (
                        <Button asChild className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
                          <Link href="/create-auction">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Auction
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl"
      >
        <Sparkles className="w-10 h-10 text-white" />
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl"
      >
        <Zap className="w-8 h-8 text-white" />
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