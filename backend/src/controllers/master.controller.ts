import { Request, Response } from 'express';
import Institution from '../models/Institution';
import Campus from '../models/Campus';
import Department from '../models/Department';
import Program from '../models/Program';
import AcademicYear from '../models/AcademicYear';

// ── Institution ──────────────────────────────────
export const getInstitutions = async (_req: Request, res: Response) => {
    const data = await Institution.find(); res.json(data);
};
export const createInstitution = async (req: Request, res: Response) => {
    try { const doc = await Institution.create(req.body); res.status(201).json(doc); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
};
export const updateInstitution = async (req: Request, res: Response) => {
    const doc = await Institution.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
};
export const deleteInstitution = async (req: Request, res: Response) => {
    await Institution.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' });
};

// ── Campus ───────────────────────────────────────
export const getCampuses = async (req: Request, res: Response) => {
    const filter = req.query.institution ? { institution: req.query.institution } : {};
    const data = await Campus.find(filter).populate('institution'); res.json(data);
};
export const createCampus = async (req: Request, res: Response) => {
    try { const doc = await Campus.create(req.body); res.status(201).json(doc); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
};
export const updateCampus = async (req: Request, res: Response) => {
    const doc = await Campus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
};
export const deleteCampus = async (req: Request, res: Response) => {
    await Campus.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' });
};

// ── Department ───────────────────────────────────
export const getDepartments = async (req: Request, res: Response) => {
    const filter = req.query.campus ? { campus: req.query.campus } : {};
    const data = await Department.find(filter).populate('campus'); res.json(data);
};
export const createDepartment = async (req: Request, res: Response) => {
    try { const doc = await Department.create(req.body); res.status(201).json(doc); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
};
export const updateDepartment = async (req: Request, res: Response) => {
    const doc = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
};
export const deleteDepartment = async (req: Request, res: Response) => {
    await Department.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' });
};

// ── Program ──────────────────────────────────────
export const getPrograms = async (req: Request, res: Response) => {
    const filter = req.query.department ? { department: req.query.department } : {};
    const data = await Program.find(filter).populate({ path: 'department', populate: { path: 'campus' } });
    res.json(data);
};
export const createProgram = async (req: Request, res: Response) => {
    try { const doc = await Program.create(req.body); res.status(201).json(doc); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
};
export const updateProgram = async (req: Request, res: Response) => {
    const doc = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
};
export const deleteProgram = async (req: Request, res: Response) => {
    await Program.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' });
};

// ── Academic Year ────────────────────────────────
export const getAcademicYears = async (_req: Request, res: Response) => {
    const data = await AcademicYear.find().sort('-startYear'); res.json(data);
};
export const createAcademicYear = async (req: Request, res: Response) => {
    try { const doc = await AcademicYear.create(req.body); res.status(201).json(doc); }
    catch (e: any) { res.status(400).json({ message: e.message }); }
};
export const setActiveYear = async (req: Request, res: Response) => {
    await AcademicYear.updateMany({}, { isActive: false });
    const doc = await AcademicYear.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    res.json(doc);
};
