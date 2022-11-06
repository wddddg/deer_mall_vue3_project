import { defHttp } from '/@/utils/http/axios';

enum Api {
  getChatNotReadTotalCount = '/general-api/v1/mamas/chats/actions/notReadTotalCount',
}

/**
 * 查询未读总数(根据类型)
 */
export const getChatNotReadTotalCount = (params) => {
  const data = {
    ...params,
  };

  return defHttp.post({ url: Api.getChatNotReadTotalCount, params: data });
};
