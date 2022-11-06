import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const setup: AppRouteModule = {
  path: '/logistics',
  name: 'Logistics',
  component: LAYOUT,
  redirect: '/logistics/basic/company',
  meta: {
    orderNo: 50,
    hideChildrenInMenu: false,
    icon: 'whh:paintroll',
    title: '物流',
  },
  children: [
    {
      path: 'basic',
      name: 'Basic',
      component: LAYOUT,
      meta: {
        title: '物流管理',
        icon: 'ant-design:audit-outlined',
      },
      redirect: '/logistics/basic/company',
      children: [
        {
          path: 'company',
          name: 'Company',
          component: () => import('/@/views/logistics/company/index.vue'),
          meta: {
            title: '物流公司列表',
            icon: 'whh:paintroll',
            hideMenu: false,
          },
        },
      ],
    },
  ],
};

export default setup;
