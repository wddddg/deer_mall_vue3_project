import { defHttp } from '/@/utils/http/axios';

enum Api {
  reviewsList = '/general-api/v1/mamas/tradeProductBuyerReviews/actions/search',
  listGrades = '/general-api/v1/mamas/tradeProductBuyerReviews/actions/listGrades',
  getReviewsDetail = '/general-api/v1/mamas/tradeProductBuyerReviews',
}

/**
 * 查询评价列表
 */
export const getReviewsList = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.reviewsList, params: data });
};

/**
 * 查询评价等级
 */
export const getListGrades = () => {
  return defHttp.get({ url: Api.listGrades });
};

/**
 * 查看评价详情
 */
export const getReviewsDetail = (id: string | number) => {
  const url = `${Api.getReviewsDetail}/${id}`;

  return defHttp.get({ url });
};
