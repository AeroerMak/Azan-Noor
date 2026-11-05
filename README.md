# Azan Noor — نور الأذان

Prayer times, Adhan, Qibla and duas — private by design. No account, no ads, no analytics.

| | |
|---|---|
| Landing page & APK | <https://azannoor.app> |
| Web app (PWA) | <https://app.azannoor.app> |
| Privacy policy | <https://azannoor.app/privacy/> |

## Features

- **Prayer times calculated on the device** with [adhan](https://github.com/batoulapps/adhan-js) (Umm Al-Qura method, Shafi madhab). Aladhan is used only for the Hijri date and Qibla bearing.
- **Native Adhan on Android** — scheduled 10 days ahead with exact alarms, plays even when the app is closed, plus optional reminders before each prayer.
- **Dynamic sky** — the background shifts with each prayer (Fajr dawn → Isha night) with frosted-glass cards.
- **Mobile layout** with bottom tabs (Prayers / Qibla / Duas / Settings); desktop keeps the full dashboard.
- Qibla compass, Ramadan times, duas, installable PWA.

## Tech stack

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · framer-motion · Capacitor 8 (Android) · Cloudflare Pages + D1

## Project layout

```
src/app/            Next.js app (page, layout, api/preferences → D1)
src/components/     UI by feature: clock, prayer, qibla, dua, notifications, ui…
src/hooks/          usePrayerTimes, useNotifications, useTab, useQibla…
src/lib/native/     Capacitor Adhan scheduler (local notifications)
src/data/           Prayer themes, duas
android/            Capacitor Android project (app id: app.azannoor)
assets/             Source images for app icons and splash
landing/            Static landing site (azannoor.app) — HTML/CSS/JS
scripts/            build-mobile.mjs, release-android.mjs
cloudflare/         D1 schema
```

## Development

```bash
npm install
npm run dev          # http://localhost:3000
```

Useful query params: `?vibe=Fajr|Dhuhr|Asr|Maghrib|Isha` previews a sky theme, `?tab=qibla` opens a tab.

## Deploy

### Web app → `app.azannoor.app` (Pages project `azan-noor`)

Stop the dev server first (it shares `.next`). On Windows, run the build steps separately — `next-on-pages` can't spawn `npx` itself:

```bash
rm -rf .next .vercel/output
npx -y vercel@41 build
npx @cloudflare/next-on-pages --skip-build
npx -y wrangler@3 pages deploy .vercel/output/static --project-name azan-noor --branch main --commit-dirty=true
```

### Landing page → `azannoor.app` (Pages project `azannoor-landing`)

```bash
npm run landing:deploy
```

## Android

Requirements: Android Studio (its bundled JBR is used as `JAVA_HOME`), Android SDK, and `android/local.properties` with `sdk.dir=...`. Gradle downloads JDK 21 automatically via the foojay toolchain resolver.

```bash
npm run build:mobile     # static export (MOBILE_BUILD=1) + cap sync
npm run android:open     # open in Android Studio
```

`build:mobile` temporarily moves `src/app/api` to `.api-parked` (API routes can't be statically exported) and restores it afterwards. **Don't commit while it's running.**

### Release

1. Bump `versionCode` and `versionName` in `android/app/build.gradle`.
2. Run:
   ```bash
   npm run release:android
   ```
   This builds a signed APK and publishes it into `landing/`:
   - `landing/download/azan-noor-<version>.apk` (git-ignored)
   - `landing/version.json` (version, size, URL)
   - `landing/_redirects` — `/download/azan-noor.apk` always points to the latest
3. `npm run landing:deploy`

Signing reads `~/.azannoor-signing/keystore.properties` (or the path in `AZANNOOR_KEYSTORE_PROPERTIES`). The keystore is **not** in the repo — keep an off-machine backup; without it, updates can't be signed.

## Roadmap

- Show times in the selected location's timezone
- In-app update check via `version.json`
- Google Play release
- iOS build
- Calculation method setting
