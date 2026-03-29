"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const DocumentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Submitted', 'Verified'], default: 'Pending' },
});
const ApplicantSchema = new mongoose_1.Schema({
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
    program: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Program', required: true },
    academicYear: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
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
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
ApplicantSchema.pre('save', async function (next) {
    if (!this.applicationNo) {
        const count = await mongoose_1.default.model('Applicant').countDocuments();
        this.applicationNo = `APP${String(count + 1).padStart(5, '0')}`;
    }
    next();
});
exports.default = mongoose_1.default.model('Applicant', ApplicantSchema);
