/**
 * 🕵️‍♂️ StudVent Super Fingerprint (Hardware DNA)
 * Combines multiple hardware entropy sources into a high-stability hash.
 */

export async function getSuperFingerprint(): Promise<string> {
  const entropy: string[] = [];

  // 1. Canvas Fingerprinting (GPU/Driver unique rendering)
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 200;
      canvas.height = 50;
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("StudVent_DNA_Test", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("StudVent_DNA_Test", 4, 17);
      entropy.push(canvas.toDataURL());
    }
  } catch { /* Fallback */ }

  // 2. Hardware Profiling
  try {
    entropy.push(navigator.hardwareConcurrency?.toString() || '0');
    // @ts-expect-error - deviceMemory is not standard in all browsers
    entropy.push(navigator.deviceMemory?.toString() || '0');
    entropy.push(screen.width + "x" + screen.height + "x" + screen.colorDepth);
    entropy.push(new Date().getTimezoneOffset().toString());
    entropy.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch { /* Fallback */ }

  // 3. WebGL Details
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        entropy.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
        entropy.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
      }
    }
  } catch { /* Fallback */ }

  // 4. Audio Context (Quirks in audio processing)
  try {
    // @ts-expect-error - webkitAudioContext is a vendor prefix
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      const audioCtx = new AudioContextClass();
      entropy.push(audioCtx.sampleRate.toString());
      audioCtx.close();
    }
  } catch { /* Fallback */ }

  // Hash the combined entropy
  const finalStr = entropy.join('||');
  return await hashString(finalStr);
}

async function hashString(str: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
