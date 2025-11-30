import { Request, Response } from 'express';
import { db } from '../config/firebase';

// @desc    Get logged in user's policies
// @route   GET /api/policies/mine
// @access  Private
export const getMyPolicies = async (req: Request, res: Response) => {
    const userReq = req as any;
    const userId = userReq.user._id;

    try {
        const policiesSnapshot = await db.collection('policies')
            .where('userId', '==', userId)
            .get();

        const policies = policiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(policies);
    } catch (error: any) {
        console.error('Error fetching policies:', error);
        res.status(500).json({ message: 'Failed to fetch policies' });
    }
};

// @desc    Create a dummy policy (for testing)
// @route   POST /api/policies
// @access  Private
export const createPolicy = async (req: Request, res: Response) => {
    const userReq = req as any;
    const userId = userReq.user._id;
    const { policyNumber, type, premium, expiryDate, status } = req.body;

    try {
        const policyData = {
            userId,
            policyNumber,
            type,
            premium,
            expiryDate,
            status: status || 'Active',
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('policies').add(policyData);
        res.status(201).json({ id: docRef.id, ...policyData });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to create policy' });
    }
};

// @desc    Claim/Link an existing policy to user account
// @route   POST /api/policies/claim
// @access  Private
export const claimPolicy = async (req: Request, res: Response) => {
    const userReq = req as any;
    const userId = userReq.user._id;
    const { policyNumber } = req.body;

    if (!policyNumber) {
        res.status(400).json({ message: 'Policy number is required' });
        return;
    }

    try {
        // 1. Find the policy
        const policiesSnapshot = await db.collection('policies')
            .where('policyNumber', '==', policyNumber)
            .limit(1)
            .get();

        if (policiesSnapshot.empty) {
            res.status(404).json({ message: 'Policy not found' });
            return;
        }

        const policyDoc = policiesSnapshot.docs[0];
        const policyData = policyDoc.data();

        // 2. Check if already linked
        if (policyData.userId) {
            if (policyData.userId === userId) {
                res.status(400).json({ message: 'Policy is already linked to your account' });
            } else {
                res.status(400).json({ message: 'Policy is already linked to another account' });
            }
            return;
        }

        // 3. Link the policy
        await db.collection('policies').doc(policyDoc.id).update({
            userId: userId
        });

        res.json({ message: 'Policy successfully linked', policy: { id: policyDoc.id, ...policyData, userId } });

    } catch (error: any) {
        console.error('Error claiming policy:', error);
        res.status(500).json({ message: 'Failed to claim policy' });
    }
};

// @desc    Upload a new policy (Placeholder)
// @route   POST /api/policies/upload
// @access  Private
// @desc    Upload a new policy
// @route   POST /api/policies/upload
// @access  Private
export const uploadPolicy = async (req: Request, res: Response) => {
    try {
        const userReq = req as any;
        const userId = userReq.user._id;
        const { type } = req.body;
        const file = req.file;

        if (!type || !file) {
            res.status(400).json({ message: 'Type and File are required' });
            return;
        }

        // Construct file URL (assuming server is running on localhost:5000)
        // In production, this should be an environment variable
        const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${file.filename}`;

        const policyData = {
            userId,
            policyNumber: 'UP-' + Math.floor(Math.random() * 100000),
            type,
            premium: 0, // Placeholder
            sumInsured: 0, // Placeholder
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Pending Verification',
            fileName: file.originalname,
            fileUrl: fileUrl,
            uploadedAt: new Date().toISOString()
        };

        const docRef = await db.collection('policies').add(policyData);
        res.status(201).json({ id: docRef.id, ...policyData });

    } catch (error: any) {
        console.error('Error uploading policy:', error);
        res.status(500).json({ message: 'Failed to upload policy' });
    }
};
