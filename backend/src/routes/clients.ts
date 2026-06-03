import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const router = Router();

// GET all clients
router.get('/', async (req, res) => {
  const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(clients);
});

// POST create client
router.post('/', async (req, res) => {
  const data = req.body;
  const client = await prisma.client.create({ data });
  res.status(201).json(client);
});

// PUT update client
router.put('/:id', async (req, res) => {
  const client = await prisma.client.update({ where: { id: req.params.id }, data: req.body });
  res.json(client);
});

// DELETE client
router.delete('/:id', async (req, res) => {
  await prisma.client.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
