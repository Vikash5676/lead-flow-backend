const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const testAuth = async (req, res) => {
  try {
    console.log('=== TESTING AUTHENTICATION ===');
    
    const token = req.headers.authorization;
    console.log('Auth header:', token);

    if (!token) {
      return res.json({
        success: false,
        message: 'No token provided'
      });
    }

    if (!token.startsWith('Bearer ')) {
      return res.json({
        success: false,
        message: 'Invalid token format'
      });
    }

    const tokenValue = token.split(' ')[1];
    
    console.log('Testing token verification...');
    const decoded = verifyToken(tokenValue);
    console.log('Token decoded:', decoded);
    
    if (!decoded) {
      return res.json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (!decoded.id) {
      return res.json({
        success: false,
        message: 'Token has no id'
      });
    }

    console.log('Looking up user...');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });

    return res.json({
      success: true,
      message: 'Authentication working',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      canAccess: user.status === 'active'
    });

  } catch (error) {
    console.error('Test auth error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const testDatabase = async (req, res) => {
  try {
    console.log('=== TESTING DATABASE ===');

    const userCount = await User.countDocuments();
    const leadCount = await require('../models/Lead').countDocuments();
    const chatCount = await require('../models/Chat').countDocuments();
    const callCount = await require('../models/Call').countDocuments();

    console.log('Database stats:', {
      users: userCount,
      leads: leadCount,
      chats: chatCount,
      calls: callCount
    });

    return res.json({
      success: true,
      stats: {
        users: userCount,
        leads: leadCount,
        chats: chatCount,
        calls: callCount
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { testAuth, testDatabase };
