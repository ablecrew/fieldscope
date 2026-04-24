// src/utils/auth.ts

const USER_KEY = "user";
const TOKEN_KEY = "token";

// ── Get stored user ─────────────────────────────
export function getStoredUser<T = any>(): T | null {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    return null;
  }
}

// ── Store user ──────────────────────────────────
export function setStoredUser(user: any) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store user:", error);
  }
}

// ── Get token ───────────────────────────────────
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// ── Store token ─────────────────────────────────
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

// ── Clear stored auth ───────────────────────────
export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}