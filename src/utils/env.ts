import type { GlobEnvConfig } from '/#/config';

import { warn } from '/@/utils/log';
import pkg from '../../package.json';
import { getConfigFileName } from '../../build/getConfigFileName';

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig();
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env);

  const ENV = (import.meta.env.DEV
    ? // Get the global configuration (the configuration will be extracted independently when packaging)
      (import.meta.env as unknown as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown as GlobEnvConfig;

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,

    //正式站Ip
    VITE_GLOB_OFFICIAL_IP,
    //測試站Ip
    VITE_GLOB_DEMO_IP,

    //大豐環保前台Url
    VITE_GLOB_FRONT_URL,

    //正式站Api
    VITE_GLOB_OFFICIAL_OLDAPI,
    VITE_GLOB_OFFICIAL_NEWAPI,
    VITE_GLOB_OFFICIAL_LSGHEAVEN_10010_API,
    VITE_GLOB_OFFICIAL_LSGHEAVEN_10002_API,
    VITE_GLOB_OFFICIAL_LSGHEAVEN_10030_API,
    VITE_GLOB_OFFICIAL_COMMONSERVER_API,

    //測試站Api
    VITE_GLOB_DEMO_OLDAPI,
    VITE_GLOB_DEMO_NEWAPI,
    VITE_GLOB_DEMO_LSGHEAVEN_10010_API,
    VITE_GLOB_DEMO_LSGHEAVEN_10002_API,
    VITE_GLOB_DEMO_LSGHEAVEN_10030_API,
    VITE_GLOB_DEMO_COMMONSERVER_API,

    //開發站Api
    VITE_GLOB_DEV_OLDAPI,
    VITE_GLOB_DEV_NEWAPI,
    VITE_GLOB_DEV_LSGHEAVEN_10010_API,
    VITE_GLOB_DEV_LSGHEAVEN_10002_API,
    VITE_GLOB_DEV_LSGHEAVEN_10030_API,
    VITE_GLOB_DEV_COMMONSERVER_API,

    //DTC Api
    VITE_GLOB_DTC_API,

    //TG機器人 Api
    VITE_GLOB_CHAT_TGROBOT_API,

    //正式站的TG BOT
    VITE_GLOB_OFFICIAL_TGBOT,
    //測試站的TG BOT
    VITE_GLOB_DEMO_TGBOT,

    //是否為正式站
    VITE_GLOB_ISDEMO,
  } = ENV;

  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`,
    );
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,

    //正式站Ip
    VITE_GLOB_OFFICIAL_IP,
    //測試站Ip
    VITE_GLOB_DEMO_IP,

    //大豐環保前台Url
    VITE_GLOB_FRONT_URL,

    //正式站Api
    VITE_GLOB_OFFICIAL_OLDAPI,
    VITE_GLOB_OFFICIAL_NEWAPI,
    VITE_GLOB_OFFICIAL_LSGHEAVEN_10010_API,
    VITE_GLOB_OFFICIAL_LSGHEAVEN_10002_API,
    VITE_GLOB_OFFICIAL_LSGHEAVEN_10030_API,
    VITE_GLOB_OFFICIAL_COMMONSERVER_API,

    //測試站Api
    VITE_GLOB_DEMO_OLDAPI,
    VITE_GLOB_DEMO_NEWAPI,
    VITE_GLOB_DEMO_LSGHEAVEN_10010_API,
    VITE_GLOB_DEMO_LSGHEAVEN_10002_API,
    VITE_GLOB_DEMO_LSGHEAVEN_10030_API,
    VITE_GLOB_DEMO_COMMONSERVER_API,

    //開發站Api
    VITE_GLOB_DEV_OLDAPI,
    VITE_GLOB_DEV_NEWAPI,
    VITE_GLOB_DEV_LSGHEAVEN_10010_API,
    VITE_GLOB_DEV_LSGHEAVEN_10002_API,
    VITE_GLOB_DEV_LSGHEAVEN_10030_API,
    VITE_GLOB_DEV_COMMONSERVER_API,

    //DTC Api
    VITE_GLOB_DTC_API,

    //TG機器人 Api
    VITE_GLOB_CHAT_TGROBOT_API,

    //正式站的TG BOT
    VITE_GLOB_OFFICIAL_TGBOT,
    //測試站的TG BOT
    VITE_GLOB_DEMO_TGBOT,

    //是否為正式站
    VITE_GLOB_ISDEMO,
  };
}

/**
 * @description: Development mode
 */
export const devMode = 'development';

/**
 * @description: Production mode
 */
export const prodMode = 'production';

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}
