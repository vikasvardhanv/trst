import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/submit', submitContactForm);

export default router;
