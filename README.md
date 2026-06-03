# JurisFlow - Sistema de Gestão Jurídica

Sistema moderno de controle de processos, clientes, prazos, audiências, financeiro e CRM para escritórios de advocacia.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** + **Vite** + **TypeScript**
- **Tailwind CSS** (Estilização premium escura/glassmorphism)
- **Lucide React** (Ícones)
- **Axios** (Integração com API)

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** + **PostgreSQL** (Hospedado no Supabase)
- **Bcrypt** (Criptografia de senhas)
- **JWT (JSON Web Tokens)** (Autenticação segura)

---

## 🚀 Como Executar o Projeto

### Passo 1: Configurar Banco de Dados
No diretório `backend`, crie um arquivo `.env` com a sua URL de conexão do PostgreSQL.

### Passo 2: Executar o Servidor Backend
```bash
cd backend
npm install
npx prisma db push
npx tsx src/seed.ts  # Popula com dados fictícios para testes
npm run dev
```
*O backend estará rodando na porta `4000`.*

### Passo 3: Executar o Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*O frontend estará rodando na porta `3000`.*

---

## 👥 Credenciais de Teste
- **E-mail:** `admin@jurisflow.com`
- **Senha:** `admin`
