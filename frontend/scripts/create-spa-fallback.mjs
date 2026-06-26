import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const indexPath = resolve(distDir, 'index.html');
const fallbackPath = resolve(distDir, '404.html');

if (!existsSync(indexPath)) {
  throw new Error('dist/index.html nao encontrado. Execute vite build antes de criar o fallback SPA.');
}

copyFileSync(indexPath, fallbackPath);
console.log('SPA fallback criado em dist/404.html');