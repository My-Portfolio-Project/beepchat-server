// src/v1/chat/chat.controller.ts

import { Request, Response } from 'express';
const  {prisma } = require('../../../config/db');

const configureCloudinary = require('../../lib/cloudinary');

const cloudinary = configureCloudinary();



/**
 * Get all conversation
 */
 async function allConversation(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;

    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    console.log('Fetching conversations for user:', userId);

    // Fetch all conversations where user is sender or receiver
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { user: true },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (!conversations || conversations.length === 0) {
      return res.status(404).json({ message: 'No conversations found' });
    }

    return res.status(200).json(conversations);
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
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
    const receiverId = req.params.id;
    const senderId = (req as any).user.id;

    // console.log('sender id:', senderId)
    // console.log('receiver id:', receiverId)


    if (!receiverId || !senderId) {
      return res.status(400).json({ message: 'Sender or receiver ID missing' });
    }


    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
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
  const receiverId = req.params.id;
    const senderId = (req as any).user.id;

   

    const { message, image } = req.body;

    if ( !receiverId || !message) {
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
      },
      include: {
        message: true
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
module.exports = { allConversation,  getConversation, sendMessage };
