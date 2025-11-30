import { Request, Response } from 'express';
import { db } from '../config/firebase';

// @desc    Get timeline for a lead
// @route   GET /api/leads/:id/timeline
// @access  Private/Admin
export const getLeadTimeline = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const snapshot = await db.collection('leads').doc(id).collection('timeline')
            .orderBy('timestamp', 'desc')
            .get();

        const timeline = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(timeline);
    } catch (error) {
        console.error('Error fetching timeline:', error);
        res.status(500).json({ message: 'Failed to fetch timeline' });
    }
};

// @desc    Add timeline entry (Note)
// @route   POST /api/leads/:id/timeline
// @access  Private/Admin
export const addTimelineEntry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { description, action } = req.body;
        const userReq = req as any;

        const entry = {
            action: action || 'Note Added',
            description,
            timestamp: new Date().toISOString(),
            by: userReq.user?.name || userReq.user?.email || 'Admin'
        };

        const docRef = await db.collection('leads').doc(id).collection('timeline').add(entry);
        res.status(201).json({ id: docRef.id, ...entry });
    } catch (error) {
        console.error('Error adding timeline entry:', error);
        res.status(500).json({ message: 'Failed to add entry' });
    }
};
