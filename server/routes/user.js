const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: user.getPublicProfile()
    });

  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, dateOfBirth } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update allowed fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;

    await user.save();

    logger.info(`Profile updated for user: ${user.email}`);

    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error while updating profile' });
  }
});

// @route   PUT /api/user/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, async (req, res) => {
  try {
    const { theme, notifications, tradingPreferences } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update theme preference
    if (theme && ['light', 'dark'].includes(theme)) {
      user.preferences.theme = theme;
    }

    // Update notification preferences
    if (notifications) {
      if (typeof notifications.email === 'boolean') {
        user.preferences.notifications.email = notifications.email;
      }
      if (typeof notifications.sms === 'boolean') {
        user.preferences.notifications.sms = notifications.sms;
      }
      if (typeof notifications.push === 'boolean') {
        user.preferences.notifications.push = notifications.push;
      }
    }

    // Update trading preferences
    if (tradingPreferences) {
      if (tradingPreferences.defaultQuantity && tradingPreferences.defaultQuantity > 0) {
        user.preferences.tradingPreferences.defaultQuantity = tradingPreferences.defaultQuantity;
      }
      if (tradingPreferences.defaultOrderType && ['MARKET', 'LIMIT'].includes(tradingPreferences.defaultOrderType)) {
        user.preferences.tradingPreferences.defaultOrderType = tradingPreferences.defaultOrderType;
      }
    }

    await user.save();

    logger.info(`Preferences updated for user: ${user.email}`);

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    logger.error('Update preferences error:', error);
    res.status(500).json({ error: 'Server error while updating preferences' });
  }
});

// @route   GET /api/user/preferences
// @desc    Get user preferences
// @access  Private
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      preferences: user.preferences
    });

  } catch (error) {
    logger.error('Get preferences error:', error);
    res.status(500).json({ error: 'Server error while fetching preferences' });
  }
});

// @route   POST /api/user/verify-email
// @desc    Verify user email
// @access  Private
router.post('/verify-email', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate verification token
    const verificationToken = require('crypto').randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    // TODO: Send verification email
    // For now, just log the token
    logger.info(`Email verification token generated for ${user.email}: ${verificationToken}`);

    res.json({
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    logger.error('Send verification email error:', error);
    res.status(500).json({ error: 'Server error while sending verification email' });
  }
});

// @route   POST /api/user/confirm-email
// @desc    Confirm email with verification token
// @access  Public
router.post('/confirm-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    logger.info(`Email verified for user: ${user.email}`);

    res.json({
      message: 'Email verified successfully'
    });

  } catch (error) {
    logger.error('Confirm email error:', error);
    res.status(500).json({ error: 'Server error while confirming email' });
  }
});

// @route   GET /api/user/activity
// @desc    Get user activity log
// @access  Private
router.get('/activity', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For now, return basic activity info
    // In a real application, you might want to track user actions in a separate collection
    const activity = [
      {
        type: 'login',
        description: 'User logged in',
        timestamp: user.lastLogin || user.createdAt,
        ip: 'N/A' // You can track IP addresses if needed
      },
      {
        type: 'registration',
        description: 'Account created',
        timestamp: user.createdAt,
        ip: 'N/A'
      }
    ];

    // Sort by timestamp (newest first)
    activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedActivity = activity.slice(startIndex, endIndex);

    res.json({
      activity: paginatedActivity,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(activity.length / limit),
        totalActivities: activity.length,
        hasNext: endIndex < activity.length,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    logger.error('Get activity error:', error);
    res.status(500).json({ error: 'Server error while fetching activity' });
  }
});

// @route   DELETE /api/user/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete account' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Soft delete - mark as inactive instead of actually deleting
    user.isActive = false;
    user.deactivatedAt = new Date();
    await user.save();

    logger.info(`Account deactivated for user: ${user.email}`);

    res.json({
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({ error: 'Server error while deleting account' });
  }
});

// @route   GET /api/user/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = {
      accountAge: user.accountAge,
      lastLogin: user.lastLogin,
      isEmailVerified: user.isEmailVerified,
      kycStatus: user.kycStatus,
      preferences: {
        theme: user.preferences.theme,
        notifications: user.preferences.notifications
      }
    };

    res.json({
      stats
    });

  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({ error: 'Server error while fetching user stats' });
  }
});

module.exports = router;
