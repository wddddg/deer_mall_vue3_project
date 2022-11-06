import { defHttp } from '/@/utils/http/axios';

enum Api {
  getSalesList = '/general-api/v1/mamas/tradeProfitSharing/actions/search',
  salesInfo = '/general-api/v1/mamas/tradeProfitSharing',
  exportXls = '/general-api/v1/mamas/tradeProfitSharing/actions/export',
  getShopList = '/general-api/v1/mamas/shops/actions/search'
}

/**
 * 查看列表
 */
export const getSalesList = (params) => {
  return defHttp.post({ url: Api.getSalesList, params });
};

export const salesInfo = (params) => {
  const url = `${Api.salesInfo}/${params}`;
  return defHttp.get({ url: url });
};
/**
 * 导出
 */
export const exportXls = (params) => {
  return defHttp.post({ url: Api.exportXls, params });
};

/**
 * 查询商家信息
 */
export const getShopList = (params) => {
  return defHttp.post({ url: Api.getShopList, params });
};
