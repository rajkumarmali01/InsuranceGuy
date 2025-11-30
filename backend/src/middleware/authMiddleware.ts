import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

import { db } from '../config/firebase';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decodedToken = await admin.auth().verifyIdToken(token);

            // Fetch user role from Firestore
            const userDoc = await db.collection('users').doc(decodedToken.uid).get();
            const userData = userDoc.data();

            console.log(`[Auth Debug] UID: ${decodedToken.uid}`);
            console.log(`[Auth Debug] Email: ${decodedToken.email}`);
            console.log(`[Auth Debug] Firestore Role: ${userData?.role}`);

            // Attach user info to request
            req.user = {
                _id: decodedToken.uid,
                email: decodedToken.email,
                role: userData?.role || 'user'
            };

            next();
        } catch (error) {
            console.error('Not authorized, token failed');
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};
