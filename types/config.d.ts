import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '/@/enums/menuEnum';
import {
  ContentEnum,
  PermissionModeEnum,
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
  SessionTimeoutProcessingEnum,
} from '/@/enums/appEnum';

import { CacheTypeEnum } from '/@/enums/cacheEnum';

export type LocaleType = 'zh_CN' | 'en' | 'ru' | 'ja' | 'ko' | 'zh_TW';

export interface MenuSetting {
  bgColor: string;
  fixed: boolean;
  collapsed: boolean;
  canDrag: boolean;
  show: boolean;
  hidden: boolean;
  split: boolean;
  menuWidth: number;
  mode: MenuModeEnum;
  type: MenuTypeEnum;
  theme: ThemeEnum;
  topMenuAlign: 'start' | 'center' | 'end';
  trigger: TriggerEnum;
  accordion: boolean;
  closeMixSidebarOnChange: boolean;
  collapsedShowTitle: boolean;
  mixSideTrigger: MixSidebarTriggerEnum;
  mixSideFixed: boolean;
}

export interface MultiTabsSetting {
  cache: boolean;
  show: boolean;
  showQuick: boolean;
  canDrag: boolean;
  showRedo: boolean;
  showFold: boolean;
}

export interface HeaderSetting {
  bgColor: string;
  fixed: boolean;
  show: boolean;
  theme: ThemeEnum;
  // Turn on full screen
  showFullScreen: boolean;
  // Whether to show the lock screen
  useLockPage: boolean;
  // Show document button
  showDoc: boolean;
  // Show message center button
  showNotice: boolean;
  showSearch: boolean;
}

export interface LocaleSetting {
  showPicker: boolean;
  // Current language
  locale: LocaleType;
  // default language
  fallback: LocaleType;
  // available Locales
  availableLocales: LocaleType[];
}

export interface TransitionSetting {
  //  Whether to open the page switching animation
  enable: boolean;
  // Route basic switching animation
  basicTransition: RouterTransitionEnum;
  // Whether to open page switching loading
  openPageLoading: boolean;
  // Whether to open the top progress bar
  openNProgress: boolean;
}

export interface ProjectConfig {
  // Storage location of permission related information
  permissionCacheType: CacheTypeEnum;
  // Whether to show the configuration button
  showSettingButton: boolean;
  // Whether to show the theme switch button
  showDarkModeToggle: boolean;
  // Configure where the button is displayed
  settingButtonPosition: SettingButtonPositionEnum;
  // Permission mode
  permissionMode: PermissionModeEnum;
  // Session timeout processing
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum;
  // Website gray mode, open for possible mourning dates
  grayMode: boolean;
  // Whether to turn on the color weak mode
  colorWeak: boolean;
  // Theme color
  themeColor: string;

  // The main interface is displayed in full screen, the menu is not displayed, and the top
  fullContent: boolean;
  // content width
  contentMode: ContentEnum;
  // Whether to display the logo
  showLogo: boolean;
  // Whether to show the global footer
  showFooter: boolean;
  // menuType: MenuTypeEnum;
  headerSetting: HeaderSetting;
  // menuSetting
  menuSetting: MenuSetting;
  // Multi-tab settings
  multiTabsSetting: MultiTabsSetting;
  // Animation configuration
  transitionSetting: TransitionSetting;
  // pageLayout whether to enable keep-alive
  openKeepAlive: boolean;
  // Lock screen time
  lockTime: number;
  // Show breadcrumbs
  showBreadCrumb: boolean;
  // Show breadcrumb icon
  showBreadCrumbIcon: boolean;
  // Use error-handler-plugin
  useErrorHandle: boolean;
  // Whether to open back to top
  useOpenBackTop: boolean;
  // Is it possible to embed iframe pages
  canEmbedIFramePage: boolean;
  // Whether to delete unclosed messages and notify when switching the interface
  closeMessageOnSwitch: boolean;
  // Whether to cancel the http request that has been sent but not responded when switching the interface.
  removeAllHttpPending: boolean;
}

export interface GlobConfig {
  // Site title
  title: string;
  // Service interface url
  apiUrl: string;
  // Upload url
  uploadUrl?: string;
  //  Service interface url prefix
  urlPrefix?: string;
  // Project abbreviation
  shortName: string;

  //正式站Ip
  official_ip: string;
  //測試站Ip
  demo_ip: string;

  //測試站Ip
  front_url: string;

  //api 網址
  apiPath4000: string;
  apiPath4100: string;
  apiPathIT: string;
  apiPathCommonserver: string;
  apiPathCRM: string;
  apiPathDTC: string;
  apiPathOther: string;
  //目前網站的環境：正式站、測試站、開發站
  envMode: string;

  //DTC Api
  DTCApi: string;

  //TG機器人 Api
  chatTGRobotApi: string;

  //正式站的TG BOT
  official_TGBOT: string;
  //測試站的TG BOT
  demo_TGBOT: string;

  //是否為正式站
  isDemo: string;
}
export interface GlobEnvConfig {
  // Site title
  VITE_GLOB_APP_TITLE: string;
  // Service interface url
  VITE_GLOB_API_URL: string;
  // Service interface url prefix
  VITE_GLOB_API_URL_PREFIX?: string;
  // Project abbreviation
  VITE_GLOB_APP_SHORT_NAME: string;
  // Upload url
  VITE_GLOB_UPLOAD_URL?: string;

  //正式站Ip
  VITE_GLOB_OFFICIAL_IP: string;
  //測試站Ip
  VITE_GLOB_DEMO_IP: string;

  //大豐環保前台Url
  VITE_GLOB_FRONT_URL: string;

  //正式站Api
  VITE_GLOB_OFFICIAL_OLDAPI: string;
  VITE_GLOB_OFFICIAL_NEWAPI: string;
  VITE_GLOB_OFFICIAL_LSGHEAVEN_10010_API: string;
  VITE_GLOB_OFFICIAL_LSGHEAVEN_10002_API: string;
  VITE_GLOB_OFFICIAL_LSGHEAVEN_10030_API: string;
  VITE_GLOB_OFFICIAL_COMMONSERVER_API: string;

  //測試站Api
  VITE_GLOB_DEMO_OLDAPI: string;
  VITE_GLOB_DEMO_NEWAPI: string;
  VITE_GLOB_DEMO_LSGHEAVEN_10010_API: string;
  VITE_GLOB_DEMO_LSGHEAVEN_10002_API: string;
  VITE_GLOB_DEMO_LSGHEAVEN_10030_API: string;
  VITE_GLOB_DEMO_COMMONSERVER_API: string;

  //開發站Api
  VITE_GLOB_DEV_OLDAPI: string;
  VITE_GLOB_DEV_NEWAPI: string;
  VITE_GLOB_DEV_LSGHEAVEN_10010_API: string;
  VITE_GLOB_DEV_LSGHEAVEN_10002_API: string;
  VITE_GLOB_DEV_LSGHEAVEN_10030_API: string;
  VITE_GLOB_DEV_COMMONSERVER_API: string;

  //DTC Api
  VITE_GLOB_DTC_API: string;

  //TG機器人 Api
  VITE_GLOB_CHAT_TGROBOT_API: string;

  //正式站的TG BOT
  VITE_GLOB_OFFICIAL_TGBOT: string;
  //測試站的TG BOT
  VITE_GLOB_DEMO_TGBOT: string;

  //是否為正式站
  VITE_GLOB_ISDEMO: string;
}
