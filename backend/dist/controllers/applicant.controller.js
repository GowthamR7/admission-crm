"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeeStatus = exports.updateDocumentStatus = exports.updateApplicant = exports.createApplicant = exports.getApplicant = exports.getApplicants = void 0;
const Applicant_1 = __importDefault(require("../models/Applicant"));
const getApplicants = async (req, res) => {
    try {
        const filter = {};
        if (req.query.program)
            filter.program = req.query.program;
        if (req.query.academicYear)
            filter.academicYear = req.query.academicYear;
        if (req.query.feeStatus)
            filter.feeStatus = req.query.feeStatus;
        const data = await Applicant_1.default.find(filter)
            .populate('program', 'name code courseType')
            .populate('academicYear', 'label')
            .sort('-createdAt');
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
};
exports.getApplicants = getApplicants;
const getApplicant = async (req, res) => {
    try {
        const doc = await Applicant_1.default.findById(req.params.id)
            .populate('program')
            .populate('academicYear');
        if (!doc)
            return res.status(404).json({ message: 'Applicant not found' });
        res.json(doc);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
};
exports.getApplicant = getApplicant;
const createApplicant = async (req, res) => {
    try {
        const data = { ...req.body, createdBy: req.user?.id };
        const doc = await Applicant_1.default.create(data);
        res.status(201).json(doc);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.createApplicant = createApplicant;
const updateApplicant = async (req, res) => {
    try {
        const doc = await Applicant_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(doc);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.updateApplicant = updateApplicant;
const updateDocumentStatus = async (req, res) => {
    try {
        const { docName, status } = req.body;
        const applicant = await Applicant_1.default.findById(req.params.id);
        if (!applicant)
            return res.status(404).json({ message: 'Not found' });
        const doc = applicant.documents.find((d) => d.name === docName);
        if (!doc)
            return res.status(404).json({ message: 'Document not found' });
        doc.status = status;
        await applicant.save();
        res.json(applicant);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.updateDocumentStatus = updateDocumentStatus;
const updateFeeStatus = async (req, res) => {
    try {
        const applicant = await Applicant_1.default.findByIdAndUpdate(req.params.id, { feeStatus: req.body.feeStatus }, { new: true });
        res.json(applicant);
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.updateFeeStatus = updateFeeStatus;
