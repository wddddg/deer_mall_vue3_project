import { defHttp } from '/@/utils/http/axios';

enum Api {
  orderTabInfo = '/sale-api/v1/mamas/tradeConfigs/actions/getFirst',
  saveOrderInfo = '/sale-api/v1/mamas/tradeConfigs',
  SMSTabInfo = '/user-api/v1/mamas/organizationConfigs',
  saveSMSInfo = '/user-api/v1/mamas/organizationConfigs/1',
  systemTabInfo = '/user-api/v1/mamas/vendorConfigs',
  saveSystemInfo = '/user-api/v1/mamas/vendorConfigs/1',
}

/**
 * 获取订单tab的信息
 */
export const orderTabInfo = () => {
  return defHttp.get({ url: Api.orderTabInfo });
};
/**
 * 保存订单tab的信息
 */
export const saveOrderInfo = (params) => {
  return defHttp.put({ url: Api.saveOrderInfo, params });
};

/**
 * 获取订单tab的信息
 */
export const SMSTabInfo = () => {
  return defHttp.get({ url: Api.SMSTabInfo });
};
/**
 * 保存SMStab的信息
 */
export const saveSMSInfo = (params) => {
  return defHttp.put({ url: Api.saveSMSInfo, params });
};

/**
 * 获取系统tab的信息
 */
export const systemTabInfo = () => {
  return defHttp.get({ url: Api.systemTabInfo });
};
/**
 * 保存系统tab的信息
 */
export const saveSystemInfo = (params) => {
  return defHttp.put({ url: Api.saveSystemInfo, params });
};
