



import { Request, Response } from 'express';
const {prisma }= require('../../../config/db');
const argon = require('argon2');
const generateToken = require('../../lib/generateToken');

const jwt = require('jsonwebtoken')

/**
 * 🧩 CREATE USER
 */
async function createUser(req: Request, res: Response) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await argon.hash(password);

    const user = await prisma.user.create({
      data: { fullName, email, password: hashedPassword },
    });

    const token = await generateToken(user.id, res);

    return res.status(201).json({
      message: 'User created successfully',
      user,
      token,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
}

/**
 * 📖 GET ALL USERS
 */
async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ users });
  } catch (error: any) {
    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
}

/**
 * 👤 GET SINGLE USER BY ID
 */
async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error: any) {
    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
}

/**
 * ✏️ UPDATE USER
 */
async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { fullName, email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = password ? await argon.hash(password) : user.password;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName: fullName || user.fullName,
        email: email || user.email,
        password: hashedPassword,
      },
    });

    return res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
}

/**
 * 🗑️ DELETE USER
 */
async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
}



/**
 * Get Sidebar Users (all users except current)
 */
async function sidebarUser(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
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
 * Get Logged-in profile
 */
async function profile(req: Request, res: Response) {
  try {
    const user = (req as any).user; 

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }


    return res.status(200).json({
      message: 'Profile fetched successfully',
      user,
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error?.message || 'Internal server error',
    });
  }
}

module.exports = profile;


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  sidebarUser,
  profile
};
