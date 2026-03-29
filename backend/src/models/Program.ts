import mongoose, { Schema, Document } from 'mongoose';

export interface IProgram extends Document {
    name: string;
    code: string;
    department: mongoose.Types.ObjectId;
    courseType: 'UG' | 'PG';
    entryType: 'Regular' | 'Lateral';
    admissionMode: 'Government' | 'Management' | 'Both';
    duration: number;
    active: boolean;
}

const ProgramSchema = new Schema<IProgram>({
    name: { type: String, required: true },
    code: { type: String, required: true, uppercase: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    courseType: { type: String, enum: ['UG', 'PG'], required: true },
    entryType: { type: String, enum: ['Regular', 'Lateral'], default: 'Regular' },
    admissionMode: { type: String, enum: ['Government', 'Management', 'Both'], default: 'Both' },
    duration: { type: Number, default: 4 },
    active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IProgram>('Program', ProgramSchema);
