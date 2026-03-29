"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const Applicant_1 = __importDefault(require("../models/Applicant"));
const Admission_1 = __importDefault(require("../models/Admission"));
const SeatMatrix_1 = __importDefault(require("../models/SeatMatrix"));
const getDashboard = async (_req, res) => {
    try {
        const [totalApplicants, totalAdmissions, confirmedAdmissions, feePending, docPending, matrices] = await Promise.all([
            Applicant_1.default.countDocuments(),
            Admission_1.default.countDocuments(),
            Admission_1.default.countDocuments({ status: 'Confirmed' }),
            Applicant_1.default.countDocuments({ feeStatus: 'Pending' }),
            Applicant_1.default.countDocuments({ 'documents.status': 'Pending' }),
            SeatMatrix_1.default.find().populate('program', 'name code courseType'),
        ]);
        const seatSummary = matrices.map((m) => ({
            program: m.program?.name,
            programCode: m.program?.code,
            totalIntake: m.totalIntake,
            quotas: m.quotas.map((q) => ({
                type: q.type,
                total: q.totalSeats,
                filled: q.filledSeats,
                available: q.totalSeats - q.filledSeats,
            })),
        }));
        const statusBreakdown = await Admission_1.default.aggregate([
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
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
};
exports.getDashboard = getDashboard;
