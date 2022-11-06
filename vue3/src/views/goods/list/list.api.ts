import { defHttp } from '/@/utils/http/axios';

enum Api {
  productList = '/general-api/v1/mamas/products/actions/search',
  productTypeCodeList = '/sale-api/v1/everyone/products/actions/listTypeCodes',
  productById = '/general-api/v1/mamas/products/',
  productCategories = '/sale-api/v1/mamas/productCategories/actions/search',
}

/**
 * 商品列表
 */
export const getProductList = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.productList, params: data });
};

/**
 * 商品详情
 */
export const getProductById = (productId: string | number) => {
  const url = `${Api.productById}${productId}`;

  return defHttp.get({ url: url });
};

/**
 * 商品类型列表
 */
export const getProductTypeCodeList = () => {
  return defHttp.get({ url: Api.productTypeCodeList });
};

/**
 * 商品分类列表
 */
export const getProductCategories = () => {
  return defHttp.post({ url: Api.productCategories });
};
