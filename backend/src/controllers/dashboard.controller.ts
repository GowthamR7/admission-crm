import { Request, Response } from 'express';
import Applicant from '../models/Applicant';
import Admission from '../models/Admission';
import SeatMatrix from '../models/SeatMatrix';

export const getDashboard = async (_req: Request, res: Response) => {
    try {
        const [totalApplicants, totalAdmissions, confirmedAdmissions, feePending, docPending, matrices] =
            await Promise.all([
                Applicant.countDocuments(),
                Admission.countDocuments(),
                Admission.countDocuments({ status: 'Confirmed' }),
                Applicant.countDocuments({ feeStatus: 'Pending' }),
                Applicant.countDocuments({ 'documents.status': 'Pending' }),
                SeatMatrix.find().populate('program', 'name code courseType'),
            ]);

        const seatSummary = matrices.map((m) => ({
            program: (m.program as any)?.name,
            programCode: (m.program as any)?.code,
            totalIntake: m.totalIntake,
            quotas: m.quotas.map((q) => ({
                type: q.type,
                total: q.totalSeats,
                filled: q.filledSeats,
                available: q.totalSeats - q.filledSeats,
            })),
        }));

        const statusBreakdown = await Admission.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        res.json({
            totalApplicants,
            totalAdmissions,
            confirmedAdmissions,
            feePending,
            docPending,
            seatSummary,
            statusBreakdown,
        });
    } catch (e: any) { res.status(500).json({ message: e.message }); }
};
