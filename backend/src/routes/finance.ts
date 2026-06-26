import { Router } from 'express';
import { prisma } from '../lib/prisma';

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
