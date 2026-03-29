import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/error';

// Routes
import authRoutes from './routes/auth.routes';
import masterRoutes from './routes/master.routes';
import seatMatrixRoutes from './routes/seatMatrix.routes';
import applicantRoutes from './routes/applicant.routes';
import admissionRoutes from './routes/admission.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'admission-backend' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/seat-matrix', seatMatrixRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));

export default app;
