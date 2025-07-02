import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  auctionWebSocket, 
  AuctionConnection, 
  AuctionData, 
  Bid, 
  BidResult 
} from '../connecting/ws-singleton';

export interface UseAuctionWebSocketReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  
  // Auction data
  auctionData: AuctionData | null;
  currentBids: Bid[];
  participantCount: number;
  
  // Connection methods
  connect: (connection: AuctionConnection) => Promise<boolean>;
  disconnect: () => void;
  join: () => void;
  leave: () => void;
  
  // Auction actions
  placeBid: (amount: number) => BidResult;
  getAuctionData: () => void;
  getCurrentBid: () => void;
  
  // Utility methods
  getConnectionStatus: () => { isConnected: boolean; auctionId?: string };
  isConnectedToAuction: (auctionId: string) => boolean;
}

export const useAuctionWebSocket = (): UseAuctionWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [auctionData, setAuctionData] = useState<AuctionData | null>(null);
  const [currentBids, setCurrentBids] = useState<Bid[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  
  const eventListenersRef = useRef<Set<() => void>>(new Set());

  // Cleanup function to remove all event listeners
  const cleanupEventListeners = useCallback(() => {
    eventListenersRef.current.forEach(cleanup => cleanup());
    eventListenersRef.current.clear();
  }, []);

  // Setup event listeners
  const setupEventListeners = useCallback(() => {
    const cleanupFunctions: (() => void)[] = [];

    // Connected event
    const onConnected = (auctionId: string) => {
      setIsConnected(true);
      setIsConnecting(false);
      setConnectionError(null);
      console.log('Connected to auction:', auctionId);
    };
    auctionWebSocket.on('connected', onConnected);
    cleanupFunctions.push(() => auctionWebSocket.off('connected', onConnected));

    // Disconnected event
    const onDisconnected = (auctionId: string) => {
      setIsConnected(false);
      setIsConnecting(false);
      console.log('Disconnected from auction:', auctionId);
    };
    auctionWebSocket.on('disconnected', onDisconnected);
    cleanupFunctions.push(() => auctionWebSocket.off('disconnected', onDisconnected));

    // Auction data event
    const onAuctionData = (data: AuctionData) => {
      setAuctionData(data);
    };
    auctionWebSocket.on('auctionData', onAuctionData);
    cleanupFunctions.push(() => auctionWebSocket.off('auctionData', onAuctionData));

    // Bid update event
    const onBidUpdate = (bid: Bid) => {
      setCurrentBids(prev => [...prev, bid]);
    };
    auctionWebSocket.on('bidUpdate', onBidUpdate);
    cleanupFunctions.push(() => auctionWebSocket.off('bidUpdate', onBidUpdate));

    // User joined event
    const onUserJoined = (userId: string, userName: string) => {
      console.log('User joined:', userId, userName);
    };
    auctionWebSocket.on('userJoined', onUserJoined);
    cleanupFunctions.push(() => auctionWebSocket.off('userJoined', onUserJoined));

    // User left event
    const onUserLeft = (userId: string) => {
      console.log('User left:', userId);
    };
    auctionWebSocket.on('userLeft', onUserLeft);
    cleanupFunctions.push(() => auctionWebSocket.off('userLeft', onUserLeft));

    // Error event
    const onError = (message: string) => {
      // setConnectionError(message);
      // console.error('WebSocket error:', message);
    };
    auctionWebSocket.on('error', onError);
    cleanupFunctions.push(() => auctionWebSocket.off('error', onError));

    // Success event
    const onSuccess = (message: string) => {
      console.log('WebSocket success:', message);
    };
    auctionWebSocket.on('success', onSuccess);
    cleanupFunctions.push(() => auctionWebSocket.off('success', onSuccess));

    // Count update event
    const onCountUpdate = (count: number) => {
      setParticipantCount(count);
    };
    auctionWebSocket.on('countUpdate', onCountUpdate);
    cleanupFunctions.push(() => auctionWebSocket.off('countUpdate', onCountUpdate));

    // Auction ended event
    const onAuctionEnded = () => {
      console.log('Auction ended');
    };
    auctionWebSocket.on('auctionEnded', onAuctionEnded);
    cleanupFunctions.push(() => auctionWebSocket.off('auctionEnded', onAuctionEnded));

    // Store cleanup functions
    eventListenersRef.current = new Set(cleanupFunctions);
  }, []);

  // Connect to auction
  const connect = useCallback(async (connection: AuctionConnection): Promise<boolean> => {
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      const success = await auctionWebSocket.connect(connection);
      if (!success) {
        setConnectionError('Failed to connect to auction');
      }
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
      setConnectionError(errorMessage);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect from auction
  const disconnect = useCallback(() => {
    auctionWebSocket.disconnect();
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionError(null);
  }, []);

  // Join auction
  const join = useCallback(() => {
    auctionWebSocket.joinAuction();
  }, []);

  // Leave auction
  const leave = useCallback(() => {
    auctionWebSocket.leaveAuction();
  }, []);

  // Place bid
  const placeBid = useCallback((amount: number): BidResult => {
    return auctionWebSocket.placeBid(amount);
  }, []);

  // Get auction data
  const getAuctionData = useCallback(() => {
    auctionWebSocket.getAuctionData();
  }, []);

  // Get current bid
  const getCurrentBid = useCallback(() => {
    auctionWebSocket.getCurrentBid();
  }, []);

  // Get connection status
  const getConnectionStatus = useCallback(() => {
    return auctionWebSocket.getConnectionStatus();
  }, []);

  // Check if connected to specific auction
  const isConnectedToAuction = useCallback((auctionId: string): boolean => {
    return auctionWebSocket.isConnectedToAuction(auctionId);
  }, []);

  // Setup event listeners on mount
  useEffect(() => {
    setupEventListeners();
    
    // Cleanup on unmount
    return () => {
      cleanupEventListeners();
    };
  }, [setupEventListeners, cleanupEventListeners]);

  return {
    // Connection state
    isConnected,
    isConnecting,
    connectionError,
    
    // Auction data
    auctionData,
    currentBids,
    participantCount,
    
    // Connection methods
    connect,
    disconnect,
    join,
    leave,
    
    // Auction actions
    placeBid,
    getAuctionData,
    getCurrentBid,
    
    // Utility methods
    getConnectionStatus,
    isConnectedToAuction,
  };
};

// Hook for managing bid history
export const useBidHistory = (maxBids: number = 50) => {
  const [bids, setBids] = useState<Bid[]>([]);

  const addBid = useCallback((bid: Bid) => {
    setBids(prev => {
      const newBids = [bid, ...prev];
      return newBids.slice(0, maxBids);
    });
  }, [maxBids]);

  const clearBids = useCallback(() => {
    setBids([]);
  }, []);

  return {
    bids,
    addBid,
    clearBids,
  };
};

// Hook for managing auction participants
export const useAuctionParticipants = () => {
  const [participants, setParticipants] = useState<string[]>([]);

  const addParticipant = useCallback((userId: string) => {
    setParticipants(prev => {
      if (!prev.includes(userId)) {
        return [...prev, userId];
      }
      return prev;
    });
  }, []);

  const removeParticipant = useCallback((userId: string) => {
    setParticipants(prev => prev.filter(id => id !== userId));
  }, []);

  const clearParticipants = useCallback(() => {
    setParticipants([]);
  }, []);

  return {
    participants,
    addParticipant,
    removeParticipant,
    clearParticipants,
  };
}; 