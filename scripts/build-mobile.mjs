// Static export of the web app for Capacitor, then copy it into the native projects.
import { execSync } from 'node:child_process';

const run = (cmd) => execSync(cmd, { stdio: 'inherit', env: { ...process.env, MOBILE_BUILD: '1' } });

run('npx next build');
run('npx cap sync');
