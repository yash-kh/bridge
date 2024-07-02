import express from 'express';
import { postQuote } from '../controllers/quoteController.js';

const router = express.Router();

router.post('/', postQuote);

export default router;