import express from 'express';
import { postParams } from '../controllers/paramController.js';

const router = express.Router();

router.post('/', postParams);

export default router;