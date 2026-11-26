// NusaStat — entri "Make the best national statistics site" (Node 22,
// pustaka standar saja). Situsnya adalah file statis di app/ (HTML, CSS,
// JavaScript, tanpa langkah build, tanpa permintaan jaringan). Program ini
// menyerahkan situs itu: menyalin app/ dan screenshots/ dari samping file ini
// ke /output dan menulis /output/dossier.json, ringkasan yang dibaca juri
// (tangkapan layar, berkas dan byte muatan pertama, serta sumber situs),
// dengan pustaka make.fun yang dibundel. Biarkan vendor/makefun-frontend.ts
// apa adanya: penilai mengharuskan dossier.json sama persis dengan yang
// ditulis salinan pustaka yang sama.
//
// Menjalankan situs secara lokal: `node serve.ts`, lalu buka
// http://localhost:8080. Di luar wadah penilai, MAKEFUN_OUTPUT_DIR menggantikan
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas penilai sendiri (reference/gate.json): hanya text_max_bytes yang
// membentuk byte; sisanya menolak entri yang memang akan ditolak penilai
// (lebih dari 4 tangkapan layar atau satu di atas 256 KiB; lebih dari 993
// berkas dan direktori di app/ atau 16 MiB berkas app/: app/ dihitung di
// samping batas 1000 entri /output sendiri, bersama screenshots/ dan
// dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
