//SOLO VALIDO EN TYPE MODULE
//Usando commonjs __dirname ya está accesible globalmente
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url)
export const __dirname = join(dirname(__filename) + '../../../')


export const config = {
    dirname: process.cwd() + '/',
    PORT: 3000,
}