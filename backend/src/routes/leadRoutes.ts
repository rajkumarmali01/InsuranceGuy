import express from 'express';
import {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
} from '../controllers/leadController';
import { protect, adminMiddleware as admin } from '../middleware/authMiddleware';

import { getLeadTimeline, addTimelineEntry } from '../controllers/timelineController';

const router = express.Router();

router.route('/')
    .post(createLead)
    .get(protect, admin, getLeads);

router.route('/:id')
    .get(protect, admin, getLeadById)
    .patch(protect, admin, updateLead);

router.route('/:id/timeline')
    .get(protect, admin, getLeadTimeline)
    .post(protect, admin, addTimelineEntry);

export default router;
