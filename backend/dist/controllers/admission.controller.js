"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdmissionStatus = exports.confirmAdmission = exports.allocateSeat = exports.getAdmission = exports.getAdmissions = void 0;
const Admission_1 = __importDefault(require("../models/Admission"));
const Applicant_1 = __importDefault(require("../models/Applicant"));
const SeatMatrix_1 = __importDefault(require("../models/SeatMatrix"));
const admissionNumber_1 = require("../utils/admissionNumber");
const getAdmissions = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status)
            filter.status = req.query.status;
        if (req.query.program)
            filter.program = req.query.program;
        const data = await Admission_1.default.find(filter)
            .populate('applicant')
            .populate('program')
            .populate('academicYear')
            .sort('-createdAt');
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
};
exports.getAdmissions = getAdmissions;
const getAdmission = async (req, res) => {
    try {
        const doc = await Admission_1.default.findById(req.params.id)
            .populate('applicant')
            .populate({ path: 'program', populate: { path: 'department', populate: { path: 'campus', populate: { path: 'institution' } } } })
            .populate('academicYear');
        if (!doc)
            return res.status(404).json({ message: 'Admission not found' });
        res.json(doc);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
};
exports.getAdmission = getAdmission;
// Allocate seat (lock)
const allocateSeat = async (req, res) => {
    try {
        const { applicantId, programId, academicYearId, quotaType, allotmentNumber } = req.body;
        // Check seat availability
        const matrix = await SeatMatrix_1.default.findOne({ program: programId, academicYear: academicYearId });
        if (!matrix)
            return res.status(400).json({ message: 'Seat matrix not configured for this program/year' });
        const quota = matrix.quotas.find((q) => q.type === quotaType);
        if (!quota)
            return res.status(400).json({ message: `Quota type '${quotaType}' not found` });
        if (quota.filledSeats >= quota.totalSeats)
            return res.status(400).json({ message: `Quota '${quotaType}' is full (${quota.totalSeats}/${quota.totalSeats})` });
        // Create admission record
        const admission = await Admission_1.default.create({
            applicant: applicantId,
            program: programId,
            academicYear: academicYearId,
            quotaType,
            allotmentNumber,
            allocatedBy: req.user?.id,
            status: 'SeatLocked',
        });
        // Increment filled seats
        quota.filledSeats += 1;
        await matrix.save();
        res.status(201).json(admission);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.allocateSeat = allocateSeat;
// Confirm admission (generate number — only when fee is paid)
const confirmAdmission = async (req, res) => {
    try {
        const admission = await Admission_1.default.findById(req.params.id).populate({
            path: 'program',
            populate: { path: 'department', populate: { path: 'campus', populate: { path: 'institution' } } },
        }).populate('academicYear');
        if (!admission)
            return res.status(404).json({ message: 'Admission not found' });
        if (admission.admissionNumber)
            return res.status(400).json({ message: 'Already confirmed' });
        // Verify fee is paid
        const applicant = await Applicant_1.default.findById(admission.applicant);
        if (!applicant || applicant.feeStatus !== 'Paid')
            return res.status(400).json({ message: 'Fee must be paid before confirming admission' });
        const program = admission.program;
        const institution = program?.department?.campus?.institution;
        const year = admission.academicYear.startYear;
        const admNo = await (0, admissionNumber_1.generateAdmissionNumber)(institution?.code || 'INST', year, program?.courseType || 'UG', program?.code || 'PROG', admission.quotaType);
        admission.admissionNumber = admNo;
        admission.status = 'Confirmed';
        admission.confirmedAt = new Date();
        await admission.save();
        res.json(admission);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.confirmAdmission = confirmAdmission;
const updateAdmissionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const admission = await Admission_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(admission);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.updateAdmissionStatus = updateAdmissionStatus;
