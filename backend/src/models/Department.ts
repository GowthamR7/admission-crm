import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
    name: string;
    code: string;
    campus: mongoose.Types.ObjectId;
    active: boolean;
}

const DepartmentSchema = new Schema<IDepartment>({
    name: { type: String, required: true },
    code: { type: String, required: true, uppercase: true },
    campus: { type: Schema.Types.ObjectId, ref: 'Campus', required: true },
    active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IDepartment>('Department', DepartmentSchema);
