import express from 'express';
import { getDashboardStats, getAllUsers, getAllPolicies, verifyPolicy, getUserDetails } from '../controllers/adminController';
import { protect, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(adminMiddleware);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/policies', getAllPolicies);
router.put('/policies/:id/verify', verifyPolicy);
router.get('/users/:id', getUserDetails);

export default router;
