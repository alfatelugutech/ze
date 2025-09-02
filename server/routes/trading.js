const express = require('express');
const Portfolio = require('../models/Portfolio');
const { auth, rateLimit } = require('../middleware/auth');
const zerodhaService = require('../services/zerodhaService');
const logger = require('../utils/logger');

const router = express.Router();

// Apply rate limiting to trading routes
const tradingRateLimit = rateLimit(15 * 60 * 1000, 50); // 50 requests per 15 minutes

// @route   GET /api/trading/portfolio
// @desc    Get user portfolio
// @access  Private
router.get('/portfolio', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findByUserId(req.user.userId);
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json({
      portfolio: portfolio.getSummary(),
      positions: portfolio.positions,
      watchlist: portfolio.watchlist
    });

  } catch (error) {
    logger.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Server error while fetching portfolio' });
  }
});

// @route   POST /api/trading/order
// @desc    Place a new order
// @access  Private
router.post('/order', auth, tradingRateLimit, async (req, res) => {
  try {
    const { symbol, exchange, orderType, quantity, price, orderCategory } = req.body;

    // Validate required fields
    if (!symbol || !exchange || !orderType || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    if (orderType === 'LIMIT' && (!price || price <= 0)) {
      return res.status(400).json({ error: 'Price is required for limit orders' });
    }

    // Get user portfolio
    const portfolio = await Portfolio.findByUserId(req.user.userId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Calculate order amount
    const orderAmount = quantity * (price || 0);
    
    // Check if user has sufficient funds for BUY orders
    if (orderType === 'BUY' && portfolio.cash < orderAmount) {
      return res.status(400).json({ 
        error: 'Insufficient funds',
        required: orderAmount,
        available: portfolio.cash
      });
    }

    // Check if user has sufficient quantity for SELL orders
    if (orderType === 'SELL') {
      const existingPosition = portfolio.positions.find(p => 
        p.symbol === symbol && p.exchange === exchange
      );
      
      if (!existingPosition || existingPosition.quantity < quantity) {
        return res.status(400).json({ 
          error: 'Insufficient quantity to sell',
          required: quantity,
          available: existingPosition ? existingPosition.quantity : 0
        });
      }
    }

    // Place order through Zerodha service (paper trading simulation)
    const orderData = {
      symbol,
      exchange,
      orderType: orderType === 'MARKET' ? 'MARKET' : 'LIMIT',
      quantity,
      price: orderType === 'MARKET' ? 0 : price,
      totalAmount: orderAmount,
      orderStatus: 'COMPLETED', // For paper trading, orders are immediately completed
      fees: 0, // No fees in paper trading
      taxes: 0 // No taxes in paper trading
    };

    const order = await zerodhaService.placeOrder(orderData);

    // Update portfolio
    portfolio.addPosition(symbol, exchange, quantity, price || 0, orderType);
    portfolio.addTradingHistory({
      orderId: order.order_id,
      ...orderData
    });

    await portfolio.save();

    logger.info(`Order placed successfully: ${orderType} ${quantity} ${symbol} by user ${req.user.userId}`);

    res.json({
      message: 'Order placed successfully',
      order,
      portfolio: portfolio.getSummary()
    });

  } catch (error) {
    logger.error('Place order error:', error);
    res.status(500).json({ error: 'Server error while placing order' });
  }
});

// @route   GET /api/trading/orders
// @desc    Get order history
// @access  Private
router.get('/orders', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, status, symbol } = req.query;
    
    const portfolio = await Portfolio.findByUserId(req.user.userId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    let orders = portfolio.tradingHistory;

    // Filter by status if provided
    if (status) {
      orders = orders.filter(order => order.orderStatus === status);
    }

    // Filter by symbol if provided
    if (symbol) {
      orders = orders.filter(order => 
        order.symbol.toLowerCase().includes(symbol.toLowerCase())
      );
    }

    // Sort by execution date (newest first)
    orders.sort((a, b) => new Date(b.executedAt) - new Date(a.executedAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    res.json({
      orders: paginatedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(orders.length / limit),
        totalOrders: orders.length,
        hasNext: endIndex < orders.length,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error while fetching orders' });
  }
});

// @route   PUT /api/trading/order/:orderId
// @desc    Modify an existing order
// @access  Private
router.put('/order/:orderId', auth, tradingRateLimit, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { quantity, price } = req.body;

    const portfolio = await Portfolio.findByUserId(req.user.userId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Find the order
    const order = portfolio.tradingHistory.find(o => o.orderId === orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.orderStatus !== 'PENDING') {
      return res.status(400).json({ error: 'Cannot modify completed or cancelled orders' });
    }

    // Update order
    if (quantity) order.quantity = quantity;
    if (price) order.price = price;
    
    order.totalAmount = order.quantity * order.price;
    order.lastUpdated = new Date();

    await portfolio.save();

    logger.info(`Order modified: ${orderId} by user ${req.user.userId}`);

    res.json({
      message: 'Order modified successfully',
      order
    });

  } catch (error) {
    logger.error('Modify order error:', error);
    res.status(500).json({ error: 'Server error while modifying order' });
  }
});

// @route   DELETE /api/trading/order/:orderId
// @desc    Cancel an order
// @access  Private
router.delete('/order/:orderId', auth, tradingRateLimit, async (req, res) => {
  try {
    const { orderId } = req.params;

    const portfolio = await Portfolio.findByUserId(req.user.userId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Find the order
    const order = portfolio.tradingHistory.find(o => o.orderId === orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.orderStatus !== 'PENDING') {
      return res.status(400).json({ error: 'Cannot cancel completed or already cancelled orders' });
    }

    // Cancel order through Zerodha service
    await zerodhaService.cancelOrder(orderId);

    // Update order status
    order.orderStatus = 'CANCELLED';
    order.lastUpdated = new Date();

    await portfolio.save();

    logger.info(`Order cancelled: ${orderId} by user ${req.user.userId}`);

    res.json({
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {
    logger.error('Cancel order error:', error);
    res.status(500).json({ error: 'Server error while cancelling order' });
  }
});

// @route   POST /api/trading/watchlist
// @desc    Add symbol to watchlist
// @access  Private
router.post('/watchlist', auth, async (req, res) => {
  try {
    const { symbol, exchange = 'NSE' } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const portfolio = await Portfolio.findByUserId(req.user.userId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    portfolio.addToWatchlist(symbol, exchange);
    await portfolio.save();

    logger.info(`Added to watchlist: ${symbol} by user ${req.user.userId}`);

    res.json({
      message: 'Symbol added to watchlist successfully',
      watchlist: portfolio.watchlist
    });

  } catch (error) {
    logger.error('Add to watchlist error:', error);
    res.status(500).json({ error: 'Server error while adding to watchlist' });
  }
});

// @route   DELETE /api/trading/watchlist/:symbol
// @desc    Remove symbol from watchlist
// @access  Private
router.delete('/watchlist/:symbol', auth, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { exchange = 'NSE' } = req.query;

    const portfolio = await Portfolio.findByUserId(req.user.userId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    portfolio.removeFromWatchlist(symbol, exchange);
    await portfolio.save();

    logger.info(`Removed from watchlist: ${symbol} by user ${req.user.userId}`);

    res.json({
      message: 'Symbol removed from watchlist successfully',
      watchlist: portfolio.watchlist
    });

  } catch (error) {
    logger.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Server error while removing from watchlist' });
  }
});

// @route   GET /api/trading/performance
// @desc    Get trading performance metrics
// @access  Private
router.get('/performance', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findByUserId(req.user.userId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json({
      performance: portfolio.performance,
      riskMetrics: portfolio.riskMetrics,
      summary: portfolio.getSummary()
    });

  } catch (error) {
    logger.error('Get performance error:', error);
    res.status(500).json({ error: 'Server error while fetching performance' });
  }
});

// @route   POST /api/trading/reset-portfolio
// @desc    Reset portfolio to initial state (for testing)
// @access  Private
router.post('/reset-portfolio', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findByUserId(req.user.userId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Reset to initial state
    portfolio.cash = 100000;
    portfolio.positions = [];
    portfolio.watchlist = [];
    portfolio.tradingHistory = [];
    portfolio.totalValue = 100000;
    portfolio.totalPnL = 0;
    portfolio.totalPnLPercentage = 0;
    portfolio.performance = {
      dailyPnL: 0,
      weeklyPnL: 0,
      monthlyPnL: 0,
      yearlyPnL: 0
    };
    portfolio.riskMetrics = {
      sharpeRatio: 0,
      maxDrawdown: 0,
      volatility: 0,
      beta: 1
    };

    await portfolio.save();

    logger.info(`Portfolio reset by user ${req.user.userId}`);

    res.json({
      message: 'Portfolio reset successfully',
      portfolio: portfolio.getSummary()
    });

  } catch (error) {
    logger.error('Reset portfolio error:', error);
    res.status(500).json({ error: 'Server error while resetting portfolio' });
  }
});

module.exports = router;
