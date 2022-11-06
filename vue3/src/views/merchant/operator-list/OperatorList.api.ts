/*
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-24 18:03:55
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-25 22:35:38
 */
import { defHttp } from '/@/utils/http/axios';
// import { Modal } from 'ant-design-vue';

enum Api {
  list = '/user-api/v1/mamas/organizations/actions/search',
  operationInfo = '/user-api/v1/mamas/organizations',
  shopList = '/user-api/v1/mamas/shops/actions/listByOrganizationId',
  getOrganizationStatusTypesList = '/user-api/v1/mamas/organizations/actions/listOrganizationStatusTypes',
}
export const shopListUrl = '/user-api/v1/mamas/shops/actions/listByOrganizationId';

/**
 * 获取店铺列表
 * @param params
 */
export const operatorList = (params) => {
  return defHttp.post({ url: Api.list, params: params });
};

/**
 * 获取经营主体信息
 * @param params
 */
export const operationInfo = (id, params = {}) =>
  defHttp.get({ url: Api.operationInfo + '/' + id, params });

/**
 * 获取店铺列表
 * @param params
 */
export const shopList = (id) => defHttp.get({ url: Api.shopList + '/' + id });

/**
 * 经营主体状态
 * @param params
 */
export const getOrganizationStatusTypesList = (params) =>
  defHttp.get({ url: Api.getOrganizationStatusTypesList, params });

/**
 * 经营主体状态
 * @param params
 */
export const updateOperationInfo = (id, params = {}) =>
  defHttp.put({ url: Api.operationInfo + '/' + id, params });
