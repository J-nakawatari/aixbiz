import { Router } from 'express';
import { submitContact } from '../controllers/contactController';
import { validateContactForm } from '../validators/contactValidator';

const router = Router();

// 相談申し込みフォーム送信
router.post('/submit', validateContactForm, submitContact);

export default router;