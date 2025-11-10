import express from 'express';

const router = express.Router();

const {
  allConversation,
  sendMessage,
  getConversation,
} = require('../conversation/conversation.controller');

const protect = require('../../middlewares/auth.guard');

/**
 * @swagger
 * tags:
 *   name: Conversation
 *   description: Conversation endpoints
 */

/**
 * @swagger
 * /api/v1/conversations:
 *   get:
 *     summary: Get all conversations
 *     tags: [Conversation]
 *     responses:
 *       200:
 *         description: All conversations fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, allConversation);

/**
 * @swagger
 * /api/v1/conversations/send-message/{id}:
 *   post:
 *     summary: Send a message to a user
 *     tags: [Conversation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Receiver user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderId
 *               - message
 *             properties:
 *               senderId:
 *                 type: string
 *               message:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/send-message/:id', protect, sendMessage);

/**
 * @swagger
 * /api/v1/conversations/{id}:
 *   get:
 *     summary: Get conversation between logged-in user and another user
 *     tags: [Conversation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the other user
 *     responses:
 *       200:
 *         description: Conversation fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/:id', protect, getConversation);

module.exports = router;
