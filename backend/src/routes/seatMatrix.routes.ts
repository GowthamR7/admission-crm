import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { getSeatMatrices, createSeatMatrix, updateSeatMatrix, getSeatCounters } from '../controllers/seatMatrix.controller';

const router = Router();
router.use(protect);
router.route('/').get(getSeatMatrices).post(authorize('Admin'), createSeatMatrix);
router.route('/:id').put(authorize('Admin'), updateSeatMatrix);
router.get('/counters/:programId/:academicYearId', getSeatCounters);
export default router;
