import { Request, Response } from 'express';
import { db } from '../config/firebase';
import * as admin from 'firebase-admin';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Fetch Leads Data
        const leadsSnapshot = await db.collection('leads').get();
        const leads = leadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

        // Lead Aggregation
        const totalLeads = leads.length;
        const newLeadsToday = leads.filter(l => new Date(l.created_at) >= startOfToday).length;
        const newLeadsMonth = leads.filter(l => new Date(l.created_at) >= startOfMonth).length;
        const convertedLeads = leads.filter(l => l.status === 'Converted').length;
        const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

        const leadsByStatus = leads.reduce((acc: any, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1;
            return acc;
        }, {});

        const leadsByProduct = leads.reduce((acc: any, lead) => {
            const product = lead.product_type || 'Other';
            acc[product] = (acc[product] || 0) + 1;
            return acc;
        }, {});

        const leadsByCity = leads.reduce((acc: any, lead) => {
            const city = lead.city || 'Unknown';
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {});

        // Top 5 Cities
        const topCities = Object.entries(leadsByCity)
            .sort(([, a]: any, [, b]: any) => b - a)
            .slice(0, 5)
            .map(([city, count]) => ({ city, count }));


        // 2. Fetch Users Data
        const usersSnapshot = await db.collection('users').get();
        const totalUsers = usersSnapshot.size;
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));


        // 3. Fetch Policies Data
        const policiesSnapshot = await db.collection('policies').get();
        const policies = policiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

        const totalPolicies = policies.length;
        const activePolicies = policies.filter(p => p.status === 'Active').length;
        const totalPremium = policies.reduce((sum, p) => sum + (Number(p.premium) || 0), 0);

        // User Policy Stats
        const userPolicyCounts = policies.reduce((acc: any, p) => {
            if (p.userId) acc[p.userId] = (acc[p.userId] || 0) + 1;
            return acc;
        }, {});

        const usersWithPolicy = Object.keys(userPolicyCounts).length;
        const usersWithoutPolicy = totalUsers - usersWithPolicy;


        // 4. Renewals (Next 30 Days)
        const next30Days = new Date(now);
        next30Days.setDate(now.getDate() + 30);

        const upcomingRenewals = policies.filter(p => {
            if (!p.expiryDate) return false;
            const expiry = new Date(p.expiryDate);
            return expiry >= now && expiry <= next30Days;
        }).map(p => ({
            id: p.id,
            policyNumber: p.policyNumber,
            user: users.find(u => u.id === p.userId)?.name || 'Unknown',
            expiryDate: p.expiryDate,
            product: p.policyType
        }));


        // 5. Recent Data
        const recentLeads = leads
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);

        const recentUsers = users
            .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .slice(0, 5);

        const recentPolicies = policies
            .sort((a, b) => new Date(b.uploadedAt || b.createdAt || 0).getTime() - new Date(a.uploadedAt || a.createdAt || 0).getTime())
            .slice(0, 5);

        res.json({
            leads: {
                total: totalLeads,
                today: newLeadsToday,
                month: newLeadsMonth,
                conversionRate,
                byStatus: leadsByStatus,
                byProduct: leadsByProduct,
                topCities,
                recent: recentLeads
            },
            users: {
                total: totalUsers,
                withPolicy: usersWithPolicy,
                withoutPolicy: usersWithoutPolicy,
                recent: recentUsers
            },
            policies: {
                total: totalPolicies,
                active: activePolicies,
                totalPremium,
                renewals: upcomingRenewals,
                recent: recentPolicies
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('users').orderBy('createdAt', 'desc').limit(20).get();
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get All Policies
// @route   GET /api/admin/policies
// @access  Private/Admin
export const getAllPolicies = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('policies').orderBy('uploadedAt', 'desc').limit(50).get();

        // Fetch user details for each policy to show who uploaded it
        const policies = await Promise.all(snapshot.docs.map(async doc => {
            const data = doc.data();
            let userName = 'Unknown';
            if (data.userId) {
                const userDoc = await db.collection('users').doc(data.userId).get();
                if (userDoc.exists) {
                    userName = userDoc.data()?.name || 'Unknown';
                }
            }
            return {
                id: doc.id,
                userName,
                ...data
            };
        }));

        res.json(policies);
    } catch (error) {
        console.error('Error fetching policies:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify/Approve Policy
// @route   PUT /api/admin/policies/:id/verify
// @access  Private/Admin
export const verifyPolicy = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { premium, sumInsured, status } = req.body;

        await db.collection('policies').doc(id).update({
            status: status || 'Active',
            premium: Number(premium) || 0,
            sumInsured: Number(sumInsured) || 0,
            verifiedAt: new Date().toISOString()
        });

        res.json({ message: 'Policy verified successfully' });
    } catch (error) {
        console.error('Error verifying policy:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get User Details with Policies
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // 1. Fetch User Profile
        const userDoc = await db.collection('users').doc(id).get();
        if (!userDoc.exists) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const userData = userDoc.data();

        // 2. Fetch User Policies
        const policiesSnapshot = await db.collection('policies').where('userId', '==', id).get();
        const policies = policiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // 3. (Optional) Fetch User Documents or Timeline if available
        // For now, we'll return what we have.

        res.json({
            user: { id: userDoc.id, ...userData },
            policies,
            stats: {
                totalPolicies: policies.length,
                activePolicies: policies.filter((p: any) => p.status === 'Active').length,
                totalPremium: policies.reduce((sum: number, p: any) => sum + (Number(p.premium) || 0), 0)
            }
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
