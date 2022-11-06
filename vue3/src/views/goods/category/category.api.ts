import { defHttp } from '/@/utils/http/axios';

enum Api {
  productCategoryList = '/sale-api/v1/mamas/productCategories/actions/search',
  deleteProductCategoriesById = '/sale-api/v1/mamas/productCategories',
  productCategoriesSort = '/sale-api/v1/mamas/productCategories/actions/sort',
  productCategoriesMerge = '/sale-api/v1/mamas/productCategories/actions/merge',
  getProductAttributeList = '/sale-api/v1/mamas/productAttributeConfigs/actions/search',
}

/**
 * 查询商品属性列表
 */
export const getProductAttributeList = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.getProductAttributeList, params: data });
};

/**
 * 商品分类列表
 * @param params
 */
export const getProductCategoryList = (params: { name: string }) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.productCategoryList, params: data });
};

/**
 * 删除分类
 * @param 分类id
 */
export const deleteProductCategoriesById = (id: string) => {
  const url = `${Api.deleteProductCategoriesById}/${id}`;

  return defHttp.delete({ url: url });
};

/**
 * 修改商品分类信息
 */
export const updateProductCategoriesByID = (params) => {
  const url = `${Api.deleteProductCategoriesById}/${params.id}`;
  const data = {
    ...params,
  };

  return defHttp.put({ url, params: data });
};

/**
 * 创建商品分类
 * @param postData.parentId 父级ID
 * @param postData.name 分类名称
 * @param postData.tempLogoUrl tempLogoUrl
 * @param postData.orderId 排序ID
 * @param postData.productAttachable 是否为末端分类
 */
export const createProductCategories = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.deleteProductCategoriesById, params: data });
};

/**
 * 查询商品分类信息
 */
export const getProductCategories = (id) => {
  const url = `${Api.deleteProductCategoriesById}/${id}`;

  return defHttp.get({ url });
};

/**
 * 分类排序
 */
export const productCategoriesSort = (params) => {
  const data = {
    ...params,
  };

  return defHttp.put({ url: Api.productCategoriesSort, params: data });
};

/**
 * 合并分类
 */
export const productCategoriesMerge = (params) => {
  const data = {
    ...params,
  };

  return defHttp.put({ url: Api.productCategoriesMerge, params: data });
};
