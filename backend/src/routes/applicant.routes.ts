import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import {
    getApplicants, getApplicant, createApplicant,
    updateApplicant, updateDocumentStatus, updateFeeStatus,
} from '../controllers/applicant.controller';

const router = Router();
router.use(protect);
router.route('/').get(getApplicants).post(authorize('Admin', 'AdmissionOfficer'), createApplicant);
router.route('/:id').get(getApplicant).put(authorize('Admin', 'AdmissionOfficer'), updateApplicant);
router.put('/:id/documents', authorize('Admin', 'AdmissionOfficer'), updateDocumentStatus);
router.put('/:id/fee', authorize('Admin', 'AdmissionOfficer'), updateFeeStatus);
export default router;
