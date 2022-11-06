/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  mobile: string;
  password: string;
}
export interface CodeParams {
  mobile: string;
  verificationCode: string;
}
export interface PwdParams {
  mobile: string;
  verificationCode: string;
  password: string;
}
export interface ChangePwdParams {
  oldPassword: string;
  newPassword: string;
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
}
