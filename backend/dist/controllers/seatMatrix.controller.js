"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeatCounters = exports.updateSeatMatrix = exports.createSeatMatrix = exports.getSeatMatrices = void 0;
const SeatMatrix_1 = __importDefault(require("../models/SeatMatrix"));
const getSeatMatrices = async (req, res) => {
    const filter = {};
    if (req.query.program)
        filter.program = req.query.program;
    if (req.query.academicYear)
        filter.academicYear = req.query.academicYear;
    const data = await SeatMatrix_1.default.find(filter)
        .populate('program')
        .populate('academicYear');
    res.json(data);
};
exports.getSeatMatrices = getSeatMatrices;
const createSeatMatrix = async (req, res) => {
    try {
        const doc = await SeatMatrix_1.default.create(req.body);
        res.status(201).json(doc);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.createSeatMatrix = createSeatMatrix;
const updateSeatMatrix = async (req, res) => {
    try {
        const existing = await SeatMatrix_1.default.findById(req.params.id);
        if (!existing)
            return res.status(404).json({ message: 'Not found' });
        Object.assign(existing, req.body);
        await existing.save();
        res.json(existing);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.updateSeatMatrix = updateSeatMatrix;
const getSeatCounters = async (req, res) => {
    const { programId, academicYearId } = req.params;
    const matrix = await SeatMatrix_1.default.findOne({ program: programId, academicYear: academicYearId });
    if (!matrix)
        return res.status(404).json({ message: 'Seat matrix not found' });
    const counters = matrix.quotas.map((q) => ({
        type: q.type,
        total: q.totalSeats,
        filled: q.filledSeats,
        available: q.totalSeats - q.filledSeats,
    }));
    res.json({ totalIntake: matrix.totalIntake, counters });
};
exports.getSeatCounters = getSeatCounters;
