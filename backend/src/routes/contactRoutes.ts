import express from 'express';
import {
    createContactMessage,
    getContactMessages,
} from '../controllers/contactController';
import { protect, adminMiddleware as admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .post(createContactMessage)
    .get(protect, admin, getContactMessages);

export default router;
