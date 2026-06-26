import 'dotenv/config';
import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import caseRoutes from './routes/cases';
import taskRoutes from './routes/tasks';
import hearingRoutes from './routes/hearings';
import financeRoutes from './routes/finance';
import leadRoutes from './routes/leads';
import dashboardRoutes from './routes/dashboard';
import userRoutes from './routes/users';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/clients', clientRoutes);
app.use('/cases', caseRoutes);
app.use('/tasks', taskRoutes);
app.use('/hearings', hearingRoutes);
app.use('/finance', financeRoutes);
app.use('/leads', leadRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/users', userRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: '1.0.0' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rota nao encontrada' });
});

const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  console.error('Erro nao tratado na API:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
};

app.use(errorHandler);
export default app;
