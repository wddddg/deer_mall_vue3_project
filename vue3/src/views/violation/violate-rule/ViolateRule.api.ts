import { defHttp } from '/@/utils/http/axios';

enum Api {
  tradesList = '/general-api/v1/mamas/tickets/actions/search',
  // statusTypesList = '/general-api/v1/mamas/trades/actions/listStatusTypes',
  // getTradeDetail = '/general-api/v1/mamas/trades',
}

/**
 * 查询订单列表
 */
export const getTradesList = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.tradesList, params: data });
};

// /**
//  * 获取订单状态列表
//  */
// export const getStatusTypesList = () => {
//   return defHttp.get({ url: Api.statusTypesList });
// };

// /**
//  * 获取订单信息
//  */
// export const getTradeDetail = (tradeId: string | number) => {
//   const url = `${Api.getTradeDetail}/${tradeId}`;

//   return defHttp.get({ url });
// };
