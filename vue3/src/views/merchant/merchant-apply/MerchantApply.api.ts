/*
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-24 18:03:55
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-25 14:08:01
 */
import { defHttp } from '/@/utils/http/axios';
// import { Modal } from 'ant-design-vue';

enum Api {
  list = '/user-api/v1/mamas/shops/actions/search',
  getOrganizationReviewStatusTypesList = '/user-api/v1/mamas/organizations/actions/listOrganizationReviewStatusTypes',
  getShopWxPayApplymentStatusTypesList = '/user-api/v1/mamas/shops/actions/listShopWxPayApplymentStatusTypes',
  sendSign = '/user-api/v1/mamas/shops',
}
export const historyListUrl = '/user-api/v1/mamas/shopWxReviewHistories/actions/listByShopId';

/**
 * 发送签约通知
 * @param params
 */
export const sendSign = (params) => defHttp.put({ url: Api.sendSign + '/' + params.id, params });
/**
 * 微信商户申请type
 * @param params
 */
export const getShopWxPayApplymentStatusTypesList = (params) =>
  defHttp.get({ url: Api.getShopWxPayApplymentStatusTypesList, params });

/**
 * 平台审核type
 * @param params
 */
export const getOrganizationReviewStatusTypesList = (params) =>
  defHttp.get({ url: Api.getOrganizationReviewStatusTypesList, params });

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 节添加
 * @param params
 */
export const applyList = (params) => {
  return defHttp.post({ url: Api.list, params: params });
};
