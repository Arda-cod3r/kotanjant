import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Next.js 16 ESLint flat config.
 * - `core-web-vitals`: Next.js + React + JSX-a11y + import kuralları (Core Web Vitals odaklı)
 * - `typescript`: TypeScript için tip farkındalıklı kurallar
 * Not: Next.js 16'da `next lint` kaldırıldığından doğrudan `eslint` ile çalışır.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Derleme çıktıları, üretilen kod ve proje dışı iskelet klasörlerini yoksay.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/generated/**", // prisma generate çıktısı (tsconfig'de de hariç)
    "backend/**", // projede kullanılmayan eski iskelet
    "frontend/**", // projede kullanılmayan eski iskelet
  ]),
]);

export default eslintConfig;
