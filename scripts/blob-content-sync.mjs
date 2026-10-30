/**
 * Sincroniza el contenido JSON del repo con Vercel Blob (producción).
 *
 *   node scripts/blob-content-sync.mjs list               → lista qué hay en Blob (solo lectura)
 *   node scripts/blob-content-sync.mjs backup <carpeta>   → descarga todo a <carpeta> (solo lectura)
 *   node scripts/blob-content-sync.mjs push <archivo...>  → sube esos JSON del repo y REEMPLAZA lo de Blob
 *
 * Uso previsto: una sola vez, para publicar el contenido del rediseño. Después, lo que se guarde
 * desde el admin vive en Blob y tiene prioridad sobre el repo.
 * Lee BLOB_READ_WRITE_TOKEN de .env.blob (o .env.local).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { get, list, put } from "@vercel/blob";

const PREFIX = "top-rentals/content/";
/* Token en .env.blob (ignorado por git y no usado por el sitio, así el local no escribe en producción) */
function readToken() {
  for (const file of [".env.blob", ".env.local"]) {
    try {
      const value = /^BLOB_READ_WRITE_TOKEN=(.*)$/m
        .exec(readFileSync(file, "utf8"))?.[1]
        ?.trim()
        .replace(/^["']|["']$/g, "");
      if (value) return value;
    } catch {}
  }
  throw new Error("Falta BLOB_READ_WRITE_TOKEN en .env.blob");
}
const token = readToken();

const [command, ...args] = process.argv.slice(2);

async function listContent() {
  const blobs = [];
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, cursor, token });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

if (command === "list") {
  for (const b of await listContent()) {
    console.log(`${b.pathname.slice(PREFIX.length).padEnd(36)} ${String(b.size).padStart(8)} B  ${b.uploadedAt.toISOString()}`);
  }
} else if (command === "backup") {
  const dir = args[0];
  if (!dir) throw new Error("Indicá la carpeta de respaldo");
  mkdirSync(dir, { recursive: true });
  for (const b of await listContent()) {
    const res = await get(b.pathname, { access: "private", token });
    const text = await new Response(res.stream).text();
    const file = path.join(dir, b.pathname.slice(PREFIX.length));
    writeFileSync(file, text, "utf8");
    console.log("respaldado", file);
  }
} else if (command === "push") {
  if (!args.length) throw new Error("Indicá los archivos a subir");
  for (const file of args) {
    const body = JSON.stringify(JSON.parse(readFileSync(file, "utf8")), null, 2) + "\n";
    await put(PREFIX + path.basename(file), body, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      token,
    });
    console.log("subido", path.basename(file));
  }
} else {
  console.log("Uso: list | backup <carpeta> | push <archivo...>");
}
