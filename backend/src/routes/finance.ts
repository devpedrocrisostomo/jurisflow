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
  const entries = await prisma.finance.findMany({ orderBy: { dueDate: 'desc' } });
  res.json(entries);
});

router.post('/', async (req, res) => {
  const f = await prisma.finance.create({ data: req.body });
  res.status(201).json(f);
});

router.put('/:id', async (req, res) => {
  const f = await prisma.finance.update({ where: { id: req.params.id }, data: req.body });
  res.json(f);
});

router.delete('/:id', async (req, res) => {
  await prisma.finance.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
