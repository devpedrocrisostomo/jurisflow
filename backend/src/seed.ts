import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando o seeding com dados fictícios...');

  // 1. Criar ou obter usuário Admin
  const email = 'admin@jurisflow.com';
  let admin = await prisma.user.findUnique({ where: { email } });
  
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin', 10);
    admin = await prisma.user.create({
      data: {
        name: 'Dr. Roberto Silva (Admin)',
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Usuário admin criado (admin@jurisflow.com / admin)');
  } else {
    console.log('Usuário admin já existente.');
  }

  // Limpar tabelas dependentes antes para evitar conflitos, mas sem apagar o admin
  await prisma.hearing.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.case.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.finance.deleteMany({});
  await prisma.lead.deleteMany({});

  console.log('Tabelas limpas com sucesso.');

  // 2. Criar Clientes Fictícios (PF e PJ)
  const client1 = await prisma.client.create({
    data: {
      type: 'PF',
      name: 'Carlos Eduardo Santos',
      document: '123.456.789-00',
      email: 'carlos.eduardo@gmail.com',
      phone: '(11) 98765-4321',
      address: 'Av. Paulista, 1000 - São Paulo/SP',
      notes: 'Cliente preferencial, contato preferencialmente por e-mail.',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      type: 'PJ',
      name: 'Indústria Metálica Alpha Ltda',
      document: '12.345.678/0001-99',
      email: 'juridico@metalalpha.com.br',
      phone: '(11) 3344-5566',
      address: 'Rua das Indústrias, 450 - São Bernardo do Campo/SP',
      notes: 'Contrato mensal de assessoria jurídica trabalhista e empresarial.',
    },
  });

  const client3 = await prisma.client.create({
    data: {
      type: 'PF',
      name: 'Mariana Costa Ferreira',
      document: '987.654.321-11',
      email: 'mariana.ferreira@hotmail.com',
      phone: '(21) 99888-7777',
      address: 'Rua Copacabana, 200 - Rio de Janeiro/RJ',
      notes: 'Indicação do Dr. Marcos. Ação de divórcio e partilha de bens.',
    },
  });

  console.log('Clientes criados.');

  // 3. Criar Processos (Cases) fictícios vinculados aos clientes
  const case1 = await prisma.case.create({
    data: {
      caseNumber: '1002456-88.2025.8.26.0100',
      court: 'TJSP - Tribunal de Justiça de São Paulo',
      jurisdiction: '4ª Vara Cível do Foro Central Cível',
      caseClass: 'Procedimento Comum Cível',
      legalArea: 'Cível',
      status: 'ATIVO',
      opposingParty: 'Banco Nacional S/A',
      notes: 'Ação revisional de contrato de financiamento imobiliário. Aguardando perícia técnica.',
      clientId: client1.id,
      lawyerId: admin.id,
    },
  });

  const case2 = await prisma.case.create({
    data: {
      caseNumber: '0010452-12.2025.5.02.0002',
      court: 'TRT-2 - Tribunal Regional do Trabalho',
      jurisdiction: '2ª Vara do Trabalho de São Bernardo do Campo',
      caseClass: 'Reclamação Trabalhista',
      legalArea: 'Trabalhista',
      status: 'ATIVO',
      opposingParty: 'João da Silva Santos (Ex-funcionário)',
      notes: 'Defesa da reclamada indústria Alpha. Contestação apresentada. Audiência de instrução agendada.',
      clientId: client2.id,
      lawyerId: admin.id,
    },
  });

  const case3 = await prisma.case.create({
    data: {
      caseNumber: '5003441-92.2024.4.03.6100',
      court: 'JFSP - Justiça Federal de São Paulo',
      jurisdiction: '12ª Vara Federal Execuções Fiscais',
      caseClass: 'Execução Fiscal',
      legalArea: 'Tributário',
      status: 'SUSPENSO',
      opposingParty: 'União Federal (Fazenda Nacional)',
      notes: 'Discussão sobre cobrança de PIS/COFINS. Processo suspenso por decisão liminar em Mandado de Segurança.',
      clientId: client2.id,
      lawyerId: admin.id,
    },
  });

  console.log('Processos criados.');

  // 4. Criar Prazos / Tarefas (Tasks)
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  await prisma.task.create({
    data: {
      title: 'Apresentar Réplica à Contestação',
      description: 'Elaborar réplica refutando as alegações do Banco Nacional sobre as taxas de juros abusivas.',
      dueDate: nextWeek,
      priority: 'ALTA',
      status: 'PENDENTE',
      caseId: case1.id,
      assigneeId: admin.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Protocolar Manifestação sobre Laudo Pericial',
      description: 'Analisar o laudo do perito judicial e manifestar concordância/impugnação.',
      dueDate: nextMonth,
      priority: 'MEDIA',
      status: 'EM_ANDAMENTO',
      caseId: case1.id,
      assigneeId: admin.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Preparar Testemunhas para Audiência',
      description: 'Fazer reunião prévia com o gerente de produção e o supervisor de RH da Metal Alpha.',
      dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      priority: 'ALTA',
      status: 'PENDENTE',
      caseId: case2.id,
      assigneeId: admin.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Juntar Guia de Custas Iniciais',
      description: 'Solicitar emissão e comprovação de pagamento ao departamento financeiro.',
      dueDate: yesterday,
      priority: 'BAIXA',
      status: 'ATRASADO',
      caseId: case3.id,
      assigneeId: admin.id,
    },
  });

  console.log('Prazos/Tarefas criados.');

  // 5. Criar Audiências (Hearings)
  await prisma.hearing.create({
    data: {
      date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // Em 5 dias
      type: 'Instrução e Julgamento',
      court: 'Sala 03 - 2ª Vara do Trabalho de SBC',
      notes: 'Audiência presencial. Levar testemunhas e relatórios de ponto.',
      caseId: case2.id,
      assigneeId: admin.id,
    },
  });

  await prisma.hearing.create({
    data: {
      date: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000), // Em 15 dias
      type: 'Conciliação',
      court: 'CEJUSC Foro Central - Virtual (Teams)',
      notes: 'Audiência de conciliação por videoconferência. Link será enviado na véspera.',
      caseId: case1.id,
      assigneeId: admin.id,
    },
  });

  console.log('Audiências criadas.');

  // 6. Criar Financeiro (Finance)
  await prisma.finance.create({
    data: {
      type: 'RECEITA',
      category: 'HONORARIOS',
      amount: 4500.00,
      dueDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // Pago há 2 dias
      status: 'PAGO',
      notes: 'Honorários contratuais - Ação Carlos Eduardo.',
    },
  });

  await prisma.finance.create({
    data: {
      type: 'RECEITA',
      category: 'HONORARIOS',
      amount: 8000.00,
      dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
      status: 'PENDENTE',
      notes: 'Mensalidade Assessoria Jurídica - Indústria Alpha.',
    },
  });

  await prisma.finance.create({
    data: {
      type: 'DESPESA',
      category: 'CUSTAS',
      amount: 320.50,
      dueDate: yesterday,
      status: 'PAGO',
      notes: 'Taxa judiciária de distribuição - Tribunal de Justiça.',
    },
  });

  await prisma.finance.create({
    data: {
      type: 'DESPESA',
      category: 'ALUGUEL',
      amount: 2500.00,
      dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      status: 'PENDENTE',
      notes: 'Aluguel mensal da sala comercial (Escritório).',
    },
  });

  console.log('Financeiro criado.');

  // 7. Criar Leads/CRM (Leads)
  await prisma.lead.create({
    data: {
      name: 'Roberto de Almeida Prado',
      contact: '(11) 99122-3344 - roberto.prado@outlook.com',
      status: 'LEAD',
      notes: 'Entrou em contato pelo site buscando assessoria para inventário familiar.',
    },
  });

  await prisma.lead.create({
    data: {
      name: 'Clínica Médica Bem-Estar Ltda',
      contact: 'Dra. Sandra (11) 3214-5555',
      status: 'REUNIAO_MARCADA',
      notes: 'Reunião agendada para quarta-feira às 14h para apresentar proposta de governança corporativa.',
    },
  });

  await prisma.lead.create({
    data: {
      name: 'Francisco Assis Silva',
      contact: '(21) 97755-6622',
      status: 'PROPOSTA_ENVIADA',
      notes: 'Proposta de R$ 15.000,00 enviada para ação rescisória. Aguardando feedback.',
    },
  });

  await prisma.lead.create({
    data: {
      name: 'Gisele Alves Martins',
      contact: 'gisele@gmail.com',
      status: 'FECHADO',
      notes: 'Fechou contrato para planejamento previdenciário e aposentadoria especial.',
    },
  });

  console.log('Leads/CRM criados.');
  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao realizar o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
