import express from 'express';
import { getBlockchains, getTokens } from '../controllers/tokenController.js';

const router = express.Router();

router.get('/', getTokens);
router.get('/blockchains', getBlockchains);

export default router;
