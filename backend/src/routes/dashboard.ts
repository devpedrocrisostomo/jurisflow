import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const router = Router();

router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // 1. Processos Ativos
    const activeCases = await prisma.case.count({
      where: { status: 'ATIVO' }
    });

    // 2. Audiências na Semana
    const weeklyHearings = await prisma.hearing.count({
      where: {
        date: {
          gte: startOfWeek,
          lte: endOfWeek
        }
      }
    });

    // 3. Prazos Vencendo (Tarefas pendentes ou em andamento e não concluídas)
    const pendingTasks = await prisma.task.count({
      where: {
        status: { in: ['PENDENTE', 'EM_ANDAMENTO', 'ATRASADO'] }
      }
    });

    // 4. Clientes Totais
    const totalClients = await prisma.client.count();

    // 5. Honorários Pendentes (Finance RECEITA PENDENTE)
    const pendingFinance = await prisma.finance.aggregate({
      where: {
        type: 'RECEITA',
        status: 'PENDENTE'
      },
      _sum: {
        amount: true
      }
    });
    const pendingHonoraries = pendingFinance._sum.amount || 0;

    // 6. Leads no Funil (não fechados ou perdidos)
    const funnelLeads = await prisma.lead.count({
      where: {
        status: { in: ['LEAD', 'CONTATO_REALIZADO', 'REUNIAO_MARCADA', 'PROPOSTA_ENVIADA'] }
      }
    });

    // Recent Activities
    const recentClients = await prisma.client.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' }
    });

    const recentCases = await prisma.case.findMany({
      take: 2,
      orderBy: { updatedAt: 'desc' }
    });

    const recentTasks = await prisma.task.findMany({
      take: 2,
      orderBy: { updatedAt: 'desc' }
    });

    const activities = [
      ...recentClients.map(c => ({
        type: 'CLIENT',
        text: `Cliente "${c.name}" foi cadastrado`,
        time: c.createdAt
      })),
      ...recentCases.map(c => ({
        type: 'CASE',
        text: `Processo nº ${c.caseNumber} atualizado`,
        time: c.updatedAt
      })),
      ...recentTasks.map(t => ({
        type: 'TASK',
        text: `Prazo "${t.title}" atualizado`,
        time: t.updatedAt
      }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 4);

    res.json({
      activeCases,
      weeklyHearings,
      pendingTasks,
      totalClients,
      pendingHonoraries,
      funnelLeads,
      activities
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao carregar estatísticas do dashboard' });
  }
});

export default router;
