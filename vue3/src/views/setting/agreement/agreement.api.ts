import { defHttp } from '/@/utils/http/axios';

enum Api {
  agreementList = '/user-api/v1/mamas/usageAgreements/actions/search',
  historyList = '/user-api/v1/mamas/usageAgreements/actions/listByCode',
  editInfo = '/user-api/v1/mamas/usageAgreements',
}

/**
 * 查询协议管理列表
 */
export const getAgreementList = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.agreementList, params: data });
};

/**
 * 获取版本记录
 */
export const getStatusTypesList = (params) => {
  return defHttp.get({ url: `${Api.historyList}/${params.code}` });
};

/**
 * 查看信息
 */
export const getEditInfo = (params) => {
  return defHttp.get({ url: `${Api.editInfo}/${params.id}` });
};

/**
 * 编辑信息
 */
export const setEditInfo = (params) => {
  return defHttp.post({ url: `${Api.editInfo}`, params });
};

export const setDraftEditInfo = (params) =>{
  return defHttp.put({ url: `${Api.editInfo}/${ params.id }`, params });
}