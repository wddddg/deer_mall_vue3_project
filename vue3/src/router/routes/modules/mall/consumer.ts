import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const setup: AppRouteModule = {
  path: '/consumer',
  name: 'Consumer',
  component: LAYOUT,
  redirect: '/consumer/basic',
  meta: {
    orderNo: 60,
    hideChildrenInMenu: false,
    icon: 'whh:paintroll',
    title: '消费者',
    code: 'MAMA_PERMISSION_MODULE_BUYER',
  },
  children: [
    {
      path: 'basic',
      name: 'Basic',
      component: LAYOUT,
      meta: {
        title: '消费者管理',
        code: 'MAMA_PERMISSION_MODULE_BUYER_GROUP_BUYER',
        icon: 'ant-design:team-outlined',
      },
      redirect: '/consumer/basic/list',
      children: [
        {
          path: 'list',
          name: 'ConsumerList',
          component: () => import('/@/views/consumer/list/index.vue'),
          meta: {
            title: '消费者列表',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_BUYER_GROUP_BUYER_SUB_ACCOUNT',
          },
        },
        {
          path: 'consumerDetail/:path(.*)',
          name: 'ConsumerDetail',
          component: () => import('/@/views/consumer/list/ConsumerDetail.vue'),
          meta: {
            title: '详情',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/consumer/basic/list',
          },
        },
      ],
    },
  ],
};

export default setup;
