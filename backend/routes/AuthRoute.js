import express from 'express';
import {
    Login,
    Me,
    Logout
} from '../controllers/AuthController.js';
import { verifyUser } from '../middleware/Auth.js';

const router = express.Router();
router.post('/login', Login);
router.get('/me', verifyUser, Me);
router.delete('/logout', verifyUser, Logout);

export default router;