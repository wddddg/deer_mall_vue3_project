/*
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-24 16:32:21
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-24 17:41:58
 */
import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const setup: AppRouteModule = {
  path: '/management',
  name: 'Management',
  component: LAYOUT,
  redirect: '/merchant/account',
  meta: {
    orderNo: 110,
    hideChildrenInMenu: false,
    icon: 'whh:paintroll',
    title: '权限',
    code: 'MAMA_PERMISSION_MODULE_PERMISSION',
  },
  children: [
    {
      path: 'account',
      name: 'Account',
      component: LAYOUT,
      meta: {
        title: '权限管理',
        code: 'MAMA_PERMISSION_MODULE_PERMISSION_GROUP_PERMISSION',
        icon: 'ant-design:key-outlined',
      },
      redirect: '/management/account/index',
      children: [
        {
          path: 'index',
          name: 'AccountPage',
          component: () => import('/@/views/management/account/index.vue'),
          meta: {
            title: '账号管理',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_PERMISSION_GROUP_PERMISSION_SUB_ACCOUNT',
          },
        },
        {
          path: 'role',
          name: 'RolePage',
          component: () => import('/@/views/management/role/index.vue'),
          meta: {
            title: '角色管理',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_PERMISSION_GROUP_PERMISSION_SUB_ROLE',
          },
        },
        {
          path: 'rolePermission/:path(.*)',
          name: 'RolePermission',
          component: () => import('/@/views/management/role/RoleDetail.vue'),
          meta: {
            title: '详情',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/management/account/role',
          },
        },
      ],
    },
  ],
};

export default setup;
