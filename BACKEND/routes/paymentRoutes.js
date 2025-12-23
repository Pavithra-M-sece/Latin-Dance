import express from 'express';
import { getStudentPayments, getPayments, createPayment, updatePayment, getPaymentsSummary } from '../api-function/payment-function.js';

const router = express.Router();

// Get all payments for a student
router.get('/student/:studentId', getStudentPayments);

// Get all payments
router.get('/', getPayments);

// Get payments summary (totals + monthly revenue)
router.get('/summary', getPaymentsSummary);

// Create payment record
router.post('/', createPayment);

// Update payment status
router.put('/:paymentId', updatePayment);

export default router;
