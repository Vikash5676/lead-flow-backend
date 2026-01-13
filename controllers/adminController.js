const User = require('../models/User');

const getPendingUsers = async (req, res) => {
  try {
    console.log('Fetching pending users...');

    const users = await User.find({ status: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });

    console.log('Pending users found:', users.length);

    res.json({ success: true, users });
  } catch (error) {
    console.error('Error in getPendingUsers:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log('Fetching all users...');

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    console.log('All users found:', users.length);

    res.json({ success: true, users });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: error.message });
  }
};

const approveUser = async (req, res) => {
  try {
    const { userId, role } = req.body;

    console.log('Approving user:', { userId, role });

    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'active';
    user.role = role || 'authorized_user';

    await user.save();

    console.log('User approved:', { userId, name: user.name, role: user.role });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error in approveUser:', error);
    res.status(500).json({ message: error.message });
  }
};

const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('Rejecting user:', userId);

    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'disabled';

    await user.save();

    console.log('User rejected:', { userId, name: user.name });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error in rejectUser:', error);
    res.status(500).json({ message: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('Toggling user status:', userId);

    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'super_admin') {
      console.log('Cannot disable super admin');
      return res.status(403).json({ message: 'Cannot disable super admin' });
    }

    user.status = user.status === 'active' ? 'disabled' : 'active';

    await user.save();

    console.log('User status toggled:', { userId, name: user.name, newStatus: user.status });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error in toggleUserStatus:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    console.log('Updating user role:', { userId, role });

    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;

    await user.save();

    console.log('User role updated:', { userId, name: user.name, newRole: user.role });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPendingUsers,
  getAllUsers,
  approveUser,
  rejectUser,
  toggleUserStatus,
  updateUserRole
};
