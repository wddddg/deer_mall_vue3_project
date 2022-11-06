import { defHttp } from '/@/utils/http/axios';

enum Api {
  roleListInTable = '/user-api/v1/mamas/roles/actions/search', // 表格-角色列表
  roleDelete = '/user-api/v1/mamas/roles',
  permissionList = '/user-api/v1/mamas/permissions',
}

/**
 * 角色列表-表格
 * @param params
 */
export const roleListInTable = (params) => {
  return defHttp.post({ url: Api.roleListInTable, params });
};

/**
 * 删除角色
 * @param id
 */
export const roleDelete = (id) => {
  return defHttp.delete({ url: Api.roleDelete + '/' + id });
};

/**
 * 获取角色权限树 list
 * @param id
 */
export const rolePermissionList = () => {
  return defHttp.get({ url: Api.permissionList });
};

/**
 * 获取角色拥有的权限
 * @param id
 */
export const rolePermission = (id) => {
  return defHttp.get({ url: Api.roleDelete + '/' + id });
};

/**
 * 编辑角色权限
 * @param id
 */
export const editRolePermission = (id, params) => {
  return defHttp.put({ url: Api.roleDelete + '/' + id, params });
};

/**
 * 新增角色
 * @param params
 */
export const AddRolePermission = (params) => {
  return defHttp.post({ url: Api.roleDelete, params });
};
