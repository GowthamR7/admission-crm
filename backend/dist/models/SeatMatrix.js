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
const QuotaSchema = new mongoose_1.Schema({
    type: { type: String, enum: ['KCET', 'COMEDK', 'Management', 'SNQ'], required: true },
    totalSeats: { type: Number, required: true, min: 0 },
    filledSeats: { type: Number, default: 0, min: 0 },
});
const SeatMatrixSchema = new mongoose_1.Schema({
    program: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Program', required: true },
    academicYear: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
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
exports.default = mongoose_1.default.model('SeatMatrix', SeatMatrixSchema);
