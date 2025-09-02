const axios = require('axios');
const logger = require('../utils/logger');

class ZerodhaService {
  constructor() {
    this.apiKey = process.env.ZERODHA_API_KEY;
    this.apiSecret = process.env.ZERODHA_API_SECRET;
    this.redirectUri = process.env.ZERODHA_REDIRECT_URI;
    this.baseUrl = 'https://api.kite.trade';
    this.loginUrl = 'https://kite.trade/connect/login';
    this.accessToken = null;
    this.refreshToken = null;
  }

  // Generate login URL for user authentication
  generateLoginUrl() {
    const params = new URLSearchParams({
      api_key: this.apiKey,
      v: '3',
      redirect_uri: this.redirectUri
    });
    
    return `${this.loginUrl}?${params.toString()}`;
  }

  // Exchange request token for access token
  async exchangeRequestToken(requestToken) {
    try {
      const response = await axios.post(`${this.baseUrl}/session/token`, {
        api_key: this.apiKey,
        api_secret: this.apiSecret,
        request_token: requestToken
      });

      if (response.data.status === 'success') {
        this.accessToken = response.data.data.access_token;
        this.refreshToken = response.data.data.refresh_token;
        
        logger.info('Successfully obtained Zerodha access token');
        return response.data.data;
      } else {
        throw new Error('Failed to exchange request token');
      }
    } catch (error) {
      logger.error('Error exchanging request token:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile() {
    try {
      const response = await axios.get(`${this.baseUrl}/user/profile`, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.accessToken}`
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Get market instruments
  async getInstruments(exchange = 'NSE') {
    try {
      const response = await axios.get(`${this.baseUrl}/instruments/${exchange}`);
      return response.data.data;
    } catch (error) {
      logger.error('Error fetching instruments:', error);
      throw error;
    }
  }

  // Get quote for a symbol
  async getQuote(symbols) {
    try {
      const response = await axios.get(`${this.baseUrl}/quote/ltp`, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.accessToken}`
        },
        params: {
          i: symbols
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Error fetching quote:', error);
      throw error;
    }
  }

  // Get historical data
  async getHistoricalData(symbol, from, to, interval = 'day') {
    try {
      const response = await axios.get(`${this.baseUrl}/instruments/historical/${symbol}/${interval}`, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.accessToken}`
        },
        params: {
          from: from,
          to: to
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Error fetching historical data:', error);
      throw error;
    }
  }

  // Search instruments
  async searchInstruments(query) {
    try {
      const response = await axios.get(`${this.baseUrl}/instruments`, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.accessToken}`
        },
        params: {
          q: query
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Error searching instruments:', error);
      throw error;
    }
  }

  // Get order book
  async getOrderBook() {
    try {
      const response = await axios.get(`${this.baseUrl}/orders`, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.accessToken}`
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Error fetching order book:', error);
      throw error;
    }
  }

  // Get positions
  async getPositions() {
    try {
      const response = await axios.get(`${this.baseUrl}/portfolio/positions`, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.accessToken}`
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Error fetching positions:', error);
      throw error;
    }
  }

  // Get holdings
  async getHoldings() {
    try {
      const response = await axios.get(`${this.baseUrl}/portfolio/holdings`, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.accessToken}`
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Error fetching holdings:', error);
      throw error;
    }
  }

  // Place order (for paper trading simulation)
  async placeOrder(orderData) {
    try {
      // In paper trading, we simulate order placement
      // This would be replaced with actual order placement in live trading
      const simulatedOrder = {
        order_id: `PAPER_${Date.now()}`,
        status: 'COMPLETE',
        ...orderData,
        timestamp: new Date().toISOString()
      };

      logger.info('Paper order placed:', simulatedOrder);
      return simulatedOrder;
    } catch (error) {
      logger.error('Error placing paper order:', error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId) {
    try {
      // Simulate order cancellation for paper trading
      const cancelledOrder = {
        order_id: orderId,
        status: 'CANCELLED',
        timestamp: new Date().toISOString()
      };

      logger.info('Paper order cancelled:', cancelledOrder);
      return cancelledOrder;
    } catch (error) {
      logger.error('Error cancelling paper order:', error);
      throw error;
    }
  }

  // Get market depth
  async getMarketDepth(symbol) {
    try {
      const response = await axios.get(`${this.baseUrl}/quote/depth`, {
        headers: {
          'Authorization': `token ${this.apiKey}:${this.accessToken}`
        },
        params: {
          i: symbol
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Error fetching market depth:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const response = await axios.post(`${this.baseUrl}/user/refresh_token`, {
        api_key: this.apiKey,
        api_secret: this.apiSecret,
        refresh_token: this.refreshToken
      });

      if (response.data.status === 'success') {
        this.accessToken = response.data.data.access_token;
        logger.info('Access token refreshed successfully');
        return response.data.data;
      } else {
        throw new Error('Failed to refresh access token');
      }
    } catch (error) {
      logger.error('Error refreshing access token:', error);
      throw error;
    }
  }

  // Check if access token is valid
  isTokenValid() {
    return this.accessToken !== null;
  }

  // Get current access token
  getAccessToken() {
    return this.accessToken;
  }
}

module.exports = new ZerodhaService();
