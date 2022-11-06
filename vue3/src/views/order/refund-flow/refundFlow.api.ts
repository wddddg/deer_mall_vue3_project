import { defHttp } from '/@/utils/http/axios';

enum Api {
  organizationsList = '/user-api/v1/mamas/organizations/actions/search',
  organizationReviewStatusTypesTypesList = '/user-api/v1/mamas/organizations/actions/listOrganizationReviewStatusTypes',
}

/**
 * 查询经营主体列表
 */
export const getOrganizationsList = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.organizationsList, params: data });
};

/**
 * 查询经营主体审核状态
 */
export const getOrganizationReviewStatusTypesTypesList = () => {
  return defHttp.get({ url: Api.organizationReviewStatusTypesTypesList });
};
