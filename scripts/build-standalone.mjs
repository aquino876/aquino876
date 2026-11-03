import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Package the production build, without duplicating the React application.
// The result runs from file://, including photos, fonts, cart and checkout.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const mime = {
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};
const cache = new Map();
async function dataUrl(url) {
  if (cache.has(url)) return cache.get(url);
  const path = resolve(dist, url.replace(/^\//, ""));
  if (!path.startsWith(`${dist}/`))
    throw new Error(`Asset outside dist: ${url}`);
  const data = `data:${mime[extname(path)] ?? "application/octet-stream"};base64,${(await readFile(path)).toString("base64")}`;
  cache.set(url, data);
  return data;
}
async function replaceAsync(text, regex, replace) {
  const matches = [...text.matchAll(regex)];
  const replacements = await Promise.all(
    matches.map((match) => replace(...match)),
  );
  let index = 0;
  return text.replace(regex, () => replacements[index++]);
}
let html = await readFile(resolve(dist, "index.html"), "utf8");
html = await replaceAsync(
  html,
  /<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g,
  async (_, url) => {
    let code = await readFile(resolve(dist, url.replace(/^\//, "")), "utf8");
    code = await replaceAsync(code, /\/images\/[a-zA-Z0-9_.-]+/g, (url) =>
      dataUrl(url),
    );
    return `<script type="module">${code.replace(/<\/script/gi, "<\\/script")}</script>`;
  },
);
html = await replaceAsync(
  html,
  /<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
  async (_, url) => {
    let css = await readFile(resolve(dist, url.replace(/^\//, "")), "utf8");
    css = await replaceAsync(
      css,
      /url\(["']?(\/assets\/[^)"']+)["']?\)/g,
      async (_, asset) => `url("${await dataUrl(asset)}")`,
    );
    return `<style>${css}</style>`;
  },
);
html = html.replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g, "");
html = html.replace(
  'href="/favicon.svg"',
  `href="${await dataUrl("/favicon.svg")}"`,
);
await mkdir(resolve(root, "artifacts"), { recursive: true });
const output = resolve(root, "artifacts/Burger-House.html");
await writeFile(output, html);
console.log(
  `Interactive standalone preview: ${output} (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB)`,
);
