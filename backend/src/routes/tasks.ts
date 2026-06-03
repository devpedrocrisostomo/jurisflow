import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const router = Router();

router.get('/', async (req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { dueDate: 'asc' } });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { caseId, assigneeId, ...rest } = req.body;
  const data: any = { ...rest };
  if (caseId) data.case = { connect: { id: caseId } };
  if (assigneeId) data.assignee = { connect: { id: assigneeId } };
  const t = await prisma.task.create({ data });
  res.status(201).json(t);
});

router.put('/:id', async (req, res) => {
  const { caseId, assigneeId, case: _case, assignee, ...rest } = req.body;
  const data: any = { ...rest };
  if (caseId) data.case = { connect: { id: caseId } };
  const t = await prisma.task.update({ where: { id: req.params.id }, data });
  res.json(t);
});

router.delete('/:id', async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
