import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/dashboard',
  name: 'shouye',
  component: LAYOUT,
  // component: () => import('/@/views/dashboard/analysis/index.vue'),
  redirect: '/dashboard/analysis',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: '工作台',
    code: 'MAMA_PERMISSION_MODULE_WORKBENCH',
    // hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'analysis',
      name: 'Analysis',
      component: () => import('/@/views/dashboard/analysis/index.vue'),
      meta: {
        // affix: true,
        title: '工作台',
        // hideMenu: true,
      },
    },
    // {
    //   path: 'workbench',
    //   name: 'Workbench',
    //   component: () => import('/@/views/dashboard/workbench/index.vue'),
    //   meta: {
    //     title: t('routes.dashboard.analysis'),
    //   },
    // },
  ],
};

export default dashboard;
