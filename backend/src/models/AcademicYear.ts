import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicYear extends Document {
    label: string;
    startYear: number;
    endYear: number;
    isActive: boolean;
}

const AcademicYearSchema = new Schema<IAcademicYear>({
    label: { type: String, required: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number, required: true },
    isActive: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IAcademicYear>('AcademicYear', AcademicYearSchema);
