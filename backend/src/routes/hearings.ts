import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  const hearings = await prisma.hearing.findMany({ orderBy: { date: 'asc' } });
  res.json(hearings);
});

router.post('/', async (req, res) => {
  const { caseId, assigneeId, ...rest } = req.body;
  const data: any = { ...rest };
  if (caseId) data.case = { connect: { id: caseId } };
  if (assigneeId) data.assignee = { connect: { id: assigneeId } };
  const h = await prisma.hearing.create({ data });
  res.status(201).json(h);
});

router.put('/:id', async (req, res) => {
  const { caseId, assigneeId, case: _c, assignee, ...rest } = req.body;
  const data: any = { ...rest };
  if (caseId) data.case = { connect: { id: caseId } };
  const h = await prisma.hearing.update({ where: { id: req.params.id }, data });
  res.json(h);
});

router.delete('/:id', async (req, res) => {
  await prisma.hearing.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
