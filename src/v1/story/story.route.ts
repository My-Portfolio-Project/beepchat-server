import express from 'express';
const { fetchAll, fetchSingle, createStory, removeStory }  = require( './stroy.controller');
const protect = require('../../middlewares/auth.guard');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Story
 *   description: Story endpoints
 */

/**
 * @swagger
 * /api/v1/story:
 *   get:
 *     summary: Get all stories
 *     tags: [Story]
 *     responses:
 *       200:
 *         description: List of all stories
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, fetchAll);

/**
 * @swagger
 * /api/v1/story/{id}:
 *   get:
 *     summary: Get single story by ID
 *     tags: [Story]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story details
 *       404:
 *         description: Story not found
 */
router.get('/:id', protect, fetchSingle);

/**
 * @swagger
 * /api/v1/story:
 *   post:
 *     summary: Create a new story (file or text)
 *     tags: [Story]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - media
 *               - type
 *             properties:
 *               media:
 *                 type: string
 *                 description: Media URL or text content
 *               type:
 *                 type: string
 *                 enum: [FILE, TEXT]
 *     responses:
 *       201:
 *         description: Story created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', protect, createStory);

/**
 * @swagger
 * /api/v1/story/{id}:
 *   delete:
 *     summary: Delete a story by ID
 *     tags: [Story]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story deleted successfully
 *       404:
 *         description: Story not found
 */
router.delete('/:id', protect, removeStory);

module.exports = router;
