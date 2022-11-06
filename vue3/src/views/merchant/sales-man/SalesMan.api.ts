import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/user-api/v1/mamas/buyers/actions/search',
  saleInfo = '/general-api/v1/mamas/tradeProfitSharingSales/actions/search',
  detail = '/general-api/v1/mamas/tradeProfitSharingSales/actions/count/',
  shareStats = '/general-api/v1/mamas/shareStats/actions/search/',
}

/**
 * 获取账号信息
 * @param params
 */
export const getDetailByID = (id) => {
  return defHttp.get({ url: Api.detail + id });
};

export const saleInfo = (params) => {
  const data = {
    ...params,
  };
  return defHttp.post({ url: Api.saleInfo, params: data });
};

export const listIng = (params) => {
  const data = {
    ...params,
  };
  return defHttp.post({ url: Api.saleInfo, params: data });
};

export const list = (params) => {
  const data = {
    ...params,
  };
  return defHttp.post({ url: Api.list, params: data });
};

export const shareStats = (params) => {
  const data = {
    ...params,
  };
  return defHttp.post({ url: Api.shareStats, params: data });
};
