// src/v1/chat/chat.controller.ts

import { Request, Response } from 'express';
const prisma = require('../../../config/db');

const configureCloudinary = require('../../lib/cloudinary');

const cloudinary = configureCloudinary();


/**
 * Get Sidebar Users (all users except current)
 */
async function sidebarUser(req: Request, res: Response) {
  try {
    const userId = req.cookies.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get all users except current
    const users = await prisma.user.findMany({
      where: { id: { not: userId } },
      select: { id: true, fullName: true, email: true },
    });

    return res.status(200).json(users);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error?.message || 'Internal server error',
    });
  }
}

/**
 * Get Conversation between two users
 */
async function getConversation(req: Request, res: Response) {
  try {
    const recieverId = req.params.recieverId;
    const senderId = req.cookies.id;

    if (!recieverId || !senderId) {
      return res.status(400).json({ message: 'Sender or receiver ID missing' });
    }

    // Find conversation between sender and receiver
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { senderId, receiverId: recieverId },
          { senderId: recieverId, receiverId: senderId },
        ],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { user: true },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: 'No conversation found' });
    }

    return res.status(200).json(conversation);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error?.message || 'Internal server error',
    });
  }
}




/**
 * Send a message
 */
async function sendMessage(req: Request, res: Response) {
  try {
    const senderId = req.cookies.id;
    const receiverId = req.params.recieverId;
    const { message, image } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }


    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          senderId,
          receiverId,
        },
      });
    }

    let uploadedUrl = '';

    if (image) {
      try {
        const uploadedResult = await cloudinary.uploader.upload(image, {
          folder: 'beepchat/image',
        });

        uploadedUrl = uploadedResult.secure_url; // Correct property
      } catch (error: any) {
        return res.status(400).json({
          message: error.message || 'Error uploading to Cloudinary',
        });
      }
    }

    const newMessage = await prisma.message.create({
      data: {
        message,
        image: uploadedUrl,
        userId: senderId,
        conversationId: conversation.id,
      },
    });


    prisma.conversation.update({
      data:{
          senderId,
          receiverId,
          message: newMessage.id
      }
    })

    return res.status(201).json(newMessage);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error?.message || 'Internal server error',
    });
  }
}
module.exports = { sidebarUser, getConversation, sendMessage };
