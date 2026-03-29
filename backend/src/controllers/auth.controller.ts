import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const signToken = (id: string, role: string) =>
    jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    } as jwt.SignOptions);

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered' });
        const user = await User.create({ name, email, password, role });
        const token = signToken(String(user._id), user.role);
        res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ message: 'Invalid credentials' });
        const token = signToken(String(user._id), user.role);
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
