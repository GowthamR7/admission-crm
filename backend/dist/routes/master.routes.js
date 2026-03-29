"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const master_controller_1 = require("../controllers/master.controller");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
// Institution
router.route('/institutions').get(master_controller_1.getInstitutions).post((0, auth_1.authorize)('Admin'), master_controller_1.createInstitution);
router.route('/institutions/:id').put((0, auth_1.authorize)('Admin'), master_controller_1.updateInstitution).delete((0, auth_1.authorize)('Admin'), master_controller_1.deleteInstitution);
// Campus
router.route('/campuses').get(master_controller_1.getCampuses).post((0, auth_1.authorize)('Admin'), master_controller_1.createCampus);
router.route('/campuses/:id').put((0, auth_1.authorize)('Admin'), master_controller_1.updateCampus).delete((0, auth_1.authorize)('Admin'), master_controller_1.deleteCampus);
// Department
router.route('/departments').get(master_controller_1.getDepartments).post((0, auth_1.authorize)('Admin'), master_controller_1.createDepartment);
router.route('/departments/:id').put((0, auth_1.authorize)('Admin'), master_controller_1.updateDepartment).delete((0, auth_1.authorize)('Admin'), master_controller_1.deleteDepartment);
// Program
router.route('/programs').get(master_controller_1.getPrograms).post((0, auth_1.authorize)('Admin'), master_controller_1.createProgram);
router.route('/programs/:id').put((0, auth_1.authorize)('Admin'), master_controller_1.updateProgram).delete((0, auth_1.authorize)('Admin'), master_controller_1.deleteProgram);
// Academic Year
router.route('/academic-years').get(master_controller_1.getAcademicYears).post((0, auth_1.authorize)('Admin'), master_controller_1.createAcademicYear);
router.put('/academic-years/:id/activate', (0, auth_1.authorize)('Admin'), master_controller_1.setActiveYear);
exports.default = router;
