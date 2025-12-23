import express from 'express';
import { register, login, getCurrentUser, getAllUsers, updateUserStatus } from '../api-function/auth-function.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getCurrentUser);
router.get('/users', verifyToken, getAllUsers);
router.put('/users/:userId/status', verifyToken, updateUserStatus);

export default router;
