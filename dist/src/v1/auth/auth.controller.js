"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { prisma } = require('../../../config/db');
const argon = require('argon2');
const { registerSchema, loginSchema } = require('../../lib/validation');
const generateToken = require('../../lib/generateToken');
/**
 * Register Controller
 */
async function register(req, res) {
    try {
        const { fullName, password, email } = req.body;
        const { error } = registerSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: error.details.map((e) => e.message),
            });
        }
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists',
            });
        }
        const hashedPassword = await argon.hash(password);
        // Create user
        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
            },
        });
        const token = await generateToken(user.id, res);
        return res.status(201).json({
            message: 'User registered successfully',
            user,
            token,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error?.message || 'Internal server error',
        });
    }
}
/**
 *Login Controller
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const { error } = loginSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: error.details.map((e) => e.message)
            });
        }
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials',
            });
        }
        const token = await generateToken(user.id, res);
        return res.status(200).json({
            message: 'Login successful',
            token,
            user
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error?.message || 'Internal server error',
        });
    }
}
/**
 * Logout Controller
 */
async function logout(req, res) {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(400).json({
                message: 'Invalid token'
            });
        }
        res.clearCookie(token);
        return res.status(200).json({
            message: 'Logout successful'
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error?.message || 'Internal server error',
        });
    }
}
module.exports = { register, login, logout };
