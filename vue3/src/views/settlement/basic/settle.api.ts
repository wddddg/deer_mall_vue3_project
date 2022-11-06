import { defHttp } from '/@/utils/http/axios';

enum Api {
  getSettleList = '/user-api/v1/mamas/buyers/actions/search',
  settleInfo = '/user-api/v1/mamas/buyers',
}

/**
 * 查看列表
 */
export const getSettleList = (params) => {
  const data = {
    ...params,
  };
  return defHttp.post({ url: Api.getSettleList, params: data });
};

export const settleInfo = (params) => {
  const url = `${Api.settleInfo}/${params}`;
  return defHttp.get({ url: url });
};
