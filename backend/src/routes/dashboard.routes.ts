import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getDashboard } from '../controllers/dashboard.controller';

const router = Router();
router.use(protect);
router.get('/', getDashboard);
export default router;
