const Call = require('../models/Call');

const getAllCalls = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    console.log('Fetching all calls, page:', page, 'status:', status);

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const total = await Call.countDocuments(query);
    const calls = await Call.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    console.log('Calls found:', calls.length, 'Total:', total);

    res.json({
      success: true,
      calls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllCalls:', error);
    res.status(500).json({ message: error.message });
  }
};

const getCallStats = async (req, res) => {
  try {
    console.log('Fetching call stats...');

    const stats = await Call.aggregate([
      {
        $group: {
          _id: null,
          totalCalls: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalCost: { $sum: '$cost' },
          completedCalls: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          missedCalls: {
            $sum: {
              $cond: [{ $eq: ['$status', 'missed'] }, 1, 0]
            }
          },
          failedCalls: {
            $sum: {
              $cond: [{ $eq: ['$status', 'failed'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalCalls: 0,
      totalDuration: 0,
      totalCost: 0,
      completedCalls: 0,
      missedCalls: 0,
      failedCalls: 0
    };

    const avgDuration = result.totalCalls > 0
      ? Math.round(result.totalDuration / result.totalCalls)
      : 0;

    const statsToReturn = {
      totalCalls: result.totalCalls || 0,
      totalDuration: result.totalDuration || 0,
      totalCost: result.totalCost || 0,
      avgDuration: avgDuration || 0
    };

    console.log('Call stats:', statsToReturn);

    res.json({
      success: true,
      stats: statsToReturn
    });
  } catch (error) {
    console.error('Error in getCallStats:', error);
    res.status(500).json({ message: error.message });
  }
};

const createCall = async (req, res) => {
  try {
    const call = await Call.create(req.body);

    console.log('Call created:', call._id);

    res.status(201).json({ success: true, call });
  } catch (error) {
    console.error('Error in createCall:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCalls,
  getCallStats,
  createCall
};
