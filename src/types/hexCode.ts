'use strict';

/**
 * @param {string} phrase
 */
export default (_: any, phrase: string): string | null => {
  if (!phrase) return null;
  if (/^#[0-9a-f]{6}$/i.test(phrase)) return phrase.replace('#', '');
  return null;
};
