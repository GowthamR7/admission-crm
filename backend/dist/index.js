"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const error_1 = require("./middleware/error");
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const master_routes_1 = __importDefault(require("./routes/master.routes"));
const seatMatrix_routes_1 = __importDefault(require("./routes/seatMatrix.routes"));
const applicant_routes_1 = __importDefault(require("./routes/applicant.routes"));
const admission_routes_1 = __importDefault(require("./routes/admission.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
dotenv_1.default.config();
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*', credentials: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Health
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'admission-backend' }));
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/master', master_routes_1.default);
app.use('/api/seat-matrix', seatMatrix_routes_1.default);
app.use('/api/applicants', applicant_routes_1.default);
app.use('/api/admission', admission_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use(error_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
exports.default = app;
