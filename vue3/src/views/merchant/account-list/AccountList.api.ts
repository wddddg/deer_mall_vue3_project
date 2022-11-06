/*
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-24 18:03:55
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-26 09:59:55
 */
import { defHttp } from '/@/utils/http/axios';
// import { Modal } from 'ant-design-vue';

enum Api {
  accountList = '/user-api/v1/mamas/shopVendors/actions/search',
  accountPremisionList = '/user-api/v1/mamas/vendorPermissions/',
}

/**
 * 账户列表
 * @param params
 */
export const accountList = (params) => {
  return defHttp.post({ url: Api.accountList, params });
};

/**
 * 账户权限列表
 * @param params
 */
export const accountPremisionList = (params) => {
  return defHttp.get({ url: Api.accountPremisionList + params });
};
