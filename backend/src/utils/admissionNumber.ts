import mongoose from 'mongoose';
import Program from '../models/Program';
import SeatMatrix from '../models/SeatMatrix';
import Admission from '../models/Admission';

/**
 * Generates a unique admission number in format:
 * INST/2026/UG/CSE/KCET/0001
 */
export const generateAdmissionNumber = async (
    institutionCode: string,
    year: number,
    courseType: string,
    programCode: string,
    quotaType: string,
): Promise<string> => {
    const prefix = `${institutionCode}/${year}/${courseType}/${programCode}/${quotaType}`;
    const count = await Admission.countDocuments({
        admissionNumber: { $regex: `^${prefix}` },
    });
    const seq = String(count + 1).padStart(4, '0');
    return `${prefix}/${seq}`;
};
