import { Request, Response } from 'express';
import Applicant from '../models/Applicant';

export const getApplicants = async (req: Request, res: Response) => {
    try {
        const filter: any = {};
        if (req.query.program) filter.program = req.query.program;
        if (req.query.academicYear) filter.academicYear = req.query.academicYear;
        if (req.query.feeStatus) filter.feeStatus = req.query.feeStatus;
        const data = await Applicant.find(filter)
            .populate('program', 'name code courseType')
            .populate('academicYear', 'label')
            .sort('-createdAt');
        res.json(data);
    } catch (e: any) { res.status(500).json({ message: e.message }); }
};

export const getApplicant = async (req: Request, res: Response) => {
    try {
        const doc = await Applicant.findById(req.params.id)
            .populate('program')
            .populate('academicYear');
        if (!doc) return res.status(404).json({ message: 'Applicant not found' });
        res.json(doc);
    } catch (e: any) { res.status(500).json({ message: e.message }); }
};

export const createApplicant = async (req: any, res: Response) => {
    try {
        const data = { ...req.body, createdBy: req.user?.id };
        const doc = await Applicant.create(data);
        res.status(201).json(doc);
    } catch (e: any) { res.status(400).json({ message: e.message }); }
};

export const updateApplicant = async (req: Request, res: Response) => {
    try {
        const doc = await Applicant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(doc);
    } catch (e: any) { res.status(400).json({ message: e.message }); }
};

export const updateDocumentStatus = async (req: Request, res: Response) => {
    try {
        const { docName, status } = req.body;
        const applicant = await Applicant.findById(req.params.id);
        if (!applicant) return res.status(404).json({ message: 'Not found' });
        const doc = applicant.documents.find((d) => d.name === docName);
        if (!doc) return res.status(404).json({ message: 'Document not found' });
        doc.status = status;
        await applicant.save();
        res.json(applicant);
    } catch (e: any) { res.status(400).json({ message: e.message }); }
};

export const updateFeeStatus = async (req: Request, res: Response) => {
    try {
        const applicant = await Applicant.findByIdAndUpdate(
            req.params.id,
            { feeStatus: req.body.feeStatus },
            { new: true }
        );
        res.json(applicant);
    } catch (e: any) { res.status(400).json({ message: e.message }); }
};
