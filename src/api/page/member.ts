import { httpDF666 } from '/@/utils/http/axios';
import { parameters } from '/@/utils/parameters';

enum Api {
  getUserBySession = '/user/getUserBySession',
  defaultUserSig = '/user/getUserSig',
  updateUser = '/user/updateUser',
  getAllUsers = '/user/getAllUsers',
}

// 取得: 會員個人資料
export function getTokenUserInfo() {
  return httpDF666.get(
    {
      url: Api.getUserBySession,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 異動 : 會員個人資料
export function updateSport(data) {
  return httpDF666.post(
    {
      url: Api.updateUser,
      data,
    },
    { errorMessageMode: 'modal', isTransformResponse: false },
  );
}

// 取得: 會員列表
export function geUserList(params = { alias: '', number: '', currentPage: 0, pageSize: 10 }) {
  return httpDF666.get(
    {
      url: Api.getAllUsers + `?${parameters(params)}`,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 取得: 未登入預設帳號的userSig
export function getUserSig() {
  return httpDF666.get(
    {
      url: Api.defaultUserSig,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}
