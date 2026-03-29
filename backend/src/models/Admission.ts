import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmission extends Document {
    applicant: mongoose.Types.ObjectId;
    program: mongoose.Types.ObjectId;
    academicYear: mongoose.Types.ObjectId;
    quotaType: 'KCET' | 'COMEDK' | 'Management' | 'SNQ';
    allotmentNumber: string;
    admissionNumber: string;
    status: 'SeatLocked' | 'DocumentsVerified' | 'FeePaid' | 'Confirmed' | 'Cancelled';
    allocatedBy: mongoose.Types.ObjectId;
    confirmedAt: Date;
}

const AdmissionSchema = new Schema<IAdmission>({
    applicant: { type: Schema.Types.ObjectId, ref: 'Applicant', required: true },
    program: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
    academicYear: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
    quotaType: { type: String, enum: ['KCET', 'COMEDK', 'Management', 'SNQ'], required: true },
    allotmentNumber: { type: String },
    admissionNumber: { type: String, unique: true, sparse: true },
    status: {
        type: String,
        enum: ['SeatLocked', 'DocumentsVerified', 'FeePaid', 'Confirmed', 'Cancelled'],
        default: 'SeatLocked',
    },
    allocatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    confirmedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model<IAdmission>('Admission', AdmissionSchema);
