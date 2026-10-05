import "dotenv/config";
import { defineConfig } from "prisma/config";

// Not: Prisma'nın `env("DATABASE_URL")` yardımcısı, değişken tanımlı değilse
// `PrismaConfigEnvError` fırlatır ve Vercel build adımında (`prisma generate`)
// dağıtımı durdurur. `prisma generate` bir veritabanı bağlantısı kurmadığı için
// eksik değer burada güvenle tolere edilir; gerçek bağlantı dizesi çalışma
// zamanında (runtime) ortam değişkeninden okunur. DATABASE_URL tanımlıysa
// aynen onunla kullanılır.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});

