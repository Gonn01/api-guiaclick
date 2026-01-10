export const Roles = Object.freeze({
  USER: 0,
  ADMIN: 1,
});

export function normalizeRole(role) {
  if (role === null || role === undefined) return null;

  // Common shapes: "0"/"1", 0/1
  const n = Number(role);
  if (Number.isFinite(n)) return n;

  // Fallbacks if someone ever stored strings
  const s = String(role).toLowerCase();
  if (s === "admin") return Roles.ADMIN;
  if (s === "user") return Roles.USER;

  return null;
}

export function roleLabel(role) {
  const r = normalizeRole(role);
  return r === Roles.ADMIN ? "Admin" : "User";
}
