import express from 'express';
import { getAllEnrollments, getStudentEnrollments, getClassEnrollments, createEnrollment, deleteEnrollment, approveEnrollment, rejectEnrollment } from '../api-function/enrollment-function.js';

const router = express.Router();

// Get all enrollments
router.get('/', getAllEnrollments);

// Get all enrollments for a student
router.get('/student/:studentId', getStudentEnrollments);

// Get all enrollments for a class
router.get('/class/:classId', getClassEnrollments);

// Enroll student in class
router.post('/', createEnrollment);

// Drop enrollment
router.delete('/:enrollmentId', deleteEnrollment);

// Approve enrollment
router.put('/:enrollmentId/approve', approveEnrollment);

// Reject enrollment
router.put('/:enrollmentId/reject', rejectEnrollment);

export default router;
