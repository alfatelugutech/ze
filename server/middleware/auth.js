const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Add user info to request
    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      logger.warn('Invalid JWT token provided');
      return res.status(401).json({ error: 'Token is not valid' });
    }
    
    if (error.name === 'TokenExpiredError') {
      logger.warn('Expired JWT token provided');
      return res.status(401).json({ error: 'Token has expired' });
    }

    logger.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};

// Optional auth middleware for routes that can work with or without authentication
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Admin auth middleware
const adminAuth = async (req, res, next) => {
  try {
    // First check if user is authenticated
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Check if user is admin (you can add an isAdmin field to your User model)
    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token is not valid' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }

    logger.error('Admin auth middleware error:', error);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};

// Rate limiting middleware for specific endpoints
const rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requests.has(ip)) {
      const userRequests = requests.get(ip).filter(time => time > windowStart);
      requests.set(ip, userRequests);
    }

    const userRequests = requests.get(ip) || [];
    
    if (userRequests.length >= max) {
      return res.status(429).json({ 
        error: 'Too many requests, please try again later' 
      });
    }

    userRequests.push(now);
    requests.set(ip, userRequests);

    next();
  };
};

module.exports = {
  auth,
  optionalAuth,
  adminAuth,
  rateLimit
};
