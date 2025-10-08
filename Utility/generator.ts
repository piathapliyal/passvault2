// utils/generator.ts

const AMBIGUOUS = "Il1O0";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/";

export type Options = {
  length: number;
  lower: boolean;
  upper: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
};

export function generatePassword(options: Options): string {
  let pool = "";
  if (options.lower) pool += LOWER;
  if (options.upper) pool += UPPER;
  if (options.numbers) pool += NUMBERS;
  if (options.symbols) pool += SYMBOLS;
  if (options.excludeAmbiguous)
    pool = pool.split("").filter(c => !AMBIGUOUS.includes(c)).join("");

  if (!pool) return "";

  const array = new Uint32Array(options.length);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map(num => pool[num % pool.length])
    .join("");
}
