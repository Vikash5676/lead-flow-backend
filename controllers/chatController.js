const Chat = require('../models/Chat');

const getAllChats = async (req, res) => {
  try {
    const { search } = req.query;

    console.log('Fetching all chats, search:', search);

    const matchStage = {};

    if (search) {
      matchStage.$or = [
        { phoneNumber: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } }
      ];
    }

    const chats = await Chat.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$phoneNumber',
          phoneNumber: { $first: '$phoneNumber' },
          contactName: { $first: '$contactName' },
          lastMessage: { $first: '$message' },
          lastTime: { $first: '$createdAt' },
          unread: {
            $sum: {
              $cond: [{ $eq: ['$read', false] }, 1, 0]
            }
          },
          messages: {
            $push: {
              _id: '$_id',
              message: '$message',
              direction: '$direction',
              read: '$read',
              createdAt: '$createdAt'
            }
          }
        }
      },
      { $sort: { lastTime: -1 } }
    ]);

    console.log('Chats found:', chats.length);

    res.json({ success: true, chats });
  } catch (error) {
    console.error('Error in getAllChats:', error);
    res.status(500).json({ message: error.message });
  }
};

const getChatByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    console.log('Fetching messages for phone:', phone);

    const messages = await Chat.find({ phoneNumber: phone })
      .sort({ createdAt: 1 })
      .lean();

    await Chat.updateMany(
      { phoneNumber: phone, read: false },
      { read: true }
    );

    console.log('Messages found:', messages.length);

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error in getChatByPhone:', error);
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { phoneNumber, contactName, message } = req.body;

    console.log('Sending message:', { phoneNumber, contactName, message });

    const chat = await Chat.create({
      phoneNumber,
      contactName,
      message,
      direction: 'outgoing',
      read: true
    });

    console.log('Message created:', chat._id);

    res.status(201).json({ success: true, chat });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { phone } = req.params;

    console.log('Marking as read:', phone);

    await Chat.updateMany(
      { phoneNumber: phone, read: false },
      { read: true }
    );

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllChats,
  getChatByPhone,
  sendMessage,
  markAsRead
};
