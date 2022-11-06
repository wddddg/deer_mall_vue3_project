import { defHttp } from '/@/utils/http/axios';

enum Api {
  tradeAfterSalesList = '/general-api/v1/mamas/tradeAfterSales/actions/search',
  listCurrentStatusCodes = '/general-api/v1/mamas/tradeAfterSales/actions/listCurrentStatusCodes',
  getTradeAfterSalesDetail = '/general-api/v1/mamas/tradeAfterSales',
}

/**
 * 查询退款/售后列表
 */
export const getTradeAfterSalesList = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.tradeAfterSalesList, params: data });
};

/**
 * 获取订单状态列表
 */
export const getListCurrentStatusCodes = () => {
  return defHttp.get({ url: Api.listCurrentStatusCodes });
};

/**
 * 查看退款/售后详情
 */
export const getTradeAfterSalesDetail = (id: string | number) => {
  const url = `${Api.getTradeAfterSalesDetail}/${id}`;

  return defHttp.get({ url });
};
