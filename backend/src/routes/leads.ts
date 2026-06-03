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
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(leads);
});

router.post('/', async (req, res) => {
  const l = await prisma.lead.create({ data: req.body });
  res.status(201).json(l);
});

router.put('/:id', async (req, res) => {
  const l = await prisma.lead.update({ where: { id: req.params.id }, data: req.body });
  res.json(l);
});

router.delete('/:id', async (req, res) => {
  await prisma.lead.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
