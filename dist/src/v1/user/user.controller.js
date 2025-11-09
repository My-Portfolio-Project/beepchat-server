"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma = require('../../../config/db');
const argon = require('argon2');
const generateToken = require('../../lib/generateToken');
/**
 * 🧩 CREATE USER
 */
async function createUser(req, res) {
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
    }
    catch (error) {
        return res.status(500).json({ message: error?.message || 'Internal server error' });
    }
}
/**
 * 📖 GET ALL USERS
 */
async function getAllUsers(req, res) {
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
    }
    catch (error) {
        return res.status(500).json({ message: error?.message || 'Internal server error' });
    }
}
/**
 * 👤 GET SINGLE USER BY ID
 */
async function getUserById(req, res) {
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
    }
    catch (error) {
        return res.status(500).json({ message: error?.message || 'Internal server error' });
    }
}
/**
 * ✏️ UPDATE USER
 */
async function updateUser(req, res) {
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
    }
    catch (error) {
        return res.status(500).json({ message: error?.message || 'Internal server error' });
    }
}
/**
 * 🗑️ DELETE USER
 */
async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await prisma.user.delete({ where: { id } });
        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error?.message || 'Internal server error' });
    }
}
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
