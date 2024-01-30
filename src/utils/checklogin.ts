import { watch, h, unref } from 'vue';

import { useCountdown } from '/@/utils/time/useCountdown';
import { useMessage } from '/@/hooks/web/useMessage';
import { useUserStore } from '/@/store/modules/user';
import { useI18n } from '/@/hooks/web/useI18n';

//api
import { getTokenUserInfo } from '/@/api/page/member';

const { createWarningModal } = useMessage();

//logout
const { currentCount, start, reset } = useCountdown(30 * 60); //定時器
export const checkLogin = (path) => {
  if (path.indexOf('/login') > -1) {
    //停用定時器
    reset();
  } else {
    //開啟定時器
    start();

    //偵測登入狀態
    watch(
      () => currentCount.value,
      async () => {
        if (unref(currentCount) === 1) {
          const res = await getTokenUserInfo();
          loginVerify('countdown', res);
        }
      },
    );
  }
};

//登入逾期
export const loginVerify = (type = 'alert', res) => {
  const userStore = useUserStore();
  const { t } = useI18n();

  //定時器
  const logoutSec = 10;
  const {
    currentCount: logoutCount,
    start: logoutStart,
    reset: logoutReset,
  } = useCountdown(logoutSec);

  //登出判斷
  if (res.data && res.data.message === 'loginOut') {
    logoutStart();
    createWarningModal({
      title: t('sys.login.loginExpired'),
      content: () =>
        h('div', { class: 'mt-5' }, [
          h('span', t('sys.login.sessionTimeoutMsg', [unref(logoutCount)])),
        ]),
      okText: t('sys.login.logout'),
      onOk: () => {
        logoutReset();
        userStore.logout(true);
      },
    });

    //自動登出
    watch(
      () => logoutCount.value,
      async () => {
        if (unref(logoutCount) === 1) {
          userStore.logout(true);
          logoutReset();
        }
      },
    );
  } else {
    if (type == 'countdown') start();
  }
};
