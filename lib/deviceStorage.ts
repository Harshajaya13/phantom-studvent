export function getDeviceHash() {
  if (typeof window === 'undefined') return '';
  let hash = localStorage.getItem('sv_device_hash');
  if (!hash) {
    hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('sv_device_hash', hash);
  }
  return hash;
}

export function toggleStarVent(ventId: string) {
  if (typeof window === 'undefined') return false;
  let stars = JSON.parse(localStorage.getItem('sv_stars') || '[]');
  const isStarred = stars.includes(ventId);
  if (isStarred) {
    stars = stars.filter((id: string) => id !== ventId);
  } else {
    stars.push(ventId);
  }
  localStorage.setItem('sv_stars', JSON.stringify(stars));
  return !isStarred;
}

export function isVentStarred(ventId: string) {
  if (typeof window === 'undefined') return false;
  const stars = JSON.parse(localStorage.getItem('sv_stars') || '[]');
  return stars.includes(ventId);
}
