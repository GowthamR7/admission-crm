import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { getAdmissions, getAdmission, allocateSeat, confirmAdmission, updateAdmissionStatus } from '../controllers/admission.controller';

const router = Router();
router.use(protect);
router.get('/', getAdmissions);
router.get('/:id', getAdmission);
router.post('/allocate', authorize('Admin', 'AdmissionOfficer'), allocateSeat);
router.put('/:id/confirm', authorize('Admin', 'AdmissionOfficer'), confirmAdmission);
router.put('/:id/status', authorize('Admin', 'AdmissionOfficer'), updateAdmissionStatus);
export default router;
