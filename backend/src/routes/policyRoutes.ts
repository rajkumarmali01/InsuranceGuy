import express from 'express';
import multer from 'multer';
import path from 'path';
import { getMyPolicies, createPolicy, claimPolicy, uploadPolicy } from '../controllers/policyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.get('/mine', protect, getMyPolicies);
router.post('/claim', protect, claimPolicy);
router.post('/upload', protect, upload.single('file'), uploadPolicy);
router.post('/', protect, createPolicy); // Helper to seed data

export default router;
