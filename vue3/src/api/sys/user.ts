import { defHttp } from '/@/utils/http/axios';
import { LoginParams, CodeParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  pawLogin = '/user-api/v1/mamas/actions/login',
  msgLogin = '/user-api/v1/mamas/actions/loginByVerificationCode',
  sendSmsLoginVerificationCode = '/user-api/v1/mamas/actions/sendSmsLoginVerificationCode',
  sendSmsForgetPasswordVerificationCode = '/user-api/v1/mamas/actions/sendSmsForgetPasswordVerificationCode',
  forgetPassword = '/user-api/v1/mamas/actions/forgetPassword',
  changePassword = '/user-api/v1/mamas/actions/changePassword',
  changeStatus = '/user-api/v1/mamas/actions/changeStatusCode',
  Logout = '/user-api/v1/mamas/actions/loginOut',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

/**
 * 手机 + 密码 登录
 * @param params 请求体
 * @param params.mobile 手机号码
 * @param params.password 密码
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.pawLogin,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * 手机 + 验证码 登录
 * @param params 请求体
 * @param params.mobile 手机号码
 * @param params.verificationCode 验证码
 */
export function loginByCode(params: CodeParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.msgLogin,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 获取验证码
 * @param postData.mobile  手机号
 */
export function sendSmsLoginVerificationCode(
  params: { mobile: string },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.sendSmsLoginVerificationCode,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 忘记密码发送手机验证码
 * @param postData.mobile  手机号
 */
export function sendSmsForgetPasswordVerificationCode(params, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.sendSmsForgetPasswordVerificationCode,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * 根据旧密码修改密码 仅用于登录后修改密码
 * @param postData.oldPassword  旧密码
 * @param postData.newPassword  新密码
 */
export function changePassword(
  params: { oldPassword: string; newPassword: string },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.put<any>(
    {
      url: Api.changePassword,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * 根据手机验证码修改密码
 * @param postData.mobile  手机号
 * @param postData.verificationCode  手机验证码
 * @param postData.password  密码
 */
export function forgetPasswordOfChangePassword(
  params: {
    mobile: string;
    verificationCode: string;
    password?: string;
  },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<any>(
    {
      url: Api.forgetPassword,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

/**
 * 修改状态
 */
export function changeStatusCode() {
  return defHttp.put({ url: Api.changeStatus });
}
