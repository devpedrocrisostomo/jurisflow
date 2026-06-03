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
  const cases = await prisma.case.findMany({ orderBy: { createdAt: 'desc' }, include: { client: true } });
  res.json(cases);
});

router.post('/', async (req, res) => {
  const { clientId, lawyerId, ...rest } = req.body;
  const data: any = { ...rest };
  if (clientId) data.client = { connect: { id: clientId } };
  if (lawyerId) data.lawyer = { connect: { id: lawyerId } };
  const c = await prisma.case.create({ data });
  res.status(201).json(c);
});

router.put('/:id', async (req, res) => {
  const { clientId, lawyerId, client, lawyer, ...rest } = req.body;
  const data: any = { ...rest };
  if (clientId) data.client = { connect: { id: clientId } };
  const c = await prisma.case.update({ where: { id: req.params.id }, data });
  res.json(c);
});

router.delete('/:id', async (req, res) => {
  await prisma.case.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
