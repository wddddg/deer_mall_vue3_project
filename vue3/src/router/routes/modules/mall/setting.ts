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
  path: '/setting',
  name: 'Setting',
  component: LAYOUT,
  redirect: '/setting/basic/index',
  meta: {
    orderNo: 90,
    hideChildrenInMenu: false,
    icon: 'whh:paintroll',
    title: '配置',
    code: 'MAMA_PERMISSION_MODULE_CONFIG',
  },
  children: [
    {
      path: 'basic',
      name: 'Basic',
      component: LAYOUT,
      meta: {
        title: '配置管理',
        code: 'MAMA_PERMISSION_MODULE_CONFIG_GROUP_CONFIG',
        icon: 'ant-design:setting-outlined',
      },
      redirect: '/setting/basic/index',
      children: [
        {
          path: 'index',
          name: 'ExportQueuePage',
          component: () => import('/@/views/setting/export-queue/index.vue'),
          meta: {
            title: '导出队列',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_CONFIG_GROUP_CONFIG_SUB_EXPORT',
          },
        },
        {
          path: 'base',
          name: 'Base',
          component: () => import('/@/views/setting/base/index.vue'),
          meta: {
            title: '基础配置',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_CONFIG_GROUP_CONFIG_SUB_CONFIG',
          },
        },
        {
          path: 'agreement',
          name: 'Agreement',
          component: () => import('/@/views/setting/agreement/index.vue'),
          meta: {
            title: '协议管理',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_CONFIG_GROUP_CONFIG_SUB_AGREEMENT',
          },
        },
      ],
    },
  ],
};

export default setup;
