import {getRequestConfig} from 'next-intl/server';
import { defaultLocale } from './next-intl.config';

export default getRequestConfig(async ({locale}) => {
  const activeLocale = locale ?? defaultLocale;
  // Load messages for the active locale
  const messages = (await import(`./messages/${activeLocale}.json`)).default;

  return {
    locale: activeLocale,
    messages
  };
});
