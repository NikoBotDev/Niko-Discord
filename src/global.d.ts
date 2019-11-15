declare function __(
  phraseOrOptions: string | TranslateOptions,
  replacements: Replacements
): string;

declare function __(
  phraseOrOptions: string | TranslateOptions,
  ...replace: string[]
): string;

interface Replacements {
  [key: string]: string | number;
}

interface TranslateOptions {
  phrase: string;
  locale?: string;
}
