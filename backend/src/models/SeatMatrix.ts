import mongoose, { Schema, Document } from 'mongoose';

export interface IQuota {
    type: 'KCET' | 'COMEDK' | 'Management' | 'SNQ';
    totalSeats: number;
    filledSeats: number;
}

export interface ISeatMatrix extends Document {
    program: mongoose.Types.ObjectId;
    academicYear: mongoose.Types.ObjectId;
    totalIntake: number;
    quotas: IQuota[];
}

const QuotaSchema = new Schema<IQuota>({
    type: { type: String, enum: ['KCET', 'COMEDK', 'Management', 'SNQ'], required: true },
    totalSeats: { type: Number, required: true, min: 0 },
    filledSeats: { type: Number, default: 0, min: 0 },
});

const SeatMatrixSchema = new Schema<ISeatMatrix>({
    program: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
    academicYear: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
    totalIntake: { type: Number, required: true },
    quotas: [QuotaSchema],
}, { timestamps: true });

// Validate total quota seats == totalIntake
SeatMatrixSchema.pre('save', function (next) {
    const sum = this.quotas.reduce((acc, q) => acc + q.totalSeats, 0);
    if (sum !== this.totalIntake) {
        return next(new Error(`Quota seats sum (${sum}) must equal totalIntake (${this.totalIntake})`));
    }
    next();
});

export default mongoose.model<ISeatMatrix>('SeatMatrix', SeatMatrixSchema);
