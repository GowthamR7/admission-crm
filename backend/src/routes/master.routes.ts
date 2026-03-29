import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import {
    getInstitutions, createInstitution, updateInstitution, deleteInstitution,
    getCampuses, createCampus, updateCampus, deleteCampus,
    getDepartments, createDepartment, updateDepartment, deleteDepartment,
    getPrograms, createProgram, updateProgram, deleteProgram,
    getAcademicYears, createAcademicYear, setActiveYear,
} from '../controllers/master.controller';

const router = Router();
router.use(protect);

// Institution
router.route('/institutions').get(getInstitutions).post(authorize('Admin'), createInstitution);
router.route('/institutions/:id').put(authorize('Admin'), updateInstitution).delete(authorize('Admin'), deleteInstitution);

// Campus
router.route('/campuses').get(getCampuses).post(authorize('Admin'), createCampus);
router.route('/campuses/:id').put(authorize('Admin'), updateCampus).delete(authorize('Admin'), deleteCampus);

// Department
router.route('/departments').get(getDepartments).post(authorize('Admin'), createDepartment);
router.route('/departments/:id').put(authorize('Admin'), updateDepartment).delete(authorize('Admin'), deleteDepartment);

// Program
router.route('/programs').get(getPrograms).post(authorize('Admin'), createProgram);
router.route('/programs/:id').put(authorize('Admin'), updateProgram).delete(authorize('Admin'), deleteProgram);

// Academic Year
router.route('/academic-years').get(getAcademicYears).post(authorize('Admin'), createAcademicYear);
router.put('/academic-years/:id/activate', authorize('Admin'), setActiveYear);

export default router;
