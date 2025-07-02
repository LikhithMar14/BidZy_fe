export type MessageType = 
  | 'auction' 
  | 'bid' 
  | 'error' 
  | 'ping' 
  | 'pong' 
  | 'count' 
  | 'auction_data' 
  | 'user_joined' 
  | 'user_left' 
  | 'bid_update' 
  | 'success';

export type AuctionAction = 
  | 'join' 
  | 'leave' 
  | 'place_bid' 
  | 'current_bid' 
  | 'bid_rejected' 
  | 'bid_accepted' 
  | 'get_auction_data' 
  | 'auction_started' 
  | 'auction_ended';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface AuctionData {
  auctionId: string;
  title?: string;
  description?: string;
  startingPrice?: number;
  currentPrice: number;
  highestBidder?: string;
  clientCount: number;
  isActive: boolean;
  status: string;
  startTime?: string;
  endTime?: string;
  increment: number;
  image: string;
  user: User;
  categoryIds: number[];
  participants: User[];
}

export interface Bid {
  senderId: string;
  price: number;
  timestamp: string;
  userName?: string;
}

export interface WebSocketMessage {
  type: MessageType;
  action?: AuctionAction;
  auctionId: string;
  senderId?: string;
  biddingPrice?: number;
  content?: string;
  timestamp: string;
  count?: number;
  success?: boolean;
  data?: any;
  userName?: string;
}

export interface AuctionConnection {
  auctionId: string;
  token?: string; // Optional since we'll get it from cookies
  userId: string;
  userName: string;
}

export interface BidResult {
  success: boolean;
  message: string;
  minRequired?: number;
}

// Client-side cookie utility functions
function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  return null;
}

function getTokenFromCookies(): string | null {
  const token = getCookieValue('auth_token');
  console.log('🍪 Getting token from cookies:', { 
    token: token ? `${token.substring(0, 20)}...` : null,
    allCookies: typeof document !== 'undefined' ? document.cookie : 'undefined'
  });
  return token;
}

function getUserIdFromCookies(): string | null {
  return getCookieValue('user_id');
}

function getUsernameFromCookies(): string | null {
  return getCookieValue('username');
}

export interface AuctionEvents {
  connected: (auctionId: string) => void;
  disconnected: (auctionId: string) => void;
  auctionData: (data: AuctionData) => void;
  bidUpdate: (bid: Bid) => void;
  userJoined: (userId: string, userName: string) => void;
  userLeft: (userId: string) => void;
  error: (message: string) => void;
  success: (message: string) => void;
  countUpdate: (count: number) => void;
  auctionEnded: () => void;
}

class WebSocketClient {
  private static instance: WebSocketClient;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private pingInterval: NodeJS.Timeout | null = null;
  private pongTimeout: NodeJS.Timeout | null = null;
  private eventListeners: Map<keyof AuctionEvents, Set<Function>> = new Map();
  private currentConnection: AuctionConnection | null = null;
  private isConnecting = false;
  private isConnected = false;

