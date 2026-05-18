/// <reference types="@cloudflare/workers-types" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_URL?: string;
      CF_PAGES?: string; // set to "1" on Cloudflare Pages
    }
  }
}

// Cloudflare D1 binding exposed via getRequestContext() on Cloudflare Pages
export interface CloudflareEnv {
  DB: D1Database;
}
