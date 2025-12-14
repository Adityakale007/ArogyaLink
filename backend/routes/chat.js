const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');

// Get all doctors (for patients)
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'PHC Doctor' })
      .select('name email mobile profilePhoto role')
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      doctors: doctors,
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Get all patients (for doctors and workers)
router.get('/patients', async (req, res) => {
  try {
    const patients = await User.find({ role: 'Patient' })
      .select('name email mobile profilePhoto role')
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      patients: patients,
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patients.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Get all workers (for doctors)
router.get('/workers', async (req, res) => {
  try {
    const workers = await User.find({ role: 'Asha Worker' })
      .select('name email mobile profilePhoto role')
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      workers: workers,
    });
  } catch (error) {
    console.error('Get workers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workers.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Get chat messages between two users
router.get('/messages/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    
    // Create consistent chat room ID (sorted to ensure same room for both users)
    const chatRoomId = [userId1, userId2].sort().join('_');
    
    const messages = await ChatMessage.find({ chatRoomId })
      .populate('senderId', 'name profilePhoto')
      .populate('receiverId', 'name profilePhoto')
      .sort({ timestamp: 1 })
      .limit(100); // Limit to last 100 messages
    
    res.status(200).json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Mark messages as read
router.put('/messages/read/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const chatRoomId = [userId1, userId2].sort().join('_');
    
    await ChatMessage.updateMany(
      { 
        chatRoomId,
        receiverId: userId1,
        read: false 
      },
      { read: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