  private constructor() {
    this.initializeEventListeners();
  }

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  public async connect(connection: AuctionConnection): Promise<boolean> {
    if (this.isConnecting) {
      console.warn('Connection already in progress');
      return false;
    }

    if (this.isConnected && this.currentConnection?.auctionId === connection.auctionId) {
      console.log('Already connected to this auction');
      return true;
    }

    this.isConnecting = true;
    
    // Enhance connection with data from cookies if not provided
    const enhancedConnection: AuctionConnection = {
      ...connection,
      userId: connection.userId || getUserIdFromCookies() || '',
      userName: connection.userName || getUsernameFromCookies() || ''
    };
    
    this.currentConnection = enhancedConnection;

    try {
      const url = this.buildWebSocketUrl(enhancedConnection);
      console.log('🔗 Attempting to connect to WebSocket:', url);
      this.ws = new WebSocket(url);

      return new Promise((resolve) => {
        const connectionTimeout = setTimeout(() => {
          console.error('⏰ WebSocket connection timeout');
          this.isConnecting = false;
          if (this.ws) {
            this.ws.close();
          }
          resolve(false);
        }, 10000); // 10 second timeout

        this.ws!.onopen = () => {
          console.log(`✅ Connected to auction: ${enhancedConnection.auctionId}`);
          clearTimeout(connectionTimeout);
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          this.startPingInterval();
          this.emit('connected', enhancedConnection.auctionId);
          resolve(true);
        };

        this.ws!.onclose = (event) => {
          console.log(`❌ Disconnected from auction: ${enhancedConnection.auctionId}`, {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });
          clearTimeout(connectionTimeout);
          this.isConnected = false;
          this.isConnecting = false;
          this.stopPingInterval();
          this.emit('disconnected', enhancedConnection.auctionId);
          
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws!.onerror = (error) => {
          // console.error('🚨 WebSocket error:', {
          //   error,
          //   url,
          //   readyState: this.ws?.readyState,
          //   connection: enhancedConnection
          // });
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          this.emit('error', `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          resolve(false);
        };

        this.ws!.onmessage = (event) => {
          this.handleMessage(event.data);
        };
      });
    } catch (error) {
      console.error('💥 Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.emit('error', `Failed to create connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.currentConnection = null;
    this.stopPingInterval();
  }

  public isConnectedToAuction(auctionId: string): boolean {
    return this.isConnected && this.currentConnection?.auctionId === auctionId;
  }

  public joinAuction(): void {
    if (!this.isConnected || !this.currentConnection) {
      this.emit('error', 'Not connected to auction');
      return;
    }

    const message: WebSocketMessage = {
      type: 'auction',
      action: 'join',
      auctionId: this.currentConnection.auctionId,
      senderId: this.currentConnection.userId,
      userName: this.currentConnection.userName,
      timestamp: new Date().toISOString()
    };

    this.sendMessage(message);
  }

  public leaveAuction(): void {
    if (!this.isConnected || !this.currentConnection) {
      return;
    }

    const message: WebSocketMessage = {
      type: 'auction',
      action: 'leave',
      auctionId: this.currentConnection.auctionId,
      senderId: this.currentConnection.userId,
      userName: this.currentConnection.userName,
      timestamp: new Date().toISOString()
    };

    this.sendMessage(message);
    this.disconnect();
  }

  public placeBid(amount: number): BidResult {
    if (!this.isConnected || !this.currentConnection) {
      return { success: false, message: 'Not connected to auction' };
    }

    if (amount <= 0) {
      return { success: false, message: 'Bid amount must be positive' };
    }

    const message: WebSocketMessage = {
      type: 'bid',
      action: 'place_bid',
      auctionId: this.currentConnection.auctionId,
      senderId: this.currentConnection.userId,
      biddingPrice: amount,
      userName: this.currentConnection.userName,
      timestamp: new Date().toISOString()
    };

    this.sendMessage(message);
    return { success: true, message: 'Bid submitted' };
  }

  public getAuctionData(): void {
    if (!this.isConnected || !this.currentConnection) {
      this.emit('error', 'Not connected to auction');
      return;
    }

    const message: WebSocketMessage = {
      type: 'auction',
      action: 'get_auction_data',
      auctionId: this.currentConnection.auctionId,
      senderId: this.currentConnection.userId,
      userName: this.currentConnection.userName,
      timestamp: new Date().toISOString()
    };

    this.sendMessage(message);
  }

  public getCurrentBid(): void {
    if (!this.isConnected || !this.currentConnection) {
      this.emit('error', 'Not connected to auction');
      return;
    }

    const message: WebSocketMessage = {
      type: 'auction',
      action: 'current_bid',
      auctionId: this.currentConnection.auctionId,
      senderId: this.currentConnection.userId,
      userName: this.currentConnection.userName,
      timestamp: new Date().toISOString()
    };

    this.sendMessage(message);
  }

  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);
      console.log('Received message:', message);

      switch (message.type) {
        case 'auction_data':
          this.handleAuctionData(message);
          break;
        case 'bid_update':
          this.handleBidUpdate(message);
          break;
        case 'user_joined':
          this.handleUserJoined(message);
          break;
        case 'user_left':
          this.handleUserLeft(message);
          break;
        case 'error':
          this.handleError(message);
          break;
        case 'success':
          this.handleSuccess(message);
          break;
        case 'count':
          this.handleCountUpdate(message);
          break;
        case 'pong':
          this.handlePong();
          break;
        default:
          // Handle auction actions (auction_ended, etc.)
          if (message.action === 'auction_ended') {
            this.handleAuctionEnded(message);
          } else {
            console.warn('Unknown message type:', message.type, 'Action:', message.action);
          }
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
      this.emit('error', 'Invalid message format');
    }
  }

  private handleAuctionData(message: WebSocketMessage): void {
    if (message.data) {
      this.emit('auctionData', message.data as AuctionData);
    }
  }

  private handleBidUpdate(message: WebSocketMessage): void {
    const bid: Bid = {
      senderId: message.senderId || '',
      price: message.biddingPrice || 0,
      timestamp: message.timestamp,
      userName: message.userName
    };
    this.emit('bidUpdate', bid);
  }

  private handleUserJoined(message: WebSocketMessage): void {
    this.emit('userJoined', message.senderId || '', message.userName || '');
  }

  private handleUserLeft(message: WebSocketMessage): void {
    this.emit('userLeft', message.senderId || '');
  }

  private handleError(message: WebSocketMessage): void {
    this.emit('error', message.content || 'Unknown error');
  }

  private handleSuccess(message: WebSocketMessage): void {
    this.emit('success', message.content || 'Operation successful');
  }

  private handleCountUpdate(message: WebSocketMessage): void {
    this.emit('countUpdate', message.count || 0);
  }

  private handleAuctionEnded(message: WebSocketMessage): void {
    console.log('🏁 Auction ended received:', message);
    this.emit('auctionEnded');
  }

  private handlePong(): void {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  private sendMessage(message: WebSocketMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.emit('error', 'WebSocket not connected');
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('Failed to send message:', error);
      this.emit('error', 'Failed to send message');
    }
  }

  private buildWebSocketUrl(connection: AuctionConnection): string {
    // WebSocket endpoint is at root level, not under /api/v1
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    // Remove /api/v1 from the URL and convert to WebSocket
    const baseUrl = apiUrl.replace('/api/v1', '').replace('http://', 'ws://').replace('https://', 'wss://');
    
    // For debugging: Check if WebSocket is disabled
    if (process.env.NEXT_PUBLIC_DISABLE_WEBSOCKET === 'true') {
      console.warn('🚫 WebSocket disabled via environment variable');
      throw new Error('WebSocket disabled for debugging');
    }
    
    // Get token from multiple sources (priority order):
    // 1. Provided in connection
    // 2. From cookies
    // 3. From auth store (if available)
    let token = connection.token || getTokenFromCookies();
    
    // Try to get from auth store as fallback
    if (!token && typeof window !== 'undefined') {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          console.log('🔍 Auth storage contents:', parsed);
          if (parsed?.state?.token) {
            token = parsed.state.token;
            console.log('🔑 Found token in auth storage');
          } else if (parsed?.state?.user && parsed?.state?.isAuthenticated) {
            console.log('🔑 User is authenticated but no token in storage');
          }
        }
      } catch (error) {
        console.warn('Failed to read auth storage:', error);
      }
    }
    
    if (!token) {
      console.error('❌ No authentication token found:', {
        providedToken: !!connection.token,
        cookieToken: !!getTokenFromCookies(),
        cookies: typeof document !== 'undefined' ? document.cookie : 'undefined'
      });
      throw new Error('No authentication token available');
    }
    
    const finalUrl = `${baseUrl}/join-auction?auctionId=${encodeURIComponent(connection.auctionId)}&token=${encodeURIComponent(token)}`;
    console.log('🔗 WebSocket URL:', finalUrl.replace(token, '***TOKEN***'));
    return finalUrl;
  }

  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      if (this.isConnected && this.currentConnection) {
        const pingMessage: WebSocketMessage = {
          type: 'ping',
          auctionId: this.currentConnection.auctionId,
          userName: this.currentConnection.userName,
          timestamp: new Date().toISOString()
        };
        this.sendMessage(pingMessage);

        // Set pong timeout
        this.pongTimeout = setTimeout(() => {
          console.warn('Pong timeout - connection may be stale');
          this.disconnect();
        }, 10000); // 10 seconds timeout
      }
    }, 54000); // Send ping every 54 seconds (less than 60 second pong wait)
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);
    
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.currentConnection && !this.isConnected) {
        this.connect(this.currentConnection);
      }
    }, delay);
  }

  private initializeEventListeners(): void {
    const eventTypes: (keyof AuctionEvents)[] = [
      'connected', 'disconnected', 'auctionData', 'bidUpdate', 
      'userJoined', 'userLeft', 'error', 'success', 'countUpdate', 'auctionEnded'
    ];
    
    eventTypes.forEach(eventType => {
      this.eventListeners.set(eventType, new Set());
    });
  }

  public on<K extends keyof AuctionEvents>(event: K, callback: AuctionEvents[K]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.add(callback as Function);
    }
  }

  public off<K extends keyof AuctionEvents>(event: K, callback: AuctionEvents[K]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback as Function);
    }
  }

  private emit<K extends keyof AuctionEvents>(event: K, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  public getConnectionStatus(): { isConnected: boolean; auctionId?: string } {
    return {
      isConnected: this.isConnected,
      auctionId: this.currentConnection?.auctionId
    };
  }

  public getCurrentConnection(): AuctionConnection | null {
    return this.currentConnection;
  }
}

