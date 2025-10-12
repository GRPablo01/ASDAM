const express = require('express');
const router = express.Router();
const messageController = require('../controller/message.controller');

// Routes
router.post('/', messageController.sendMessage);
router.get('/conversation/:user1Id/:user2Id', messageController.getConversation);
router.get('/user/:userId', messageController.getUserMessages);
router.get('/unread/:userId', messageController.getUnreadMessages);
router.get('/unreadcount/:userId', messageController.getUnreadCount);

module.exports = router;
