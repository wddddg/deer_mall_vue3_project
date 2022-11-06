import { defHttp } from '/@/utils/http/axios';

enum Api {
  roleList = '/user-api/v1/mamas/roles/actions/list',
  Accountlist = '/user-api/v1/mamas/actions/search',
  accountOperate = '/user-api/v1/mamas/',
}

/**
 * 角色列表
 * @param params
 */
export const roleList = (params) => {
  return defHttp.get({ url: Api.roleList, params });
};

/**
 * 账户列表
 * @param params
 */
export const AccountList = (params) => {
  return defHttp.post({ url: Api.Accountlist, params: params });
};

/*
 **
 * 删除账号操作
 * @param params
 */
export const deleteAccount = (id, params) => {
  return defHttp.delete({ url: Api.accountOperate + id, params });
};

/*
 **
 * 账号编辑操作
 * @param params
 */
export const update = (id, params) => {
  return defHttp.put({ url: Api.accountOperate + id, params });
};

/**
 * 获取账号信息
 * @param params
 */
export const getAccountByID = (id) => {
  return defHttp.get({ url: Api.accountOperate + id });
};

/*
 **
 * 创建
 * @param params
 */
export const create = (params) => {
  return defHttp.post({ url: Api.accountOperate, params: params });
};
