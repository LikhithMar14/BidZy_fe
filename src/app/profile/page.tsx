"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
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
  Edit3,
  Camera,
  Crown,
  Sparkles,
  Target,
  Activity,
  Users,
  ChevronRight,
  Filter,
  Search,
  Mail,
  Shield,
  BadgeCheck,
  Gem,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserInfo, getUserStats, getAuctionsOfUser, getBidsOfUser, getParticipatedAuctions } from "@/connecting/user";
import { User as UserType, UserStats } from "@/types/user";
import { AuctionResponse } from "@/types/auction";
import { Bid } from "@/types/bids";

// Custom hooks for data fetching with TanStack Query
const useUserInfo = () => {
  return useQuery({
    queryKey: ['user', 'info'],
    queryFn: getUserInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const useUserStats = () => {
  return useQuery({
    queryKey: ['user', 'stats'],
    queryFn: getUserStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

const useUserAuctions = () => {
  return useQuery({
    queryKey: ['user', 'auctions'],
    queryFn: getAuctionsOfUser,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

const useUserBids = () => {
  return useQuery({
    queryKey: ['user', 'bids'],
    queryFn: getBidsOfUser,
    staleTime: 30 * 1000, // 30 seconds
  });
};

const useParticipatedAuctions = () => {
  return useQuery({
    queryKey: ['user', 'participated-auctions'],
    queryFn: getParticipatedAuctions,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

interface StatCardProps {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  gradient: string;
}

const StatCard = ({ icon: Icon, title, value, subtitle, trend, gradient }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="group"
    whileHover={{ scale: 1.02 }}
  >
    <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-15 transition-opacity duration-300`} />
      <CardContent className="relative p-8">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          {trend && (
            <div className={`px-3 py-2 rounded-full text-sm font-bold shadow-md ${
              trend === 'up' ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white' : 
              trend === 'down' ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white' : 
              'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
            }`}>
              {trend === 'up' ? '↗ +12%' : trend === 'down' ? '↘ -5%' : '→ 0%'}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
          <p className="text-gray-700 text-lg font-semibold">{title}</p>
          {subtitle && <p className="text-gray-500 text-sm font-medium">{subtitle}</p>}
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      </CardContent>
    </Card>
  </motion.div>
);

interface AuctionCardProps {
  auction: AuctionResponse;
  type: "created" | "participated" | "won";
}

const AuctionCard = ({ auction, type }: AuctionCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="group"
  >
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
      <div className="relative">
        <img 
          src={auction.image || "/api/placeholder/300/200"} 
          alt={auction.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            type === "created" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" :
            type === "won" ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" :
            "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
          }`}>
            {type === "created" ? "Created" : type === "won" ? "Won" : "Participated"}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="p-2 bg-black/50 rounded-lg backdrop-blur-sm">
            <span className="text-white text-sm font-medium">
              ${auction.currentPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-pink-600 transition-colors">
            {auction.title}
          </h3>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{auction.clientCount}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {auction.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              auction.status === "ACTIVE" ? "bg-emerald-500" : 
              auction.status === "ENDED" ? "bg-gray-400" : "bg-red-500"
            }`} />
            <span className="text-sm font-medium text-gray-700 capitalize">
              {auction.status.toLowerCase()}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Current Bid</p>
            <p className="font-bold text-lg bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              ${auction.currentPrice.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(auction.endTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(auction.endTime).toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

interface BidCardProps {
  bid: Bid;
}

const BidCard = ({ bid }: BidCardProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="border-l-4 border-l-gradient-to-b from-pink-500 to-rose-500 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg">
              <Gavel className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">${bid.amount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Auction ID: {bid.auctionId.slice(0, 8)}...</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              {new Date(bid.createdAt || "").toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(bid.createdAt || "").toLocaleTimeString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"auctions" | "bids" | "participated">("auctions");

  // Use TanStack Query hooks for data fetching
  const { data: user, isLoading: userLoading, error: userError } = useUserInfo();
  console.log("USER", user)
  const { data: userStatsResponse, isLoading: statsLoading, error: statsError } = useUserStats();
  console.log("USER STATS", userStatsResponse)
  const { data: userAuctions = [], isLoading: auctionsLoading, error: auctionsError } = useUserAuctions();
  console.log("USER AUCTIONS", userAuctions)
  const { data: userBids = [], isLoading: bidsLoading, error: bidsError } = useUserBids();
  console.log("USER BIDS", userBids)
  const { data: participatedAuctions = [], isLoading: participatedLoading, error: participatedError } = useParticipatedAuctions();
  console.log("PARTICIPATED AUCTIONS", participatedAuctions)

  // Determine if any query is loading
  const isLoading = userLoading || statsLoading || auctionsLoading || bidsLoading || participatedLoading;

  // Check for any errors
  const hasError = userError || statsError || auctionsError || bidsError || participatedError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error loading profile</div>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  const stats = userStatsResponse?.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-amber-50/40">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-300/20 to-rose-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-60 right-20 w-96 h-96 bg-gradient-to-br from-amber-300/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-br from-white via-pink-50/80 to-rose-50/60 overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Floating Golden Sparkles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Profile Avatar with Luxury Design */}
            <div className="relative inline-block mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring", stiffness: 100 }}
                className="relative"
              >
                <div className="w-40 h-40 mx-auto bg-gradient-to-br from-white to-gray-50 rounded-full p-2 shadow-2xl ring-4 ring-white/80">
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-inner">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                </div>
                
                {/* Premium Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-full p-3 shadow-xl"
                >
                  <Crown className="h-8 w-8 text-white" />
                </motion.div>
                
                {/* Verification Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                  className="absolute -bottom-3 -left-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full p-2 shadow-lg"
                >
                  <BadgeCheck className="h-6 w-6 text-white" />
                </motion.div>
              </motion.div>
              
              {/* Floating Ring Animation */}
              <motion.div
                className="absolute inset-0 border-2 border-gradient-to-r from-pink-300 via-rose-300 to-purple-300 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            {/* User Info with Elegant Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-3 tracking-tight">
                {user?.username || "Elite Bidder"}
              </h1>
              
              <div className="flex items-center justify-center space-x-3 mb-2">
                <Mail className="h-5 w-5 text-gray-600" />
                <p className="text-xl text-gray-700 font-medium">{user?.email}</p>
                <Gem className="h-5 w-5 text-pink-500" />
              </div>
              
              <p className="text-gray-600 mb-2 flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Verified Member since {new Date(user?.createdAt || "").toLocaleDateString()}</span>
              </p>
              
              <div className="flex items-center justify-center space-x-4 mb-8">
                <span className="px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full text-sm font-semibold">
                  🏆 Premium Member
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                  ⚡ Power Bidder
                </span>
              </div>
            </motion.div>
            
            {/* Action Buttons with Luxury Styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center justify-center space-x-6"
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Edit3 className="h-5 w-5 mr-3" />
                Edit Profile
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/80 hover:bg-white border-2 border-pink-200 hover:border-pink-300 text-gray-700 font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Button>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 hover:from-amber-500 hover:via-yellow-600 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Zap className="h-5 w-5 mr-3" />
                Upgrade Plan
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Grid with Enhanced Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Your Auction Journey</h2>
            <p className="text-gray-600 text-lg">Track your bidding success and auction performance</p>
          </div>

          {/* Primary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <StatCard
              icon={Gavel}
              title="Auctions Created"
              value={stats?.auctions_created || 0}
              gradient="from-pink-500 to-rose-600"
              trend="up"
            />
            <StatCard
              icon={Target}
              title="Total Bids"
              value={stats?.total_bids || 0}
              gradient="from-purple-500 to-pink-500"
              trend="up"
            />
            <StatCard
              icon={DollarSign}
              title="Total Bid Amount"
              value={`$${(stats?.total_bids_amount || 0).toLocaleString()}`}
              gradient="from-amber-500 to-orange-500"
              trend="up"
            />
            <StatCard
              icon={Trophy}
              title="Auctions Won"
              value={stats?.won_auctions || 0}
              gradient="from-yellow-400 to-amber-500"
              trend="up"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <StatCard
              icon={Activity}
              title="Participated Auctions"
              value={stats?.participated_auctions || 0}
              subtitle="Active participation"
              gradient="from-rose-400 to-pink-500"
            />
            <StatCard
              icon={TrendingUp}
              title="Average Bid"
              value={`$${(stats?.avg_bid_amount || 0).toLocaleString()}`}
              subtitle="Per auction"
              gradient="from-indigo-500 to-purple-500"
            />
            <StatCard
              icon={Star}
              title="Highest Bid"
              value={`$${(stats?.highest_bid_amount || 0).toLocaleString()}`}
              subtitle="Personal record"
              gradient="from-amber-400 to-yellow-400"
            />
          </div>
        </motion.div>

        {/* Activity Tabs with Luxury Design */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="bg-gradient-to-r from-white via-pink-50/50 to-rose-50/50 border-b border-pink-100">
            <div className="flex space-x-2 px-8 py-2">
              {[
                { key: "auctions", label: "My Auctions", count: userAuctions.length, icon: Gavel },
                { key: "bids", label: "My Bids", count: userBids.length, icon: Target },
                { key: "participated", label: "Participated", count: participatedAuctions.length, icon: Users },
              ].map((tab) => (
                <motion.button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative py-4 px-6 font-semibold text-sm transition-all duration-300 rounded-2xl ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    <span className={`py-1 px-3 rounded-full text-xs font-bold ${
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700"
                    }`}>
                      {tab.count}
                    </span>
                  </div>
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === "auctions" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 mb-2">Your Auctions</h3>
                    <p className="text-gray-600">Manage and track your auction listings</p>
                  </div>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <Sparkles className="h-5 w-5 mr-3" />
                    Create New Auction
                  </Button>
                </div>
                {userAuctions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {userAuctions.map((auction, index) => (
                      <motion.div
                        key={auction.auctionId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <AuctionCard auction={auction} type="created" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-20 bg-gradient-to-br from-pink-50/50 to-rose-50/50 rounded-3xl border-2 border-dashed border-pink-200"
                  >
                    <div className="p-6 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <Gavel className="h-12 w-12 text-pink-600" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-3">No auctions created yet</h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">Start your auction journey by creating your first listing and reach thousands of potential bidders!</p>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Create Your First Auction
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === "bids" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 mb-2">Your Bids</h3>
                    <p className="text-gray-600">Track all your bidding activity and history</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="outline" 
                      className="bg-white border-2 border-pink-200 hover:border-pink-300 text-gray-700 font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button 
                      variant="outline"
                      className="bg-white border-2 border-pink-200 hover:border-pink-300 text-gray-700 font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
                {userBids.length > 0 ? (
                  <div className="space-y-4">
                    {userBids.map((bid, index) => (
                      <motion.div
                        key={bid.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <BidCard bid={bid} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-20 bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-3xl border-2 border-dashed border-purple-200"
                  >
                    <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <Target className="h-12 w-12 text-purple-600" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-3">No bids placed yet</h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">Start bidding on exciting auctions and compete with other bidders for amazing items!</p>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <Target className="h-5 w-5 mr-2" />
                      Start Bidding
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === "participated" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 mb-2">Participated Auctions</h3>
                    <p className="text-gray-600">All auctions you've joined and bid on</p>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-xl font-semibold">
                    {participatedAuctions.length} auctions
                  </div>
                </div>
                {participatedAuctions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {participatedAuctions.map((auction, index) => (
                      <motion.div
                        key={auction.auctionId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <AuctionCard auction={auction} type="participated" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-20 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-3xl border-2 border-dashed border-blue-200"
                  >
                    <div className="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <Users className="h-12 w-12 text-blue-600" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-3">No participated auctions</h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">Join exciting auctions, place bids, and compete with other members to win amazing items!</p>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Explore Auctions
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="h-20" />
      </div>
    </div>
  );
} 