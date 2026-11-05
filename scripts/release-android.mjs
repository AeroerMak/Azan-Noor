// Build the signed release APK and publish it into the landing page:
//   landing/download/azan-noor-<version>.apk, a stable /download/azan-noor.apk
//   redirect, and landing/version.json (read by the landing page and, later, the app).
import { execSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const gradle = readFileSync('android/app/build.gradle', 'utf8');
const version = gradle.match(/versionName "([^"]+)"/)[1];
const versionCode = Number(gradle.match(/versionCode (\d+)/)[1]);

const javaHome = process.env.JAVA_HOME ?? 'C:/Program Files/Android/Android Studio/jbr';
const keystore = process.env.AZANNOOR_KEYSTORE_PROPERTIES ?? join(homedir(), '.azannoor-signing', 'keystore.properties');
statSync(keystore); // fail early: a release must be signed with the release key

execSync('node scripts/build-mobile.mjs', { stdio: 'inherit' });
execSync(process.platform === 'win32' ? '.\\gradlew.bat assembleRelease' : './gradlew assembleRelease', {
  cwd: 'android',
  stdio: 'inherit',
  env: { ...process.env, JAVA_HOME: javaHome },
});

const file = `azan-noor-${version}.apk`;
mkdirSync('landing/download', { recursive: true });
copyFileSync('android/app/build/outputs/apk/release/app-release.apk', `landing/download/${file}`);
const size = statSync(`landing/download/${file}`).size;

writeFileSync('landing/version.json', JSON.stringify({
  android: { version, versionCode, url: `/download/${file}`, size },
}, null, 2) + '\n');
writeFileSync('landing/_redirects', `/download/azan-noor.apk /download/${file} 302\n`);

console.log(`\nPublished ${file} (${(size / 1e6).toFixed(1)} MB) into landing/`);
