/**
 * StudVent Moderation Database
 * A comprehensive list of restricted terms for the Indian student community.
 */

export const BANNED_WORDS = [
  // Global Profanity
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'pussy', 'cunt', 'whore', 'slut',
  'motherfucker', 'bullshit', 'cocksucker', 'wanker', 'twat', 'faggot',
  
  // Hinglish / Indian Slang
  'chutiya', 'madarchod', 'bhenchod', 'bhosdike', 'gaand', 'lund', 'randi', 'saala', 'kamine',
  'haramkhor', 'bakchod', 'gandu', 'jhaant', 'lavde', 'lowde', 'mc', 'bc', 'm.c', 'b.c',
  'bsdk', 'b.s.d.k', 'behenchod', 'maderchod', 'maatherchod', 'betichod', 'chipkali',
  
  // Hate Speech / Harassment
  'nigger', 'nigga', 'retard', 'rape', 'kill yourself', 'kys', 'go die', 'neck yourself',
  'terrorist', 'paki', 'bangladeshi', 'katuya', 'mulla'
];

export const COLLEGE_NAMES = [
  // National / Affiliating Bodies
  'aicte', 'ugc', 'jntu', 'vtu', 'aktu', 'gtu', 'annauniversity',
  // Top Tier Acronyms (Only keep the absolute essentials)
  'iit', 'nit', 'iiit', 'bits',
  // Local / Regional (Relaxed to allow broad discussion)
  'anits', 'gvp', 'gitam'
];

export const FACULTY_TITLES = [
  'prof', 'dr', 'hod', 'sir', 'madam', 'principal', 'dean', 'director', 'warden',
  'lecturer', 'assistant professor', 'associate professor', 'instructor', 'registrar'
];

/**
 * Normalizes text for better matching.
 */
export function normalizeForModeration(text: string): string {
  return text
    .toLowerCase()
    .replace(/[0o]/g, 'o')
    .replace(/[1i!l]/g, 'i')
    .replace(/[3e]/g, 'e')
    .replace(/[4a@]/g, 'a')
    .replace(/[5s$]/g, 's')
    .replace(/[7t]/g, 't')
    .replace(/[8b]/g, 'b');
}

/**
 * Advanced pattern matcher that catches AICTE/UGC college naming structures.
 */
export function detectInstitutionalNaming(text: string): boolean {
  const normalized = text.toLowerCase();
  
  const patterns = [
    /institute\s*of\s*technology/i,
    /college\s*of\s*engineering/i,
    // Removed generic 'university' and 'engineering college' to allow more freedom
    /academy\s*of\s*technical/i,
    /medical\s*college/i,
  ];

  return patterns.some(pattern => pattern.test(normalized));
}
