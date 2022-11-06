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
  path: '/marketing',
  name: 'Marketing',
  component: LAYOUT,
  redirect: '/marketing/basic/index',
  meta: {
    orderNo: 100,
    hideChildrenInMenu: false,
    icon: 'whh:paintroll',
    title: '营销',
  },
  children: [
    {
      path: 'basic',
      name: 'Basic',
      component: LAYOUT,
      meta: {
        title: '营销管理',
        icon: 'icon-park-outline:market-analysis',
      },
      redirect: '/marketing/basic/index',
      children: [
        {
          path: 'index',
          name: 'ShopCoupon',
          component: () => import('/@/views/market/shop-coupon/index.vue'),
          meta: {
            title: '商家优惠券',
            icon: 'whh:paintroll',
            hideMenu: false,
          },
        },
        {
          path: 'platform',
          name: 'Platform',
          component: () => import('/@/views/market/platform/index.vue'),
          meta: {
            title: '平台优惠券',
            icon: 'whh:paintroll',
            hideMenu: false,
          },
        },
      ],
    },
  ],
};

export default setup;
