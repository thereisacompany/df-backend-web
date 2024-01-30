import { http4100NoPrefix, httpDF666 } from '/@/utils/http/axios';
import { LoginParams } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/auth/login',
  ChangePassword = '/auth/changepwd',
  CheckPassword = '/auth/checkpwd',
  ResetPassword = '/auth/resetpwd',
  UserLogin = '/user/login',
}

// 用戶登入
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return httpDF666.post(
    {
      url: Api.UserLogin,
      params,
    },
    { errorMessageMode: mode, isTransformResponse: false },
  );
}

export function ChangePassword(params: changePasswordParams, mode: ErrorMessageMode = 'modal') {
  return http4100NoPrefix.post(
    {
      url: Api.ChangePassword,
      params,
    },
    { errorMessageMode: mode },
  );
}
export function checkPassword(params: checkPasswordParams, mode: ErrorMessageMode = 'modal') {
  return http4100NoPrefix.post(
    {
      url: Api.CheckPassword,
      params,
    },
    { errorMessageMode: mode },
  );
}
export function resetPassword(params: any, mode: ErrorMessageMode = 'modal') {
  return http4100NoPrefix.post(
    {
      url: Api.ResetPassword + `?targetUserId=${params.targetUserId}&editor=${params.editor}`,
      params,
    },
    { errorMessageMode: mode },
  );
}
