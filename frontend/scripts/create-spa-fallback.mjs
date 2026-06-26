import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const indexPath = resolve(distDir, 'index.html');
const fallbackPath = resolve(distDir, '404.html');
const appRoutes = [
  'login',
  'dashboard',
  'clientes',
  'processos',
  'prazos',
  'audiencias',
  'documentos',
  'financeiro',
  'crm',
  'relatorios',
  'equipe',
  'configuracoes',
];

if (!existsSync(indexPath)) {
  throw new Error('dist/index.html nao encontrado. Execute vite build antes de criar os fallbacks SPA.');
}

copyFileSync(indexPath, fallbackPath);

for (const route of appRoutes) {
  const routeDir = resolve(distDir, route);
  mkdirSync(routeDir, { recursive: true });
  copyFileSync(indexPath, resolve(routeDir, 'index.html'));
}

console.log(`Fallbacks SPA criados para ${appRoutes.length} rotas e dist/404.html`);