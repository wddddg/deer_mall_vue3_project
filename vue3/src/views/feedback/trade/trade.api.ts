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
  statusCodeList = '/general-api/v1/mamas/tickets/actions/listTicketStatusCodes', // 反馈状态list
  typeCodeList = '/general-api/v1/mamas/tickets/actions/listTicketTypeCodes', // 反馈分类list
  feedbackList = '/general-api/v1/mamas/tickets/actions/search', // 消费者、商家反馈List，userTypeCode：buyer消费者
  detailInfo = '/general-api/v1/mamas/tickets', // 反馈详情信息
  recordList = '/general-api/v1/mamas/ticketHistories/actions/getByTicketId', // 反馈处理记录
  include = '/support-api/v1/mamas/tickets', // 反馈类型分类
  dealPersonList = '/user-api/v1/mamas/actions/search', // 处理人列表
  dealFeedback = '/support-api/v1/mamas/ticketHistories', // 处理反馈意见
  deleteFeedback = '/support-api/v1/mamas/tickets', // 删除反馈意见
}

/**
 * 删除反馈意见
 * @param params
 */
export const deleteFeedback = (id) => {
  return defHttp.delete({ url: Api.deleteFeedback + '/' + id });
};
/**
 * 反馈详情信息
 * @param params
 */
export const detailInfo = (id) => {
  return defHttp.get({ url: Api.detailInfo + '/' + id });
};
/**
 * 反馈处理记录
 * @param params
 */
export const recordList = (id) => {
  return defHttp.get({ url: Api.recordList + '/' + id });
};
/**
 * 反馈类型分类
 * @param params
 */
export const include = (id, params) => {
  return defHttp.put({ url: Api.include + '/' + id, params });
};
/**
 * 处理人列表
 * @param params
 */
export const dealPersonList = (params) => {
  return defHttp.post({ url: Api.dealPersonList, params });
};
/**
 * 处理反馈列表
 * @param params
 */
export const dealFeedback = (params) => {
  return defHttp.post({ url: Api.dealFeedback, params });
};
/**
 * 消费者、商家反馈List
 * @param params
 */
export const feedbackList = (params) => {
  return defHttp.post({ url: Api.feedbackList, params });
};

/**
 * 反馈状态list
 * @param params
 */
export const statusCodeList = (params) => {
  return defHttp.get({ url: Api.statusCodeList, params });
};

/**
 * 反馈状态list
 * @param params
 */
export const typeCodeList = (params) => {
  return defHttp.get({ url: Api.typeCodeList, params });
};
