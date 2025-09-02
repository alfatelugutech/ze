const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const zerodhaService = require('../services/zerodhaService');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/market/search
// @desc    Search for instruments
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, exchange = 'NSE' } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters long' });
    }

    const instruments = await zerodhaService.searchInstruments(q);
    
    // Filter by exchange if specified
    const filteredInstruments = exchange 
      ? instruments.filter(instrument => instrument.exchange === exchange)
      : instruments;

    // Limit results to top 20
    const limitedResults = filteredInstruments.slice(0, 20);

    res.json({
      instruments: limitedResults,
      total: filteredInstruments.length,
      query: q,
      exchange
    });

  } catch (error) {
    logger.error('Search instruments error:', error);
    res.status(500).json({ error: 'Server error while searching instruments' });
  }
});

// @route   GET /api/market/quotes/:symbol
// @desc    Get quote for a specific symbol
// @access  Public
router.get('/quotes/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { exchange = 'NSE' } = req.query;

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    // Get quote from Zerodha API
    const quotes = await zerodhaService.getQuote(`${exchange}:${symbol}`);
    
    if (!quotes || Object.keys(quotes).length === 0) {
      return res.status(404).json({ error: 'Quote not found for the given symbol' });
    }

    const quote = quotes[`${exchange}:${symbol}`];
    
    res.json({
      symbol,
      exchange,
      quote: {
        lastPrice: quote.last_price,
        change: quote.change,
        changePercent: quote.change_percent,
        open: quote.open,
        high: quote.high,
        low: quote.low,
        close: quote.close,
        volume: quote.volume,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Get quote error:', error);
    res.status(500).json({ error: 'Server error while fetching quote' });
  }
});

// @route   GET /api/market/quotes
// @desc    Get quotes for multiple symbols
// @access  Public
router.get('/quotes', async (req, res) => {
  try {
    const { symbols, exchange = 'NSE' } = req.query;

    if (!symbols) {
      return res.status(400).json({ error: 'Symbols parameter is required' });
    }

    const symbolList = symbols.split(',').map(s => s.trim());
    
    if (symbolList.length === 0) {
      return res.status(400).json({ error: 'At least one symbol is required' });
    }

    if (symbolList.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 symbols allowed per request' });
    }

    // Format symbols for Zerodha API
    const formattedSymbols = symbolList.map(symbol => `${exchange}:${symbol}`).join(',');
    
    const quotes = await zerodhaService.getQuote(formattedSymbols);
    
    const formattedQuotes = symbolList.map(symbol => {
      const quoteKey = `${exchange}:${symbol}`;
      const quote = quotes[quoteKey];
      
      if (!quote) {
        return {
          symbol,
          exchange,
          error: 'Quote not available'
        };
      }

      return {
        symbol,
        exchange,
        quote: {
          lastPrice: quote.last_price,
          change: quote.change,
          changePercent: quote.change_percent,
          open: quote.open,
          high: quote.high,
          low: quote.low,
          close: quote.close,
          volume: quote.volume,
          timestamp: new Date().toISOString()
        }
      };
    });

    res.json({
      quotes: formattedQuotes,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get multiple quotes error:', error);
    res.status(500).json({ error: 'Server error while fetching quotes' });
  }
});

// @route   GET /api/market/history/:symbol
// @desc    Get historical data for a symbol
// @access  Public
router.get('/history/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { 
      exchange = 'NSE', 
      from, 
      to, 
      interval = 'day' 
    } = req.query;

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    // Validate date parameters
    const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days ago
    const toDate = to ? new Date(to) : new Date();

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    if (fromDate > toDate) {
      return res.status(400).json({ error: 'From date cannot be after to date' });
    }

    // Validate interval
    const validIntervals = ['minute', '5minute', '15minute', '30minute', 'hour', 'day'];
    if (!validIntervals.includes(interval)) {
      return res.status(400).json({ error: 'Invalid interval. Must be one of: ' + validIntervals.join(', ') });
    }

    const formattedSymbol = `${exchange}:${symbol}`;
    const historicalData = await zerodhaService.getHistoricalData(
      formattedSymbol,
      fromDate.toISOString().split('T')[0],
      toDate.toISOString().split('T')[0],
      interval
    );

    res.json({
      symbol,
      exchange,
      interval,
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
      data: historicalData,
      count: historicalData.length
    });

  } catch (error) {
    logger.error('Get historical data error:', error);
    res.status(500).json({ error: 'Server error while fetching historical data' });
  }
});

// @route   GET /api/market/depth/:symbol
// @desc    Get market depth for a symbol
// @access  Public
router.get('/depth/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { exchange = 'NSE' } = req.query;

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const formattedSymbol = `${exchange}:${symbol}`;
    const marketDepth = await zerodhaService.getMarketDepth(formattedSymbol);

    res.json({
      symbol,
      exchange,
      depth: marketDepth,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get market depth error:', error);
    res.status(500).json({ error: 'Server error while fetching market depth' });
  }
});

// @route   GET /api/market/instruments
// @desc    Get all instruments for an exchange
// @access  Public
router.get('/instruments', async (req, res) => {
  try {
    const { exchange = 'NSE' } = req.query;

    const instruments = await zerodhaService.getInstruments(exchange);

    res.json({
      exchange,
      instruments: instruments.slice(0, 1000), // Limit to first 1000 for performance
      total: instruments.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get instruments error:', error);
    res.status(500).json({ error: 'Server error while fetching instruments' });
  }
});

// @route   GET /api/market/gainers-losers
// @desc    Get top gainers and losers
// @access  Public
router.get('/gainers-losers', async (req, res) => {
  try {
    const { exchange = 'NSE', limit = 10 } = req.query;

    // Get NIFTY 50 stocks for demonstration
    const nifty50Symbols = [
      'RELIANCE', 'TCS', 'HDFC', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN',
      'BHARTIARTL', 'KOTAKBANK', 'AXISBANK', 'ASIANPAINT', 'MARUTI', 'HCLTECH',
      'SUNPHARMA', 'TITAN', 'WIPRO', 'ULTRACEMCO', 'TECHM', 'NESTLEIND', 'POWERGRID',
      'BAJFINANCE', 'NTPC', 'ADANIENT', 'HINDALCO', 'JSWSTEEL', 'ONGC', 'COALINDIA',
      'TATAMOTORS', 'SHREECEM', 'DRREDDY', 'BRITANNIA', 'CIPLA', 'EICHERMOT',
      'HEROMOTOCO', 'DIVISLAB', 'BAJAJFINSV', 'GRASIM', 'TATACONSUM', 'UPL',
      'TATASTEEL', 'SBILIFE', 'INDUSINDBK', 'BPCL', 'MM', 'VEDL', 'HCLTECH'
    ];

    const formattedSymbols = nifty50Symbols.map(symbol => `${exchange}:${symbol}`).join(',');
    const quotes = await zerodhaService.getQuote(formattedSymbols);

    // Process quotes to find gainers and losers
    const processedQuotes = nifty50Symbols.map(symbol => {
      const quoteKey = `${exchange}:${symbol}`;
      const quote = quotes[quoteKey];
      
      if (!quote) return null;

      return {
        symbol,
        exchange,
        lastPrice: quote.last_price,
        change: quote.change,
        changePercent: quote.change_percent,
        volume: quote.volume
      };
    }).filter(Boolean);

    // Sort by change percentage
    const sortedQuotes = processedQuotes.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
    
    const gainers = sortedQuotes
      .filter(quote => quote.changePercent > 0)
      .slice(0, parseInt(limit));
    
    const losers = sortedQuotes
      .filter(quote => quote.changePercent < 0)
      .slice(0, parseInt(limit));

    res.json({
      exchange,
      gainers,
      losers,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get gainers-losers error:', error);
    res.status(500).json({ error: 'Server error while fetching gainers and losers' });
  }
});

// @route   GET /api/market/indices
// @desc    Get major indices
// @access  Public
router.get('/indices', async (req, res) => {
  try {
    const indices = [
      'NSE:NIFTY 50',
      'NSE:NIFTY BANK',
      'NSE:NIFTY IT',
      'NSE:NIFTY PHARMA',
      'NSE:NIFTY AUTO',
      'NSE:NIFTY FMCG',
      'NSE:NIFTY METAL',
      'NSE:NIFTY REALTY'
    ];

    const quotes = await zerodhaService.getQuote(indices.join(','));

    const indexData = indices.map(index => {
      const quote = quotes[index];
      
      if (!quote) return null;

      return {
        name: index.split(':')[1],
        exchange: index.split(':')[0],
        lastPrice: quote.last_price,
        change: quote.change,
        changePercent: quote.change_percent,
        high: quote.high,
        low: quote.low,
        open: quote.open
      };
    }).filter(Boolean);

    res.json({
      indices: indexData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get indices error:', error);
    res.status(500).json({ error: 'Server error while fetching indices' });
  }
});

// @route   GET /api/market/trending
// @desc    Get trending stocks based on volume and price movement
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { exchange = 'NSE', limit = 20 } = req.query;

    // Get some popular stocks for trending analysis
    const popularStocks = [
      'RELIANCE', 'TCS', 'HDFC', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN',
      'BHARTIARTL', 'KOTAKBANK', 'AXISBANK', 'ASIANPAINT', 'MARUTI', 'HCLTECH',
      'SUNPHARMA', 'TITAN', 'WIPRO', 'ULTRACEMCO', 'TECHM', 'NESTLEIND'
    ];

    const formattedSymbols = popularStocks.map(symbol => `${exchange}:${symbol}`).join(',');
    const quotes = await zerodhaService.getQuote(formattedSymbols);

    const trendingStocks = popularStocks.map(symbol => {
      const quoteKey = `${exchange}:${symbol}`;
      const quote = quotes[quoteKey];
      
      if (!quote) return null;

      // Calculate trending score based on volume and price change
      const trendingScore = Math.abs(quote.change_percent) * (quote.volume / 1000000); // Normalize volume

      return {
        symbol,
        exchange,
        lastPrice: quote.last_price,
        change: quote.change,
        changePercent: quote.change_percent,
        volume: quote.volume,
        trendingScore: Math.round(trendingScore * 100) / 100
      };
    }).filter(Boolean);

    // Sort by trending score
    const sortedTrending = trendingStocks.sort((a, b) => b.trendingScore - a.trendingScore);
    const limitedTrending = sortedTrending.slice(0, parseInt(limit));

    res.json({
      exchange,
      trending: limitedTrending,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get trending stocks error:', error);
    res.status(500).json({ error: 'Server error while fetching trending stocks' });
  }
});

module.exports = router;
