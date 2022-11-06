import { defHttp } from '/@/utils/http/axios';

enum Api {
  buyerList = '/user-api/v1/mamas/buyers/actions/search',
  buyerEdit = '/user-api/v1/mamas/buyers',
}

/**
 * 查看消费者列表
 */
export const getBuyerList = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.buyerList, params: data });
};

/**
 * 消费者详情
 */
export const getBuyerById = (id: string | number) => {
  const url = `${Api.buyerEdit}/${id}`;

  return defHttp.get({ url: url });
};

/**
 * 设为测试员
 */
export const updateBuyer = (params) => {
  const url = `${Api.buyerEdit}/${params.id}`;

  const data = {
    ...params,
  };

  return defHttp.put({ url, params: data });
};
