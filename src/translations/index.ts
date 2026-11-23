import { en } from './en';
import { fr } from './fr';
import { ar } from './ar';
import { Language } from '../types';

export const translations = {
  en,
  fr,
  ar,
} as const;

export type TranslationContent = typeof en;

export function getTranslation(lang: Language): TranslationContent {
  return (translations[lang] || translations.en) as TranslationContent;
}
