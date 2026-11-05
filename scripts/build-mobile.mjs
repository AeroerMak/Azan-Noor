// Static export of the web app for Capacitor, then copy it into the native projects.
// API routes can't be statically exported (and the app doesn't use them), so
// src/app/api is moved aside during the build and always restored afterwards.
import { execSync } from 'node:child_process';
import { existsSync, renameSync, rmSync } from 'node:fs';

const API_DIR = 'src/app/api';
const PARKED = '.api-parked';

const run = (cmd) => execSync(cmd, { stdio: 'inherit', env: { ...process.env, MOBILE_BUILD: '1' } });

if (existsSync(PARKED)) throw new Error(`${PARKED} exists — restore it to ${API_DIR} first`);

renameSync(API_DIR, PARKED);
try {
  rmSync('.next', { recursive: true, force: true });
  run('npx next build');
} finally {
  renameSync(PARKED, API_DIR);
  // Leave no export-mode build output behind for the web build
  rmSync('.next', { recursive: true, force: true });
}

run('npx cap sync');
