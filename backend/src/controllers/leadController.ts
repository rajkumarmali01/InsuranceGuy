import { Request, Response } from 'express';
import { db } from '../config/firebase';

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
import { formatPhoneNumber, formatName } from '../utils/formatters';

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
export const createLead = async (req: Request, res: Response) => {
    const { fullName, phone, email, city, productType, details, sourcePage } = req.body;

    if (!fullName || !phone || !productType) {
        res.status(400);
        throw new Error('Please provide required fields: fullName, phone, productType');
    }

    // Clean Data
    const cleanPhone = formatPhoneNumber(phone);
    const cleanName = formatName(fullName);

    try {
        // Duplicate Check
        const existingLeadSnapshot = await db.collection('leads').where('phone', '==', cleanPhone).get();
        const isDuplicate = !existingLeadSnapshot.empty;
        const tags = isDuplicate ? ['Duplicate'] : [];

        const leadData = {
            name: cleanName,
            phone: cleanPhone,
            email: email.toLowerCase(), // Also lowercase email
            city: formatName(city), // Title case city
            product_type: productType,
            vehicle_details: details,
            sum_insured: details?.sum_insured || null,
            lead_source: sourcePage || 'homepage-hero-form',
            status: 'New',
            tags,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const docRef = await db.collection('leads').add(leadData);

        // Add initial timeline entry
        await docRef.collection('timeline').add({
            action: 'Lead Created',
            description: isDuplicate ? 'Lead created (Potential Duplicate)' : 'New lead created via form',
            timestamp: new Date().toISOString(),
            by: 'System'
        });

        res.status(201).json({ id: docRef.id, ...leadData, isDuplicate });
    } catch (error: any) {
        console.error('Error creating lead in Firebase:', error);
        res.status(500).json({
            message: 'Failed to create lead',
            error: error.message
        });
    }
};

// @desc    Get all leads with filters and pagination
// @route   GET /api/leads
// @access  Private/Admin
export const getLeads = async (req: Request, res: Response) => {
    console.log('--- GET LEADS CALLED ---');
    console.log('Query Params:', req.query);

    try {
        const { search, status, productType, city, startDate, endDate, page = 1, limit = 10 } = req.query;

        let query: FirebaseFirestore.Query = db.collection('leads');

        // Apply Database Filters
        if (status) query = query.where('status', '==', status);
        if (productType) query = query.where('product_type', '==', productType);
        if (city) query = query.where('city', '==', city);

        // Date Range
        if (startDate) query = query.where('created_at', '>=', startDate);
        if (endDate) query = query.where('created_at', '<=', endDate);

        // Ordering
        // query = query.orderBy('created_at', 'desc'); 
        // TEMPORARILY REMOVE ORDERBY to rule out Index Error

        // Execute Query
        const snapshot = await query.get();
        console.log(`Firestore Snapshot Size: ${snapshot.size}`);

        let leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Apply Search (In-Memory)
        if (search) {
            const searchLower = (search as string).toLowerCase();
            leads = leads.filter((lead: any) =>
                (lead.name && lead.name.toLowerCase().includes(searchLower)) ||
                (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
                (lead.phone && lead.phone.includes(searchLower))
            );
        }

        // Pagination
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const total = leads.length;
        const paginatedLeads = leads.slice((pageNum - 1) * limitNum, pageNum * limitNum);

        console.log(`Returning ${paginatedLeads.length} leads (Total: ${total})`);

        res.json({
            leads: paginatedLeads,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            total
        });
    } catch (error: any) {
        console.error('Error getting leads from Firebase:', error);
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Get lead by ID
// @route   GET /api/leads/:id
// @access  Private/Admin
export const getLeadById = async (req: Request, res: Response) => {
    try {
        const doc = await db.collection('leads').doc(req.params.id).get();
        if (doc.exists) {
            res.json({ id: doc.id, ...doc.data() });
        } else {
            res.status(404);
            throw new Error('Lead not found');
        }
    } catch (error: any) {
        res.status(500);
        throw new Error('Error fetching lead');
    }
};

// @desc    Update lead status
// @route   PATCH /api/leads/:id
// @access  Private/Admin
export const updateLead = async (req: Request, res: Response) => {
    try {
        const leadRef = db.collection('leads').doc(req.params.id);
        const doc = await leadRef.get();

        if (doc.exists) {
            await leadRef.update(req.body);
            const updatedDoc = await leadRef.get();
            res.json({ id: updatedDoc.id, ...updatedDoc.data() });
        } else {
            res.status(404);
            throw new Error('Lead not found');
        }
    } catch (error: any) {
        res.status(500);
        throw new Error('Error updating lead');
    }
};
