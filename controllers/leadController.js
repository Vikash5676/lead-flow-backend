const Lead = require('../models/Lead');

const getAllLeads = async (req, res) => {
  try {
    const {
      search,
      status,
      timeFilter,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (timeFilter && timeFilter !== 'all') {
      const now = new Date();
      const startDate = new Date();

      switch (timeFilter) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          query.createdAt = { $gte: startDate };
          break;
        case 'yesterday':
          startDate.setDate(now.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          query.createdAt = {
            $gte: startDate,
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate())
          };
          break;
        case 'last3days':
          startDate.setDate(now.getDate() - 3);
          startDate.setHours(0, 0, 0, 0);
          query.createdAt = { $gte: startDate };
          break;
        case 'last7days':
          startDate.setDate(now.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          query.createdAt = { $gte: startDate };
          break;
        case 'lastmonth':
          startDate.setMonth(now.getMonth() - 1);
          startDate.setHours(0, 0, 0, 0);
          query.createdAt = { $gte: startDate };
          break;
      }

      if (timeFilter !== 'yesterday') {
        query.createdAt = { $gte: startDate };
      }
    }

    console.log('Leads query:', JSON.stringify(query));

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    console.log('Leads found:', leads.length, 'Total:', total);

    res.json({
      success: true,
      leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllLeads:', error);
    res.status(500).json({ message: error.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ success: true, lead });
  } catch (error) {
    console.error('Error in getLeadById:', error);
    res.status(500).json({ message: error.message });
  }
};

const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, lead });
  } catch (error) {
    console.error('Error in createLead:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ success: true, lead });
  } catch (error) {
    console.error('Error in updateLead:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error in deleteLead:', error);
    res.status(500).json({ message: error.message });
  }
};

const getLeadStats = async (req, res) => {
  try {
    const [total, hot, warm, cold] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'hot' }),
      Lead.countDocuments({ status: 'warm' }),
      Lead.countDocuments({ status: 'cold' })
    ]);

    const whatsapp = await Lead.countDocuments({ source: 'whatsapp' });
    const call = await Lead.countDocuments({ source: 'call' });

    const stats = {
      total: total || 0,
      hot: hot || 0,
      warm: warm || 0,
      cold: cold || 0,
      whatsapp: whatsapp || 0,
      call: call || 0
    };

    console.log('Lead stats:', stats);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error in getLeadStats:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats
};
