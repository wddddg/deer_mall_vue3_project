import { defHttp } from '/@/utils/http/axios';

enum Api {
  getChatRecordList = '/general-api/v1/mamas/buyerChats/actions/search',
  getChatRecordDetail = '/general-api/v1/mamas/buyerChatRecords/actions/search',
  getListByVendorNotReply = '/general-api/v1/mamas/buyerChats/actions/listByVendorNotReply',
}

/**
 * 会话记录 --查询会话记录
 */
export const getChatRecordList = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.getChatRecordList, params: data });
};

/**
 * 会话记录 --查询聊天记录
 */
export const getChatRecordDetail = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.getChatRecordDetail, params: data });
};

/**
 * 工作台 --查询商家未复消息列表
 */
export const getListByVendorNotReply = () => {
  return defHttp.get({ url: Api.getListByVendorNotReply });
};
