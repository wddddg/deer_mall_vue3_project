import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/general-api/v1/mamas/tradeProfitSharingSales/actions/ranking',
  saleInfo = '/general-api/v1/mamas/tradeProfitSharing/actions/search',
  detail = '/general-api/v1/mamas/tradeProfitSharingSales/actions/count/',
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
