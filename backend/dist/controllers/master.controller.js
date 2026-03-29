"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setActiveYear = exports.createAcademicYear = exports.getAcademicYears = exports.deleteProgram = exports.updateProgram = exports.createProgram = exports.getPrograms = exports.deleteDepartment = exports.updateDepartment = exports.createDepartment = exports.getDepartments = exports.deleteCampus = exports.updateCampus = exports.createCampus = exports.getCampuses = exports.deleteInstitution = exports.updateInstitution = exports.createInstitution = exports.getInstitutions = void 0;
const Institution_1 = __importDefault(require("../models/Institution"));
const Campus_1 = __importDefault(require("../models/Campus"));
const Department_1 = __importDefault(require("../models/Department"));
const Program_1 = __importDefault(require("../models/Program"));
const AcademicYear_1 = __importDefault(require("../models/AcademicYear"));
// ── Institution ──────────────────────────────────
const getInstitutions = async (_req, res) => {
    const data = await Institution_1.default.find();
    res.json(data);
};
exports.getInstitutions = getInstitutions;
const createInstitution = async (req, res) => {
    try {
        const doc = await Institution_1.default.create(req.body);
        res.status(201).json(doc);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.createInstitution = createInstitution;
const updateInstitution = async (req, res) => {
    const doc = await Institution_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
};
exports.updateInstitution = updateInstitution;
const deleteInstitution = async (req, res) => {
    await Institution_1.default.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
};
exports.deleteInstitution = deleteInstitution;
// ── Campus ───────────────────────────────────────
const getCampuses = async (req, res) => {
    const filter = req.query.institution ? { institution: req.query.institution } : {};
    const data = await Campus_1.default.find(filter).populate('institution');
    res.json(data);
};
exports.getCampuses = getCampuses;
const createCampus = async (req, res) => {
    try {
        const doc = await Campus_1.default.create(req.body);
        res.status(201).json(doc);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.createCampus = createCampus;
const updateCampus = async (req, res) => {
    const doc = await Campus_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
};
exports.updateCampus = updateCampus;
const deleteCampus = async (req, res) => {
    await Campus_1.default.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
};
exports.deleteCampus = deleteCampus;
// ── Department ───────────────────────────────────
const getDepartments = async (req, res) => {
    const filter = req.query.campus ? { campus: req.query.campus } : {};
    const data = await Department_1.default.find(filter).populate('campus');
    res.json(data);
};
exports.getDepartments = getDepartments;
const createDepartment = async (req, res) => {
    try {
        const doc = await Department_1.default.create(req.body);
        res.status(201).json(doc);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.createDepartment = createDepartment;
const updateDepartment = async (req, res) => {
    const doc = await Department_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
};
exports.updateDepartment = updateDepartment;
const deleteDepartment = async (req, res) => {
    await Department_1.default.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
};
exports.deleteDepartment = deleteDepartment;
// ── Program ──────────────────────────────────────
const getPrograms = async (req, res) => {
    const filter = req.query.department ? { department: req.query.department } : {};
    const data = await Program_1.default.find(filter).populate({ path: 'department', populate: { path: 'campus' } });
    res.json(data);
};
exports.getPrograms = getPrograms;
const createProgram = async (req, res) => {
    try {
        const doc = await Program_1.default.create(req.body);
        res.status(201).json(doc);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.createProgram = createProgram;
const updateProgram = async (req, res) => {
    const doc = await Program_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
};
exports.updateProgram = updateProgram;
const deleteProgram = async (req, res) => {
    await Program_1.default.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
};
exports.deleteProgram = deleteProgram;
// ── Academic Year ────────────────────────────────
const getAcademicYears = async (_req, res) => {
    const data = await AcademicYear_1.default.find().sort('-startYear');
    res.json(data);
};
exports.getAcademicYears = getAcademicYears;
const createAcademicYear = async (req, res) => {
    try {
        const doc = await AcademicYear_1.default.create(req.body);
        res.status(201).json(doc);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.createAcademicYear = createAcademicYear;
const setActiveYear = async (req, res) => {
    await AcademicYear_1.default.updateMany({}, { isActive: false });
    const doc = await AcademicYear_1.default.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    res.json(doc);
};
exports.setActiveYear = setActiveYear;
