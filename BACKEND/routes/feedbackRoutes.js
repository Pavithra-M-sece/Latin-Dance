import express from 'express';
import { getFeedback, getClassFeedback, getStudentFeedback, submitFeedback, updateFeedback, deleteFeedback } from '../api-function/feedback-function.js';

const router = express.Router();

// Get all feedback
router.get('/', getFeedback);

// Get feedback for a class
router.get('/class/:classId', getClassFeedback);

// Get feedback for a student
router.get('/student/:studentId', getStudentFeedback);

// Submit feedback
router.post('/', submitFeedback);

// Update feedback
router.put('/:feedbackId', updateFeedback);

// Delete feedback
router.delete('/:feedbackId', deleteFeedback);

export default router;
