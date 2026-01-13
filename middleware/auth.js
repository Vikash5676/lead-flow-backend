const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE - PROTECT ===');
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found:', token ? 'Present' : 'Missing');
    } else {
      console.log('No Authorization header found');
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      console.log('Verifying token...');
      const decoded = verifyToken(token);
      console.log('Token decoded:', decoded);
      console.log('User ID from token:', decoded?.id);
      
      if (!decoded || !decoded.id) {
        console.log('Invalid token: missing id');
        return res.status(401).json({ message: 'Invalid token' });
      }

      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('User not found for id:', decoded.id);
        return res.status(401).json({ message: 'User not found' });
      }

      console.log('User found:', { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status });

      req.user = user;
      next();
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return res.status(401).json({ message: 'Invalid token' });
    }

  } catch (error) {
    console.error('=== AUTH MIDDLEWARE ERROR ===');
    console.error('Unexpected error:', error.message);
    console.error('Stack:', error.stack);
    
    // Only return 401 for actual auth failures
    // Let the request proceed for other errors (will be handled by controllers)
    if (error.message && error.message.includes('not authorized')) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // For other errors, let it pass to the controller
    next();
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('=== AUTH MIDDLEWARE - AUTHORIZE ===');
    console.log('Required roles:', roles);
    console.log('User role:', req.user?.role);
    
    if (!req.user) {
      console.log('No user object - not authenticated');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      console.log('Access denied for role:', req.user.role);
      return res.status(403).json({ message: 'Not authorized to access this route' });
    }

    console.log('Authorization passed');
    next();
  };
};

const checkStatus = (req, res, next) => {
  console.log('=== AUTH MIDDLEWARE - CHECK STATUS ===');
  console.log('User status:', req.user?.status);

  if (req.user?.status === 'disabled') {
    console.log('User is disabled');
    return res.status(403).json({ message: 'Your account has been disabled' });
  }

  if (req.user?.status === 'pending') {
    console.log('User is pending approval');
    return res.status(403).json({ message: 'Your account is pending approval' });
  }

  console.log('Status check passed');
  next();
};

module.exports = { protect, authorize, checkStatus };
