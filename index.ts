// Dev server for the Provenance HVAC presentation.
// Run: bun --hot index.ts
//
// Routes:
//   /        → React app (HVAC analogy presentation)
//   /audit   → static forensic page (preserves Tuesday-morning artifact)
//
// Production deploy is via wrangler — this file is dev-only.

import index from "./index.html";

const auditHtml = await Bun.file("./site/index.html").text();

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    "/audit": new Response(auditHtml, {
      headers: { "content-type": "text/html; charset=utf-8" },
    }),
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`Provenance HVAC presentation → http://localhost:${server.port}`);
console.log(`Forensic audit surface       → http://localhost:${server.port}/audit`);
