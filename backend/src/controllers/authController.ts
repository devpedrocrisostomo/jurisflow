import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
       res.status(400).json({ error: 'Usuário já existe' });
       return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'ADVOGADO',
      },
    });

    res.status(201).json({ message: 'Usuário criado com sucesso', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('Login falhou: Usuário não encontrado');
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('Login falhou: Senha incorreta');
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1d',
    });
    
    console.log('Login bem-sucedido para:', user.email);

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Erro geral no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login: ' + String(error) });
  }
};
