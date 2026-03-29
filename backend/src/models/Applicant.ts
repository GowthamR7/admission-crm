import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument {
    name: string;
    status: 'Pending' | 'Submitted' | 'Verified';
}

export interface IApplicant extends Document {
    applicationNo: string;
    firstName: string;
    lastName: string;
    dob: Date;
    gender: 'Male' | 'Female' | 'Other';
    category: 'GM' | 'SC' | 'ST' | 'OBC' | 'EWS';
    phone: string;
    email: string;
    state: string;
    parentName: string;
    parentPhone: string;
    entryType: 'Regular' | 'Lateral';
    quotaType: 'KCET' | 'COMEDK' | 'Management' | 'SNQ';
    allotmentNumber: string;
    program: mongoose.Types.ObjectId;
    academicYear: mongoose.Types.ObjectId;
    marksObtained: number;
    marks: string;
    qualifyingExam: string;
    documents: IDocument[];
    feeStatus: 'Pending' | 'Paid';
    createdBy: mongoose.Types.ObjectId;
}

const DocumentSchema = new Schema<IDocument>({
    name: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Submitted', 'Verified'], default: 'Pending' },
});

const ApplicantSchema = new Schema<IApplicant>({
    applicationNo: { type: String, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    category: { type: String, enum: ['GM', 'SC', 'ST', 'OBC', 'EWS'], required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    state: { type: String },
    parentName: { type: String },
    parentPhone: { type: String },
    entryType: { type: String, enum: ['Regular', 'Lateral'], default: 'Regular' },
    quotaType: { type: String, enum: ['KCET', 'COMEDK', 'Management', 'SNQ'], required: true },
    allotmentNumber: { type: String },
    program: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
    academicYear: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
    marksObtained: { type: Number },
    marks: { type: String },
    qualifyingExam: { type: String },
    documents: {
        type: [DocumentSchema], default: [
            { name: 'Photo', status: 'Pending' },
            { name: '10th Certificate', status: 'Pending' },
            { name: '12th Certificate', status: 'Pending' },
            { name: 'Category Certificate', status: 'Pending' },
            { name: 'Transfer Certificate', status: 'Pending' },
        ]
    },
    feeStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

ApplicantSchema.pre('save', async function (next) {
    if (!this.applicationNo) {
        const count = await mongoose.model('Applicant').countDocuments();
        this.applicationNo = `APP${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

export default mongoose.model<IApplicant>('Applicant', ApplicantSchema);
