import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { Role, SessionUser } from "./types";

const COOKIE_NAME = "kotanjant_session";
const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "kotanjant-dev-secret-degistir",
);
const SESSION_TTL = Number(process.env.AUTH_SESSION_TTL ?? 604800); // saniye

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Oturumu imzalar ve httpOnly cookie olarak yazar. */
export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_TTL)
    .sign(SECRET);

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

/** Cookie'deki imzalı oturumu çözer; geçersizse null döner. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export function isAdminUser(user: SessionUser | null): boolean {
  return !!user && (user.role === "ADMIN" || user.role === "SUPERADMIN");
}

/** Yönetim uçları için: yetkisizse null döner (çağıran 401/403 döndürmeli). */
export async function requireAdmin(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  return isAdminUser(user) ? user : null;
}

export { COOKIE_NAME };
