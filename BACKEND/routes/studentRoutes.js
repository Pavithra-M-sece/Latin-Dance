import express from 'express';
import { getStudentProfile, updateStudentProfile, changeStudentPassword } from '../api-function/student-function.js';

const router = express.Router();

// Get student profile
router.get('/:studentId', getStudentProfile);

// Update student profile
router.put('/:studentId', updateStudentProfile);

// Change password
router.post('/:studentId/change-password', changeStudentPassword);

export default router;
