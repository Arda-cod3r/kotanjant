// Markalı SVG placeholder üretici.
// Gerçek ürün/hero görselleri yüklenene kadar kırık görsel olmaması için
// public/images/ altına deterministik SVG'ler üretir.
// Kullanım: node scripts/generate-placeholders.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "images");
await mkdir(outDir, { recursive: true });

const THEMES = [
  ["#0b1220", "#1e293b", "#f97316"],
  ["#111827", "#374151", "#ef4444"],
  ["#0f172a", "#1f2a44", "#38bdf8"],
  ["#0c0a09", "#292524", "#f59e0b"],
  ["#0b1220", "#172554", "#22d3ee"],
  ["#111827", "#3f3f46", "#a3e635"],
  ["#0f172a", "#312e81", "#c084fc"],
  ["#0c0a09", "#3f3f46", "#fb7185"],
];

function wheelSvg({ w = 1000, h = 1000, from, to, accent, label, sub }) {
  const cx = w / 2;
  const cy = h / 2 - 40;
  const r = Math.min(w, h) * 0.3;
  const spokes = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * (r - 40)}" y2="${cy + Math.sin(a) * (r - 40)}" stroke="${accent}" stroke-width="${r * 0.09}" stroke-linecap="round" opacity="0.9"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 1.7}" fill="url(#glow)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0a0f1a" stroke="#475569" stroke-width="${r * 0.06}"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="#111827"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="none" stroke="${accent}" stroke-width="${r * 0.05}"/>
  <g>${spokes}</g>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.26}" fill="#1f2937" stroke="${accent}" stroke-width="${r * 0.05}"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.1}" fill="${accent}"/>
  <text x="${w / 2}" y="${h - 96}" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="${w * 0.052}" font-weight="700" fill="#f8fafc">${label}</text>
  ${sub ? `<text x="${w / 2}" y="${h - 48}" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="${w * 0.03}" fill="#94a3b8">${sub}</text>` : ""}
</svg>`;
}

function heroSvg({ label, sub, from, to, accent, index }) {
  const w = 1600;
  const h = 640;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="h" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="hg" cx="0.78" cy="0.5" r="0.6">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.5"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#h)"/>
  <rect width="${w}" height="${h}" fill="url(#hg)"/>
  <g transform="translate(${w * 0.68} ${h * 0.5})" opacity="0.95">
    <circle r="220" fill="#0a0f1a" stroke="#475569" stroke-width="10"/>
    <circle r="160" fill="#111827"/>
    <circle r="160" fill="none" stroke="${accent}" stroke-width="12"/>
    ${Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return `<line x1="0" y1="0" x2="${Math.cos(a) * 150}" y2="${Math.sin(a) * 150}" stroke="${accent}" stroke-width="14" stroke-linecap="round"/>`;
    }).join("")}
    <circle r="52" fill="#1f2937" stroke="${accent}" stroke-width="10"/>
  </g>
  <text x="90" y="${h / 2 - 40}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="34" letter-spacing="8" fill="${accent}">KOTANJANT</text>
  <text x="90" y="${h / 2 + 40}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="${index === 0 ? 74 : 62}" font-weight="800" fill="#f8fafc">${label}</text>
  <text x="90" y="${h / 2 + 110}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="28" fill="#cbd5e1">${sub}</text>
</svg>`;
}

const PRODUCTS = [
  ['Krom Jant Kapagı 15"', "4'lü Set · Çelik Taban"],
  ['Sportif Jant Kapagı 16"', "Parçalı Tasarım"],
  ['Mat Siyah Jant Kapagı 14"', "ABS · Darbe Dayanımlı"],
  ['Karbon Desen Kapak 17"', "UV Korumalı"],
  ['Orijinal Tip Kapak 13"', "Kolay Montaj"],
  ['Parlak Gümüş Kapak 15"', "Paslanmaz Klipsli"],
  ['Off-Road Jant Kapagı 16"', "SUV Uyumlu"],
  ['Kışlık Dayanıklı Kapak 14"', "Soğuğa Dirençli"],
  ['Ayna Kaplamalı Kapak 17"', "Premium Yüzey"],
  ['Klasik Krom Kapak 15"', "Retro Seri"],
  ['Kompakt Kapak 13"', "Şehir İçi Kullanım"],
  ['Performans Kapak 18"', "Düşük Rüzgar Direnci"],
];

const BLOG = [
  ["Doğru Jant Kapagı Nasıl Seçilir?", "Ölçü Rehberi"],
  ["Jant Kapagı Bakımı ve Temizliği", "5 Pratik İpucu"],
  ["Kış Öncesi Jant Kontrolü", "Bakım Rehberi"],
];

for (let i = 0; i < PRODUCTS.length; i++) {
  const [t1, t2, t3] = THEMES[i % THEMES.length];
  await writeFile(
    join(outDir, `product-${i + 1}.svg`),
    wheelSvg({ from: t1, to: t2, accent: t3, label: PRODUCTS[i][0], sub: PRODUCTS[i][1] }),
  );
}

const HEROES = [
  ["Yeni Sezon Jant Kapakları", "Aracınıza değer katan premium kapaklar", 0],
  ["Fırsat Ürünlerinde %40 İndirim", "Seçili jant kapakları ve aksesuarlarda", 1],
  ["Kışa Hazır Aksesuar Seti", "Silecek, paspas ve jant koruma", 2],
];
for (let i = 0; i < HEROES.length; i++) {
  const [t1, t2, t3] = THEMES[(i * 3) % THEMES.length];
  await writeFile(
    join(outDir, `hero-${i + 1}.svg`),
    heroSvg({ label: HEROES[i][0], sub: HEROES[i][1], from: t1, to: t2, accent: t3, index: i }),
  );
}

for (let i = 0; i < BLOG.length; i++) {
  const [t1, t2, t3] = THEMES[(i * 5 + 2) % THEMES.length];
  await writeFile(
    join(outDir, `blog-${i + 1}.svg`),
    wheelSvg({ w: 1200, h: 800, from: t1, to: t2, accent: t3, label: BLOG[i][0], sub: BLOG[i][1] }),
  );
}

console.log(
  `Üretildi: ${PRODUCTS.length} ürün, ${HEROES.length} hero, ${BLOG.length} blog görseli -> public/images`,
);
