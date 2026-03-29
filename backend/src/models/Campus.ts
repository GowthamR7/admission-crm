import mongoose, { Schema, Document } from 'mongoose';

export interface ICampus extends Document {
    name: string;
    code: string;
    institution: mongoose.Types.ObjectId;
    location: string;
    active: boolean;
}

const CampusSchema = new Schema<ICampus>({
    name: { type: String, required: true },
    code: { type: String, required: true, uppercase: true },
    institution: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
    location: { type: String },
    active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<ICampus>('Campus', CampusSchema);
