/** Shared storageState locations (importable by both setup and specs). */
import path from 'node:path';
import { target } from '../config/env';

export const AUTH_DIR = path.join(process.cwd(), '.auth');
export const customerStatePath = path.join(AUTH_DIR, `customer-${target.name}.json`);
export const adminStatePath = path.join(AUTH_DIR, `admin-${target.name}.json`);
