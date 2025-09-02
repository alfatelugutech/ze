const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  cash: {
    type: Number,
    default: 100000, // Starting with 1 lakh rupees
    min: 0
  },
  totalValue: {
    type: Number,
    default: 100000,
    min: 0
  },
  totalPnL: {
    type: Number,
    default: 0
  },
  totalPnLPercentage: {
    type: Number,
    default: 0
  },
  positions: [{
    symbol: {
      type: String,
      required: true,
      uppercase: true
    },
    exchange: {
      type: String,
      required: true,
      enum: ['NSE', 'BSE', 'NFO', 'CDS'],
      default: 'NSE'
    },
    instrumentType: {
      type: String,
      enum: ['EQ', 'FUT', 'OPT', 'CE', 'PE'],
      default: 'EQ'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    averagePrice: {
      type: Number,
      required: true,
      min: 0
    },
    currentPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    marketValue: {
      type: Number,
      default: 0,
      min: 0
    },
    unrealizedPnL: {
      type: Number,
      default: 0
    },
    unrealizedPnLPercentage: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  watchlist: [{
    symbol: {
      type: String,
      required: true,
      uppercase: true
    },
    exchange: {
      type: String,
      default: 'NSE'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tradingHistory: [{
    orderId: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true
    },
    exchange: {
      type: String,
      required: true
    },
    orderType: {
      type: String,
      enum: ['BUY', 'SELL'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    orderStatus: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'CANCELLED', 'REJECTED'],
      default: 'PENDING'
    },
    executedAt: {
      type: Date,
      default: Date.now
    },
    fees: {
      type: Number,
      default: 0
    },
    taxes: {
      type: Number,
      default: 0
    }
  }],
  performance: {
    dailyPnL: {
      type: Number,
      default: 0
    },
    weeklyPnL: {
      type: Number,
      default: 0
    },
    monthlyPnL: {
      type: Number,
      default: 0
    },
    yearlyPnL: {
      type: Number,
      default: 0
    },
    bestTrade: {
      symbol: String,
      pnl: Number,
      date: Date
    },
    worstTrade: {
      symbol: String,
      pnl: Number,
      date: Date
    }
  },
  riskMetrics: {
    sharpeRatio: {
      type: Number,
      default: 0
    },
    maxDrawdown: {
      type: Number,
      default: 0
    },
    volatility: {
      type: Number,
      default: 0
    },
    beta: {
      type: Number,
      default: 1
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
portfolioSchema.index({ userId: 1 });
portfolioSchema.index({ 'positions.symbol': 1 });
portfolioSchema.index({ 'watchlist.symbol': 1 });
portfolioSchema.index({ createdAt: -1 });

// Virtual for total invested amount
portfolioSchema.virtual('totalInvested').get(function() {
  return this.positions.reduce((total, position) => {
    return total + (position.quantity * position.averagePrice);
  }, 0);
});

// Virtual for available cash
portfolioSchema.virtual('availableCash').get(function() {
  return this.cash;
});

// Method to add position
portfolioSchema.methods.addPosition = function(symbol, exchange, quantity, price, orderType) {
  const existingPosition = this.positions.find(p => 
    p.symbol === symbol && p.exchange === exchange
  );

  if (existingPosition) {
    if (orderType === 'BUY') {
      // Add to existing position
      const totalQuantity = existingPosition.quantity + quantity;
      const totalValue = (existingPosition.quantity * existingPosition.averagePrice) + (quantity * price);
      existingPosition.averagePrice = totalValue / totalQuantity;
      existingPosition.quantity = totalQuantity;
    } else if (orderType === 'SELL') {
      // Reduce existing position
      existingPosition.quantity -= quantity;
      if (existingPosition.quantity <= 0) {
        // Remove position if quantity becomes 0 or negative
        this.positions = this.positions.filter(p => 
          !(p.symbol === symbol && p.exchange === exchange)
        );
      }
    }
  } else if (orderType === 'BUY') {
    // Create new position
    this.positions.push({
      symbol,
      exchange,
      quantity,
      averagePrice: price,
      currentPrice: price,
      marketValue: quantity * price,
      unrealizedPnL: 0,
      unrealizedPnLPercentage: 0,
      lastUpdated: new Date()
    });
  }

  // Update cash
  if (orderType === 'BUY') {
    this.cash -= (quantity * price);
  } else {
    this.cash += (quantity * price);
  }

  this.updatePortfolioValue();
};

// Method to update portfolio value
portfolioSchema.methods.updatePortfolioValue = function() {
  let totalMarketValue = 0;
  
  this.positions.forEach(position => {
    position.marketValue = position.quantity * position.currentPrice;
    position.unrealizedPnL = position.marketValue - (position.quantity * position.averagePrice);
    position.unrealizedPnLPercentage = position.averagePrice > 0 
      ? ((position.unrealizedPnL / (position.quantity * position.averagePrice)) * 100)
      : 0;
    
    totalMarketValue += position.marketValue;
  });

  this.totalValue = this.cash + totalMarketValue;
  this.totalPnL = this.totalValue - 100000; // Assuming initial investment was 1 lakh
  this.totalPnLPercentage = (this.totalPnL / 100000) * 100;
  this.lastUpdated = new Date();
};

// Method to add to watchlist
portfolioSchema.methods.addToWatchlist = function(symbol, exchange = 'NSE') {
  const exists = this.watchlist.find(item => 
    item.symbol === symbol && item.exchange === exchange
  );
  
  if (!exists) {
    this.watchlist.push({
      symbol,
      exchange,
      addedAt: new Date()
    });
  }
};

// Method to remove from watchlist
portfolioSchema.methods.removeFromWatchlist = function(symbol, exchange = 'NSE') {
  this.watchlist = this.watchlist.filter(item => 
    !(item.symbol === symbol && item.exchange === exchange)
  );
};

// Method to add trading history
portfolioSchema.methods.addTradingHistory = function(orderData) {
  this.tradingHistory.push({
    ...orderData,
    executedAt: new Date()
  });

  // Keep only last 1000 trades for performance
  if (this.tradingHistory.length > 1000) {
    this.tradingHistory = this.tradingHistory.slice(-1000);
  }
};

// Static method to find by user ID
portfolioSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId }).populate('userId', 'firstName lastName email');
};

// Method to get portfolio summary
portfolioSchema.methods.getSummary = function() {
  return {
    totalValue: this.totalValue,
    cash: this.cash,
    totalInvested: this.totalInvested,
    totalPnL: this.totalPnL,
    totalPnLPercentage: this.totalPnLPercentage,
    positionCount: this.positions.length,
    watchlistCount: this.watchlist.length
  };
};

module.exports = mongoose.model('Portfolio', portfolioSchema);
