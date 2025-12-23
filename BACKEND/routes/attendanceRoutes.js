import express from 'express';
import { getAllAttendance, getStudentAttendance, markAttendance } from '../api-function/attendance-function.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getAllAttendance);
router.get('/student/:studentId', verifyToken, getStudentAttendance);
router.post('/', verifyToken, markAttendance);

export default router;