import express from 'express';
import {
    cekProfile,
    editProfile,
    regUser,
    forgotPasswordRequest,
    verifyOtp,
    resetPassword
} from '../controllers/UsersController.js';
import { verifyUser } from '../middleware/Auth.js';

const router = express.Router();

router.post('/register', regUser);
router.get('/profile/:id', cekProfile);
router.patch('/edit-profile', verifyUser, editProfile);
router.post('/forgot-password', forgotPasswordRequest);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;