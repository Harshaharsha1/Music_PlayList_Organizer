import { Router } from 'express';
import { askChat } from '../controllers/chatController.js';

const router = Router();

router.post('/ask', askChat);

export default router;
