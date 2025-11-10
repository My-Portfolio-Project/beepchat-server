import { Request, Response } from 'express';
const { prisma } = require('../../../config/db');
const configureCloudinary = require('../../lib/cloudinary');
const cloudinary = configureCloudinary();

/**
 * Fetch all stories
 */
export async function fetchAll(req: Request, res: Response) {
  try {
    const stories = await prisma.story.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(stories);
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    return res.status(500).json({
      message: error?.message || 'Internal server error',
    });
  }
}

/**
 * Fetch single story by ID
 */
 async function fetchSingle(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'No story ID provided',
      });
    }

    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!story) {
      return res.status(404).json({
        message: 'Story not found',
      });
    }

    return res.status(200).json(story);
  } catch (error: any) {
    console.error('Error fetching story:', error);
    return res.status(500).json({
      message: error?.message || 'Internal server error',
    });
  }
}

/**
 * Create story (either text or file)
 */
export async function createStory(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id; // from protect middleware
    const { media, type } = req.body; // type = "FILE" or "TEXT"

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!media) {
      return res.status(400).json({ message: 'No media content provided' });
    }

    let uploadedUrl: string | null = null;

    if (type === 'FILE') {
      try {
        const uploadedResult = await cloudinary.uploader.upload(media, {
          folder: 'beepchat/story',
          resource_type: 'auto',
        });
        uploadedUrl = uploadedResult.secure_url;
      } catch (error: any) {
        console.error('Cloudinary upload error:', error);
        return res.status(400).json({
          message: error.message || 'Error uploading file',
        });
      }
    }

    const story = await prisma.story.create({
      data: {
        media: uploadedUrl || media, // file URL or text
        userId,
      },
    });

    return res.status(201).json({
      message: 'Story created successfully',
      story,
    });
  } catch (error: any) {
    console.error('Error creating story:', error);
    return res.status(500).json({
      message: error?.message || 'Internal server error',
    });
  }
}

/**
 * Delete story by ID
 */
export async function removeStory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!id) {
      return res.status(400).json({ message: 'Story ID is required' });
    }

    const story = await prisma.story.findUnique({ where: { id } });
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this story' });
    }

    await prisma.story.delete({ where: { id } });

    return res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting story:', error);
    return res.status(500).json({
      message: error?.message || 'Internal server error',
    });
  }
}


module.exports = { fetchAll, fetchSingle,createStory,removeStory}