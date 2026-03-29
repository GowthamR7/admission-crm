"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdmissionNumber = void 0;
const Admission_1 = __importDefault(require("../models/Admission"));
/**
 * Generates a unique admission number in format:
 * INST/2026/UG/CSE/KCET/0001
 */
const generateAdmissionNumber = async (institutionCode, year, courseType, programCode, quotaType) => {
    const prefix = `${institutionCode}/${year}/${courseType}/${programCode}/${quotaType}`;
    const count = await Admission_1.default.countDocuments({
        admissionNumber: { $regex: `^${prefix}` },
    });
    const seq = String(count + 1).padStart(4, '0');
    return `${prefix}/${seq}`;
};
exports.generateAdmissionNumber = generateAdmissionNumber;
