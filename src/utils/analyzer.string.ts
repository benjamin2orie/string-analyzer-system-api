
import crypto from 'crypto';



export function analyzeString(value: string) {
  const normalized = value.toLowerCase();
  const reversed = normalized.split('').reverse().join('');
  const isPalindrome = normalized === reversed;
  const uniqueCharacters = new Set(value).size;
  const wordCount = value.trim().split(/\s+/).length;
  const sha256Hash = crypto.createHash('sha256').update(value).digest('hex');
  const characterFrequencyMap: Record<string, number> = {};

  for (const char of value) {
    characterFrequencyMap[char] = (characterFrequencyMap[char] || 0) + 1;
  }

  return {
    length: value.length,
    is_palindrome: isPalindrome,
    unique_characters: uniqueCharacters,
    word_count: wordCount,
    sha256_hash: sha256Hash,
    character_frequency_map: characterFrequencyMap,
  };
}




export function parseNaturalLanguageQuery(query: string): {
  filters: Record<string, any>,
  error?: string,
} {
  const filters: Record<string, any> = {};
  const lower = query.toLowerCase();

  if (lower.includes('single word')) filters.word_count = 1;
  if (lower.includes('palindromic')) filters.is_palindrome = true;
  if (lower.includes('longer than')) {
    const match = lower.match(/longer than (\d+)/);
    if (match?.[1]) filters.min_length = parseInt(match[1]) + 1;
  }
  if (lower.includes('containing the letter')) {
    const match = lower.match(/letter (\w)/);
    if (match?.[1]) filters.contains_character = match[1];
  }
  if (lower.includes('containing the first vowel')) {
    filters.contains_character = 'a'; // heuristic
  }
  if (lower.includes('strings containing the letter z')) {
    filters.contains_character = 'z';
  }

  // If no filters detected
  if (Object.keys(filters).length === 0) {
    return { filters, error: 'Unable to parse natural language query' };
  }

  return { filters };
}

