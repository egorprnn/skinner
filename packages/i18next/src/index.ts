import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18nextResourcesToBackend from 'i18next-resources-to-backend';
import { setErrorMap, z } from 'zod';
import { IS_DEVELOPMENT_MODE } from '@skinner/constants';

export const i18nextInitialization = i18next
  .use(LanguageDetector)
  .use(
    // @ts-expect-error
    i18nextResourcesToBackend((language, namespace) => {
      if (namespace.startsWith('shared.')) {
        return import(/* @vite-ignore */ `../../i18next/locales/${language}/${namespace}.js`);
      }

      if (typeof window !== 'undefined') {
        return import(/* @vite-ignore */ `../../i18next/locales/${language}/frontend/${namespace}.js`);
      }

      return import(/* @vite-ignore */ `../../i18next/locales/${language}/backend/${namespace}.js`);
    }),
  )
  .init({
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    debug: IS_DEVELOPMENT_MODE,
    interpolation: {
      escapeValue: false,
    },
  });

setErrorMap((issue, context) => {
  let message: string;

  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      message = i18next.t('shared.zod:issue_invalid_type');
      break;
    case z.ZodIssueCode.too_small:
      message = i18next.t('shared.zod:issue_too_small', {
        count: issue.minimum as number,
      });
      break;
    default:
      message = context.defaultError;
      break;
  }

  return {
    message,
  };
});

export { i18next };
