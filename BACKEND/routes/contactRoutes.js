import express from 'express';
import * as contactController from '../api-function/contact-function.js';

const router = express.Router();

// Public route - anyone can submit a contact message
router.post('/', contactController.createContact);

// Admin routes
router.get('/', contactController.getAllContacts);
router.put('/:id', contactController.updateContactStatus);
router.delete('/:id', contactController.deleteContact);

export default router;
