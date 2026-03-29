import { Request, Response } from 'express';
import SeatMatrix from '../models/SeatMatrix';

export const getSeatMatrices = async (req: Request, res: Response) => {
    const filter: any = {};
    if (req.query.program) filter.program = req.query.program;
    if (req.query.academicYear) filter.academicYear = req.query.academicYear;
    const data = await SeatMatrix.find(filter)
        .populate('program')
        .populate('academicYear');
    res.json(data);
};

export const createSeatMatrix = async (req: Request, res: Response) => {
    try {
        const doc = await SeatMatrix.create(req.body);
        res.status(201).json(doc);
    } catch (e: any) {
        res.status(400).json({ message: e.message });
    }
};

export const updateSeatMatrix = async (req: Request, res: Response) => {
    try {
        const existing = await SeatMatrix.findById(req.params.id);
        if (!existing) return res.status(404).json({ message: 'Not found' });
        Object.assign(existing, req.body);
        await existing.save();
        res.json(existing);
    } catch (e: any) {
        res.status(400).json({ message: e.message });
    }
};

export const getSeatCounters = async (req: Request, res: Response) => {
    const { programId, academicYearId } = req.params;
    const matrix = await SeatMatrix.findOne({ program: programId, academicYear: academicYearId });
    if (!matrix) return res.status(404).json({ message: 'Seat matrix not found' });
    const counters = matrix.quotas.map((q) => ({
        type: q.type,
        total: q.totalSeats,
        filled: q.filledSeats,
        available: q.totalSeats - q.filledSeats,
    }));
    res.json({ totalIntake: matrix.totalIntake, counters });
};
