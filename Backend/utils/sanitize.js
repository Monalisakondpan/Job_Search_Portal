// Backend/utils/sanitize.js

// Trim a string. If value is not a string (e.g. an injected object), return empty.
export const cleanString = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

// Escape HTML so user text can't inject markup into emails (HTML injection).
export const escapeHtml = (value) => {
  if (typeof value !== "string") return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// True only if value is a non-empty plain string (not an object/array).
// This is the NoSQL-injection guard.
export const isPlainString = (value) =>
  typeof value === "string" && value.length > 0;