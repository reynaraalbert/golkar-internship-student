/**
 * Minimal server-side HTML sanitisation for user-submitted article content.
 *
 * The public news UI renders content as plain text (`whitespace-pre-line`), so
 * the safest policy is to strip markup entirely. This also protects any future
 * renderer that might use `dangerouslySetInnerHTML`.
 */
export function stripHtml(input: string): string {
  return input
    // Remove script/style blocks including their contents.
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
    // Remove every remaining tag.
    .replace(/<\/?[^>]+>/g, "")
    // Neutralise javascript: URLs left in plain text.
    .replace(/javascript\s*:/gi, "")
    .replace(/data:text\/html/gi, "")
    // Strip control characters except newline/tab.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

export function sanitizeText(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return stripHtml(input).slice(0, maxLength);
}

export function isSafeHttpUrl(input: unknown): input is string {
  if (typeof input !== "string" || !input.trim()) return false;
  try {
    const url = new URL(input.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
