/*
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-24 18:03:55
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-25 21:54:30
 */
import { defHttp } from '/@/utils/http/axios';
// import { Modal } from 'ant-design-vue';

enum Api {
  list = '/user-api/v1/mamas/shops/actions/search',
  shopInfo = '/user-api/v1/mamas/shops/',
  bankInfo = '/user-api/v1/mamas/organizationBanks/actions/getByOrganizationId/',
  shopBase = '/general-api/v1/mamas/shops/actions/count',
  staffList = '/user-api/v1/mamas/shopVendors/actions/search',
  addressList = '/user-api/v1/mamas/shopAddress/actions/listByShopId/',
  getOrganizationTypesList = '/user-api/v1/mamas/organizations/actions/listOrganizationTypes',
  getShopStatusTypesList = '/user-api/v1/mamas/shops/actions/listShopStatusTypes',
  getOrganizationReviewStatusTypesList = '/user-api/v1/mamas/organizations/actions/listOrganizationReviewStatusTypes',
}
export const addressList = '/user-api/v1/mamas/shopAddress/actions/listByShopId';
/**
 * 微信商户申请状态
 * @param params
 */
export const getOrganizationReviewStatusTypesList = (params) =>
  defHttp.get({ url: Api.getOrganizationReviewStatusTypesList, params });
/**
 * 经营主体类型
 * @param params
 */
export const getOrganizationTypesList = (params) =>
  defHttp.get({ url: Api.getOrganizationTypesList, params });
/**
 * 店铺状态
 * @param params
 */
export const getShopStatusTypesList = (params) =>
  defHttp.get({ url: Api.getShopStatusTypesList, params });
/**
 * 获取店铺列表
 * @param params
 */
export const shopList = (params) => {
  return defHttp.post({ url: Api.list, params: params });
};

/**
 * 获取店铺详情信息
 * @param params
 */
export const shopInfo = (id, params = {}) => defHttp.get({ url: Api.shopInfo + id, params });
/**
 * 更新店铺详情信息
 * @param params
 */
export const updateShopInfo = (id, params = {}) => defHttp.put({ url: Api.shopInfo + id, params });
/**
 * 获取店铺详情信息 --银行账户
 * @param params
 */
export const bankInfo = (id) => defHttp.get({ url: Api.bankInfo + id });
/**
 * 获取店铺数据
 * @param params
 */
export const shopBase = (params) => {
  return defHttp.post({ url: Api.shopBase, params });
};

/**
 * 获取店铺员工信息
 * @param params
 */
export const staffList = (params) => {
  return defHttp.post({ url: Api.staffList, params });
};
// /**
//  * 获取店铺地址库
//  * @param params
//  */
// export const addressList = (id) => {
//   return defHttp.get({ url: Api.addressList + id });
// };