export const auctionWebSocket = WebSocketClient.getInstance();

export const connectToAuction = (connection: AuctionConnection): Promise<boolean> => {
  return auctionWebSocket.connect(connection);
};

export const disconnectFromAuction = (): void => {
  auctionWebSocket.disconnect();
};

export const joinAuction = (): void => {
  auctionWebSocket.joinAuction();
};

export const leaveAuction = (): void => {
  auctionWebSocket.leaveAuction();
};

export const placeBid = (amount: number): BidResult => {
  return auctionWebSocket.placeBid(amount);
};

export const getAuctionData = (): void => {
  auctionWebSocket.getAuctionData();
};

export const getCurrentBid = (): void => {
  auctionWebSocket.getCurrentBid();
};

export const isConnectedToAuction = (auctionId: string): boolean => {
  return auctionWebSocket.isConnectedToAuction(auctionId);
};

export const getConnectionStatus = () => {
  return auctionWebSocket.getConnectionStatus();
};

export const useAuctionWebSocket = () => {
  return {
    connect: connectToAuction,
    disconnect: disconnectFromAuction,
    join: joinAuction,
    leave: leaveAuction,
    placeBid,
    getAuctionData,
    getCurrentBid,
    isConnected: isConnectedToAuction,
    getStatus: getConnectionStatus,
    on: auctionWebSocket.on.bind(auctionWebSocket),
    off: auctionWebSocket.off.bind(auctionWebSocket)
  };
};
