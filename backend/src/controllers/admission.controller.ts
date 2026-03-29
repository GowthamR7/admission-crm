import { Request, Response } from 'express';
import Admission from '../models/Admission';
import Applicant from '../models/Applicant';
import SeatMatrix from '../models/SeatMatrix';
import Program from '../models/Program';
import Institution from '../models/Institution';
import AcademicYear from '../models/AcademicYear';
import { generateAdmissionNumber } from '../utils/admissionNumber';

export const getAdmissions = async (req: Request, res: Response) => {
    try {
        const filter: any = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.program) filter.program = req.query.program;
        const data = await Admission.find(filter)
            .populate('applicant')
            .populate('program')
            .populate('academicYear')
            .sort('-createdAt');
        res.json(data);
    } catch (e: any) { res.status(500).json({ message: e.message }); }
};

export const getAdmission = async (req: Request, res: Response) => {
    try {
        const doc = await Admission.findById(req.params.id)
            .populate('applicant')
            .populate({ path: 'program', populate: { path: 'department', populate: { path: 'campus', populate: { path: 'institution' } } } })
            .populate('academicYear');
        if (!doc) return res.status(404).json({ message: 'Admission not found' });
        res.json(doc);
    } catch (e: any) { res.status(500).json({ message: e.message }); }
};

// Allocate seat (lock)
export const allocateSeat = async (req: any, res: Response) => {
    try {
        const { applicantId, programId, academicYearId, quotaType, allotmentNumber } = req.body;

        // Check seat availability
        const matrix = await SeatMatrix.findOne({ program: programId, academicYear: academicYearId });
        if (!matrix) return res.status(400).json({ message: 'Seat matrix not configured for this program/year' });

        const quota = matrix.quotas.find((q) => q.type === quotaType);
        if (!quota) return res.status(400).json({ message: `Quota type '${quotaType}' not found` });
        if (quota.filledSeats >= quota.totalSeats)
            return res.status(400).json({ message: `Quota '${quotaType}' is full (${quota.totalSeats}/${quota.totalSeats})` });

        // Create admission record
        const admission = await Admission.create({
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
    } catch (e: any) { res.status(400).json({ message: e.message }); }
};

// Confirm admission (generate number — only when fee is paid)
export const confirmAdmission = async (req: Request, res: Response) => {
    try {
        const admission = await Admission.findById(req.params.id).populate({
            path: 'program',
            populate: { path: 'department', populate: { path: 'campus', populate: { path: 'institution' } } },
        }).populate('academicYear');

        if (!admission) return res.status(404).json({ message: 'Admission not found' });
        if (admission.admissionNumber) return res.status(400).json({ message: 'Already confirmed' });

        // Verify fee is paid
        const applicant = await Applicant.findById(admission.applicant);
        if (!applicant || applicant.feeStatus !== 'Paid')
            return res.status(400).json({ message: 'Fee must be paid before confirming admission' });

        const program = admission.program as any;
        const institution = program?.department?.campus?.institution;
        const year = (admission.academicYear as any).startYear;

        const admNo = await generateAdmissionNumber(
            institution?.code || 'INST',
            year,
            program?.courseType || 'UG',
            program?.code || 'PROG',
            admission.quotaType,
        );

        admission.admissionNumber = admNo;
        admission.status = 'Confirmed';
        admission.confirmedAt = new Date();
        await admission.save();

        res.json(admission);
    } catch (e: any) { res.status(400).json({ message: e.message }); }
};

export const updateAdmissionStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const admission = await Admission.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(admission);
    } catch (e: any) { res.status(400).json({ message: e.message }); }
};
