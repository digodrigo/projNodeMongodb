import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// Resolve o .env pelo arquivo, independentemente do terminal de origem.
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });
