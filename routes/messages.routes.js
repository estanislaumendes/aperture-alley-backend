const router = require('express').Router();

const Message = require('../models/Message.model');
const User = require('../models/User.model');

// Send message endpoint
router.post('/messages', async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get messages between two users
router.get('/messages/:senderId/:receiverId', async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get other users the current user has exchanged messages with
router.get('/otherusers/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find distinct receiver IDs from messages where the sender or receiver is the current user
    const distinctReceivers = await Message.distinct('receiver', {
      $or: [{ sender: userId }, { receiver: userId }],
    });
    // Find distinct sender IDs from messages where the receiver is the current user
    const distinctSenders = await Message.distinct('sender', {
      receiver: userId,
    });
    // Combine distinct sender and receiver IDs
    const distinctUsersIds = [
      ...new Set([...distinctReceivers, ...distinctSenders]),
    ];
    // Exclude the current user from the list
    const otherUsersIds = distinctUsersIds.filter(id => id !== userId);
    // Fetch user details for other users
    const otherUsers = await User.find(
      { _id: { $in: otherUsersIds } },
      'firstName lastName'
    );
    res.json(otherUsers);
  } catch (error) {
    console.error('Error fetching other users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
