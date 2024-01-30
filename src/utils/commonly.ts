import { useUserStore } from '/@/store/modules/user';

/* 登入者資訊 */
const userStore = useUserStore();
export const userInfo = userStore.getUserInfo;
export const userNameJobId = `${userInfo.realName} ${userInfo.username}`;
export const userId = userInfo.userId;
