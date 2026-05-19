const ALLOWED_DOMAINS = new Set(["link.cuhk.edu.hk", "cuhk.edu.hk"]);

export function isAllowedEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at <= 0 || at !== normalized.indexOf("@")) return false;
  const domain = normalized.slice(at + 1);
  return ALLOWED_DOMAINS.has(domain);
}
