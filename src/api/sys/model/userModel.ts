import type { AppRouteRecordRaw } from '/@/router/types';
/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  tgid?: string;
}
export interface TGLoginParams {
  tgid: string;
}
export interface changePasswordParams {
  userId: number;
  passwordOld: string;
  passwordNew: string;
}

export interface checkPasswordParams {
  userId: number;
  pwd: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
  hrSystemRoute: AppRouteRecordRaw[];
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
  tgId: string;
  isChangePassword: boolean;
}
