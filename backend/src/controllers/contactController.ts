import { Request, Response } from 'express';
import ContactMessage from '../models/ContactMessage';

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
export const createContactMessage = async (req: Request, res: Response) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        res.status(400);
        throw new Error('Please provide required fields');
    }

    const contact = await ContactMessage.create({
        name,
        email,
        phone,
        message,
    });

    res.status(201).json(contact);
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = async (req: Request, res: Response) => {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
};
