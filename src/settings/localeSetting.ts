import type { DropMenu } from '../components/Dropdown';
import type { LocaleSetting, LocaleType } from '/#/config';

export const LOCALE: { [key: string]: LocaleType } = {
  ZH_CN: 'zh_CN',
  ZH_TW: 'zh_TW',
  EN_US: 'en',
};

export const localeSetting: LocaleSetting = {
  showPicker: true,
  // Locale
  locale: LOCALE.ZH_TW,
  // Default locale
  fallback: LOCALE.ZH_TW,
  // available Locales
  availableLocales: [LOCALE.EN_US, LOCALE.ZH_TW, LOCALE.ZH_CN],
};

// locale list
export const localeList: DropMenu[] = [
  {
    text: '繁體中文',
    event: LOCALE.ZH_TW,
    show: true,
  },
  {
    text: '简体中文',
    event: LOCALE.ZH_CN,
    show: true,
  },
  {
    text: 'English',
    event: LOCALE.EN_US,
    show: true,
  },
];
