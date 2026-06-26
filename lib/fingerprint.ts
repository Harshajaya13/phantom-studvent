export async function getFingerprint(): Promise<string> {
  if (typeof window === 'undefined') return 'server';
  
  // ─── CANVAS FINGERPRINTING (The Heavy Hitter) ─────────────────────────
  // We draw a complex shape with text and emojis. Every GPU/Browser 
  // combination renders this slightly differently at the pixel level.
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let canvasHash = '';
  
  if (ctx) {
    canvas.width = 200;
    canvas.height = 50;
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = "#069";
    ctx.fillText("studvent_security_v2_🔐", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("studvent_security_v2_🔐", 4, 17);
    canvasHash = canvas.toDataURL();
  }

  // ─── SYSTEM COMPONENTS ────────────────────────────────────────────────
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency,
    (navigator as unknown as { deviceMemory?: number }).deviceMemory,
    canvasHash // The most important part
  ].join('|');

  // ─── CRYPTOGRAPHIC HASHING ────────────────────────────────────────────
  const encoder = new TextEncoder();
  const data = encoder.encode(components);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}