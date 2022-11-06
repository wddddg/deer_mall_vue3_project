import { defHttp } from '/@/utils/http/axios';

enum Api {
  productPropertyList = '/sale-api/v1/mamas/productAttributeConfigs/actions/search',
  productAttribute = '/sale-api/v1/mamas/productAttributeConfigs',
  listProductAttributeConfigTypeSingleValueTypes = '/sale-api/v1/mamas/productAttributeConfigs/actions/listProductAttributeConfigTypeSingleValueTypes',
  deleteProductAttributeValidateById = '/sale-api/v1/mamas/productAttributeConfigs/actions/validateDelete',
}

/**
 * 查询商品属性列表
 */
export const getProductPropertyList = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.productPropertyList, params: data });
};

/**
 * 删除商品属性
 */
export const deleteProductAttributeById = (id) => {
  const url = `${Api.productAttribute}/${id}`;

  return defHttp.delete({ url, params: { id } });
};

/**
 * 新增商品属性
 */
export const createProductAttribute = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.productAttribute, params: data });
};

/**
 * 修改商品属性
 */
export const updateProductAttribute = (id, params) => {
  const url = `${Api.productAttribute}/${id}`;
  const data = {
    ...params,
  };

  return defHttp.put({ url, params: data });
};

/**
 * 多属性值能列表
 */
export const getProductAttributeConfigTypeSingleValueTypesList = () => {
  return defHttp.get({ url: Api.listProductAttributeConfigTypeSingleValueTypes });
};

/**
 * 判断多属性值能否被删除
 */
export const deleteProductAttributeValidateById = (id) => {
  const url = `${Api.deleteProductAttributeValidateById}/${id}`;

  return defHttp.get({ url });
};
