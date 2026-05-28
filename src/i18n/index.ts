import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import en from '@/src/locales/en.json';
import ja from '@/src/locales/ja.json';

export const i18n = new I18n(
  { ja, en },
  {
    defaultLocale: 'ja',
    enableFallback: true,
    missingBehavior: 'guess',
  },
);

// TODO(phase-2): switch to detectedLocale once en.json is filled and a settings UI exists
const detectedLocale = getLocales()[0]?.languageCode ?? 'ja';
void detectedLocale;
i18n.locale = 'ja';

type Join<K extends string, P extends string> = P extends '' ? K : `${K}.${P}`;
type DottedKeys<T> = T extends string | number | boolean | null
  ? ''
  : {
      [K in keyof T & string]: Join<K, DottedKeys<T[K]>>;
    }[keyof T & string];

export type TranslationKey = Exclude<DottedKeys<typeof ja>, ''>;

export const t = (key: TranslationKey, options?: Record<string, unknown>): string =>
  i18n.t(key as string, options);
