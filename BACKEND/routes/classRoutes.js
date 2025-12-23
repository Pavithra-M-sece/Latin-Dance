import express from 'express';
import { getClasses, getClassById, createClass, updateClass, deleteClass } from '../api-function/class-function.js';

const router = express.Router();

// Get all classes
router.get('/', getClasses);

// Get single class
router.get('/:id', getClassById);

// Create class (admin/instructor only)
router.post('/', createClass);

// Update class
router.put('/:id', updateClass);

// Delete class
router.delete('/:id', deleteClass);

export default router;
