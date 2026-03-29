import mongoose, { Schema, Document } from 'mongoose';

export interface IInstitution extends Document {
    name: string;
    code: string;
    address: string;
    phone: string;
    email: string;
    active: boolean;
}

const InstitutionSchema = new Schema<IInstitution>({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IInstitution>('Institution', InstitutionSchema);
