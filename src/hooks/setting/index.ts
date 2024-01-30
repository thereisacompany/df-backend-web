import type { GlobConfig } from '/#/config';

import { warn } from '/@/utils/log';
import { getAppEnvConfig } from '/@/utils/env';

export const useGlobSetting = (): Readonly<GlobConfig> => {
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
  } = getAppEnvConfig();

  if (!/[a-zA-Z\_]*/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`,
    );
  }
  const api = {
    //api 網址
    apiPath4000: '',
    apiPath4100: '',
    apiPathIT: '',
    apiPathCommonserver: '',
    apiPathCRM: '',
    apiPathDTC: '',
    apiPathOther: '',
    //環境
    envMode: '',
  };
  //---*根據當前的網址ip來判斷api位置
  const checkCurrentPath = () => {
    const path = window.location.href;
    let currentPath: any = '';
    currentPath = path.split('/').slice(2, 3);
    switch (currentPath.toString()) {
      case VITE_GLOB_OFFICIAL_IP:
        //正式站
        api.envMode = '';
        api.apiPath4000 = VITE_GLOB_OFFICIAL_OLDAPI;
        api.apiPath4100 = VITE_GLOB_OFFICIAL_NEWAPI;
        api.apiPathIT = VITE_GLOB_OFFICIAL_LSGHEAVEN_10010_API;
        api.apiPathCommonserver = VITE_GLOB_OFFICIAL_COMMONSERVER_API;
        api.apiPathCRM = VITE_GLOB_OFFICIAL_LSGHEAVEN_10030_API;
        api.apiPathDTC = VITE_GLOB_DTC_API;
        api.apiPathOther = VITE_GLOB_OFFICIAL_LSGHEAVEN_10002_API;
        break;
      case VITE_GLOB_DEMO_IP:
        //測試站
        api.envMode = '大豐環保後台測試站';
        api.apiPath4000 = VITE_GLOB_DEMO_OLDAPI;
        api.apiPath4100 = VITE_GLOB_DEMO_NEWAPI;
        api.apiPathIT = VITE_GLOB_DEMO_LSGHEAVEN_10010_API;
        api.apiPathCommonserver = VITE_GLOB_DEMO_COMMONSERVER_API;
        api.apiPathCRM = VITE_GLOB_DEMO_LSGHEAVEN_10030_API;
        api.apiPathDTC = VITE_GLOB_DTC_API;
        api.apiPathOther = VITE_GLOB_DEMO_LSGHEAVEN_10002_API;
        break;
      default:
        //開發站
        api.envMode = '大豐環保後台開發站';
        api.apiPath4000 = VITE_GLOB_DEV_OLDAPI;
        api.apiPath4100 = VITE_GLOB_DEV_NEWAPI;
        api.apiPathIT = VITE_GLOB_DEV_LSGHEAVEN_10010_API;
        api.apiPathCommonserver = VITE_GLOB_DEV_COMMONSERVER_API;
        api.apiPathCRM = VITE_GLOB_DEV_LSGHEAVEN_10030_API;
        api.apiPathDTC = VITE_GLOB_DTC_API;
        api.apiPathOther = VITE_GLOB_DEV_LSGHEAVEN_10002_API;
        break;
    }
  };
  checkCurrentPath();

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,

    //正式站Ip
    official_ip: VITE_GLOB_OFFICIAL_IP,
    //測試站Ip
    demo_ip: VITE_GLOB_DEMO_IP,

    //大豐環保前台Url
    front_url: VITE_GLOB_FRONT_URL,

    //api 網址
    apiPath4000: api.apiPath4000,
    apiPath4100: api.apiPath4100,
    apiPathIT: api.apiPathIT,
    apiPathCommonserver: api.apiPathCommonserver,
    apiPathCRM: api.apiPathCRM,
    apiPathDTC: api.apiPathDTC,
    apiPathOther: api.apiPathOther,
    //目前網站的環境：正式站、測試站、開發站
    envMode: api.envMode,

    //DTC Api
    DTCApi: VITE_GLOB_DTC_API,

    //TG機器人 Api
    chatTGRobotApi: VITE_GLOB_CHAT_TGROBOT_API,

    //正式站的TG BOT
    official_TGBOT: VITE_GLOB_OFFICIAL_TGBOT,
    //測試站的TG BOT
    demo_TGBOT: VITE_GLOB_DEMO_TGBOT,

    //是否為正式站
    isDemo: VITE_GLOB_ISDEMO,
  };

  return glob as Readonly<GlobConfig>;
};
