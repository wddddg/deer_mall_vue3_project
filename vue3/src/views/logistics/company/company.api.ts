import { defHttp } from '/@/utils/http/axios';

enum Api {
  tradeLogisticsCompanies = '/sale-api/v1/mamas/tradeLogisticsCompanies',
}

/**
 * 查看快递公司列表
 */
export const getTradeLogisticsCompaniesList = (params) => {
  const data = {
    ...params,
  };

  return defHttp.get({ url: Api.tradeLogisticsCompanies, params: data });
};

/**
 * 编辑快递公司
 */
export const save = (params) => {
  let url = `${Api.tradeLogisticsCompanies}`;
  const data = {
    ...params,
  };
  if (data.id && data.id > 0) {
    url += `/${params.id}`;

    return defHttp.put({ url, params: data });
  } else {
    delete data['id'];

    return defHttp.post({ url, params: data });
  }
};

/**
 * 删除快递公司
 */
export const deleteComany = (id) => {
  const url = `${Api.tradeLogisticsCompanies}/${id}`;

  return defHttp.delete({ url });
};
