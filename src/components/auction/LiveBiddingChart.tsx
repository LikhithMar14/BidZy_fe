'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  Dot
} from 'recharts';
import { motion } from 'framer-motion';
import { Bid } from '@/types/bids';
import { getAuctionBidsDataLive } from '@/connecting/auction';
import { TrendingUp, Activity, Zap, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LiveBiddingChartProps {
  auctionId: string;
  currentUserName?: string;
  startingPrice: number;
  isActive: boolean;
}

interface ChartDataPoint {
  timestamp: string;
  time: string;
  amount: number;
  bidder: string;
  isUserBid: boolean;
  bidNumber: number;
}

interface BidStats {
  totalBids: number;
  averageBidIncrease: number;
  highestBid: number;
  lowestBid: number;
  topBidder: string;
  bidsInLastMinute: number;
  bidVelocity: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-xl border border-gray-200">
        <div className="text-sm font-semibold text-gray-900 mb-2">
          Bid #{data.bidNumber}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-green-600">${data.amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">Bidder:</span>
            <span className={`font-medium ${data.isUserBid ? 'text-blue-600' : 'text-gray-900'}`}>
              {data.bidder} {data.isUserBid && '(You)'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">Time:</span>
            <span className="text-gray-900">{data.time}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (payload.isUserBid) {
    return (
      <Dot 
        cx={cx} 
        cy={cy} 
        r={6} 
        fill="#3B82F6" 
        stroke="#1E40AF" 
        strokeWidth={2}
      />
    );
  }
  return null;
};

export const LiveBiddingChart: React.FC<LiveBiddingChartProps> = ({
  auctionId,
  currentUserName,
  startingPrice,
  isActive
}) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [animateNewBid, setAnimateNewBid] = useState(false);

  const fetchBids = async () => {
    try {
      const bidsData = await getAuctionBidsDataLive(auctionId);
      if (bidsData && bidsData.length > 0) {
        const previousLength = bids.length;
        setBids(bidsData);
        setLastUpdate(new Date());
        
        if (bidsData.length > previousLength && previousLength > 0) {
          setAnimateNewBid(true);
          setTimeout(() => setAnimateNewBid(false), 1000);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching bids:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
    
    if (isActive) {
      const interval = setInterval(fetchBids, 3000);
      return () => clearInterval(interval);
    }
  }, [auctionId, isActive]);

  const chartData = useMemo((): ChartDataPoint[] => {
    if (!bids.length) return [];

    return bids.map((bid, index) => ({
      timestamp: bid.created_at,
      time: new Date(bid.created_at).toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      amount: bid.amount,
      bidder: bid.bidder,
      isUserBid: bid.bidder === currentUserName,
      bidNumber: index + 1
    }));
  }, [bids, currentUserName]);

  const bidStats = useMemo((): BidStats => {
    if (!bids.length) {
      return {
        totalBids: 0,
        averageBidIncrease: 0,
        highestBid: startingPrice,
        lowestBid: startingPrice,
        topBidder: '',
        bidsInLastMinute: 0,
        bidVelocity: 0
      };
    }

    const amounts = bids.map(bid => bid.amount);
    const highestBid = Math.max(...amounts);
    const lowestBid = Math.min(...amounts);
    
    const increases = [];
    for (let i = 1; i < amounts.length; i++) {
      increases.push(amounts[i] - amounts[i - 1]);
    }
    const averageBidIncrease = increases.length > 0 ? 
      increases.reduce((sum, inc) => sum + inc, 0) / increases.length : 0;

    const topBidder = bids[bids.length - 1]?.bidder || '';

    const oneMinuteAgo = new Date(Date.now() - 60000);
    const bidsInLastMinute = bids.filter(bid => 
      new Date(bid.created_at) > oneMinuteAgo
    ).length;

    const firstBidTime = new Date(bids[0].created_at).getTime();
    const lastBidTime = new Date(bids[bids.length - 1].created_at).getTime();
    const timeSpanMinutes = (lastBidTime - firstBidTime) / (1000 * 60);
    const bidVelocity = timeSpanMinutes > 0 ? bids.length / timeSpanMinutes : 0;

    return {
      totalBids: bids.length,
      averageBidIncrease,
      highestBid,
      lowestBid,
      topBidder,
      bidsInLastMinute,
      bidVelocity
    };
  }, [bids, startingPrice]);

  if (isLoading) {
    return (
      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            Live Bidding Chart
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading chart data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"
              animate={animateNewBid ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                Live Bidding Chart
                {isActive && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">LIVE</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 font-normal">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {bidStats.totalBids} bids
            </Badge>
            {bidStats.bidsInLastMinute > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 bg-orange-50 text-orange-700 border-orange-300">
                <Zap className="w-3 h-3" />
                {bidStats.bidsInLastMinute} in 1min
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {chartData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-600 mb-2">No bids yet</p>
            <p className="text-sm text-gray-500">Chart will update as bids come in</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">
                  ${bidStats.highestBid.toFixed(2)}
                </div>
                <div className="text-xs text-green-700 font-medium">Highest Bid</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">
                  {bidStats.totalBids}
                </div>
                <div className="text-xs text-blue-700 font-medium">Total Bids</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">
                  ${bidStats.averageBidIncrease.toFixed(0)}
                </div>
                <div className="text-xs text-purple-700 font-medium">Avg Increase</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">
                  {bidStats.bidVelocity.toFixed(1)}
                </div>
                <div className="text-xs text-orange-700 font-medium">Bids/Min</div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  <ReferenceLine 
                    y={startingPrice} 
                    stroke="#10B981" 
                    strokeDasharray="5 5"
                    label={{ value: "Starting Price", position: "top" }}
                  />
                  
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="url(#bidGradient)"
                    connectNulls
                  />
                  
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#1E40AF"
                    strokeWidth={2}
                    dot={<CustomDot />}
                    activeDot={{ r: 8, fill: '#EF4444', stroke: '#DC2626', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {bidStats.topBidder && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-900">Current Leader</span>
                </div>
                <div className="text-lg font-bold text-amber-800">
                  {bidStats.topBidder} {bidStats.topBidder === currentUserName && '(You!)'}
                </div>
                <div className="text-sm text-amber-700">
                  Leading with ${bidStats.highestBid.toFixed(2)}
                </div>
              </motion.div>
            )}

            {isActive && bidStats.bidsInLastMinute > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    High Activity: {bidStats.bidsInLastMinute} bids in the last minute!
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveBiddingChart; 