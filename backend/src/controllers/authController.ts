import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../config/firebase';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    console.log('Register request received:', req.body);
    const { name, email, password } = req.body;

    try {
        // 1. Create user in Firebase Auth
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        // 2. Create user profile in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            name,
            email,
            role: 'user',
            createdAt: new Date().toISOString(),
        });

        res.status(201).json({
            _id: userRecord.uid,
            name,
            email,
            role: 'user',
        });
    } catch (error: any) {
        console.error('Error registering user:', error);
        res.status(400).json({ message: error.message || 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
    // Frontend handles the actual login with Firebase SDK and gets the token.
    // This endpoint can be used to verify the token or just return success if we want to keep the API structure.
    // For now, we'll assume the frontend sends the token in the header to the 'me' endpoint to get user data.

    // If we want to support server-side login (less common with Firebase), we'd need the client SDK here or use REST API.
    // Let's just return a message saying "Use Frontend SDK".

    res.json({ message: 'Please login using the Frontend Firebase SDK' });
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req: Request, res: Response) => {
    // Client side handles logout (clearing token)
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
    const userReq = req as any;
    if (userReq.user) {
        try {
            const userDoc = await db.collection('users').doc(userReq.user._id).get();
            if (userDoc.exists) {
                res.json({ _id: userDoc.id, ...userDoc.data() });
            } else {
                // Fallback if user exists in Auth but not Firestore (legacy or error)
                res.json({
                    _id: userReq.user._id,
                    name: userReq.user.email, // Fallback name
                    email: userReq.user.email,
                    role: 'user'
                });
            }
        } catch (error) {
            res.status(500);
            throw new Error('Error fetching user profile');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};
