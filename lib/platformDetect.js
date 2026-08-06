// Detects a known platform from a raw URL string.
// Returns a label that maps to an icon in components/PlatformIcon.jsx

const PATTERNS = [
  { key: "Instagram", test: /instagram\.com/i },
  { key: "Facebook", test: /(facebook\.com|fb\.me)/i },
  { key: "TikTok", test: /tiktok\.com/i },
  { key: "LinkedIn", test: /linkedin\.com/i },
  { key: "YouTube", test: /(youtube\.com|youtu\.be)/i },
  { key: "Twitter", test: /(twitter\.com|x\.com)/i },
  { key: "WhatsApp", test: /(wa\.me|whatsapp\.com)/i },
  { key: "Telegram", test: /(t\.me|telegram\.me)/i },
  { key: "Behance", test: /behance\.net/i },
  { key: "Dribbble", test: /dribbble\.com/i },
  { key: "GitHub", test: /github\.com/i },
  { key: "Pinterest", test: /pinterest\./i },
  { key: "Snapchat", test: /snapchat\.com/i },
  { key: "Email", test: /^mailto:/i },
  { key: "Phone", test: /^tel:/i },
];

export function detectPlatform(rawUrl = "") {
  const url = rawUrl.trim();
  if (!url) return "Website";
  for (const { key, test } of PATTERNS) {
    if (test.test(url)) return key;
  }
  return "Website";
}

// Ensures a URL has a protocol so it's a valid clickable link / QR target.
export function normalizeUrl(rawUrl = "") {
  const url = rawUrl.trim();
  if (!url) return url;
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  return `https://${url}`;
}
