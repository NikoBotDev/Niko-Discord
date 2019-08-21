'use strict';

/**
 * @param {string} phrase
 */
module.exports = (_, phrase) => {
  if (!phrase) return null;
  if (/^#[0-9a-f]{6}$/i.test(phrase)) return phrase.replace('#', '');
  return null;
};
