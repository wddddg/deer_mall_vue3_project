import { defHttp } from '/@/utils/http/axios';

enum Api {
  getChatRecordCustomerList = '/general-api/v1/mamas/chats',
  getChatRecordsDetail = '/general-api/v1/mamas/chatRecords/actions/search',
  getChatNotReadTotalCount = '/general-api/v1/mamas/chats/actions/notReadTotalCount',
  updateReceiverRead = '/support-api/v1/mamas/chatRecords/actions/updateReceiverRead',
  getChatCustomerRecordList = '/general-api/v1/mamas/chats/actions/search',
  getListTransferMama = '/general-api/v1/mamas/chats/actions/listTransferMama',
  updateTransferById = '/support-api/v1/mamas/chats/actions/changeMama',
}

/**
 * 查询聊天列表
 */
export const getChatRecordCustomerList = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.getChatRecordCustomerList, params: data });
};

/**
 * 查询聊天记录
 */
export const getChatRecordsDetail = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.getChatRecordsDetail, params: data });
};

/**
 * 查询未读总数(根据类型)
 */
export const getChatNotReadTotalCount = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.getChatNotReadTotalCount, params: data });
};

/**
 * 修改消息为已读
 */
export const updateReceiverRead = (params) => {
  const data = {
    ...params,
  };

  return defHttp.put({ url: Api.updateReceiverRead, params: data });
};

/**
 * 修改一条消息为已读（根据Id）
 */
export const updateReceiverReadById = (id: string) => {
  const url = `${Api.updateReceiverRead}/${id}`;
  const data = {
    id,
  };

  return defHttp.put({ url, params: data });
};

/**
 * 查询客户账号列表
 */
export const getChatCustomerRecordList = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.getChatCustomerRecordList, params: data });
};

/**
 * 查询可转接客服列表
 */
export const getListTransferMama = () => {
  return defHttp.get({ url: Api.getListTransferMama });
};

/**
 * 转接客服
 * @param reqData.shopId 店铺Id
 * @param reqData.userId 用户Id
 * @param reqData.mamaId 转接的商户ID
 * @param reqData.userTypeCode 用户类型
 */
export const updateTransferById = (params: {
  shopId: string;
  userId: string;
  mamaId: string;
  userTypeCode: string;
}) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.updateTransferById, params: data });
};

/**
 * 查看平台人员姓名（转接的）
 */
export const getMamaNameById = (id: number | string) => {
  const url = `/user-api/v1/mamas/actions/getNameById/${id}`;

  return defHttp.get({ url });
};

/**
 * 查看店员昵称
 */
export const getNicknameByShopIdAndVendorId = (params: { shopId: string; vendorId: string }) => {
  const url = `/user-api/v1/mamas/shopVendors/actions/getNicknameByShopIdAndVendorId`;
  const data = {
    ...params,
  };

  return defHttp.post({ url, params: data });
};

/**
 * 关闭会话
 */
export const updateSessionStatus = (id: string) => {
  const url = `/support-api/v1/mamas/chats/actions/finish/${id}`;
  const data = {
    id,
  };

  return defHttp.put({ url, params: data });
};
