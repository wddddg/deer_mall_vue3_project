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
  path: '/feedback',
  name: 'FeedBack',
  component: LAYOUT,
  redirect: '/feedback/manage/customer',
  meta: {
    orderNo: 80,
    hideChildrenInMenu: false,
    icon: 'whh:paintroll',
    title: '反馈',
    code: 'MAMA_PERMISSION_MODULE_FEEDBACK',
  },
  children: [
    {
      path: 'manage',
      name: 'Manage',
      component: LAYOUT,
      meta: {
        title: '意见反馈',
        code: 'MAMA_PERMISSION_MODULE_FEEDBACK_GROUP_FEEDBACK',
        icon: 'ant-design:mail-outlined',
      },
      redirect: '/feedback/manage/customer',
      children: [
        {
          path: 'customer',
          name: 'Customer',
          component: () => import('/@/views/feedback/customer/index.vue'),
          meta: {
            title: '消费者反馈',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_FEEDBACK_GROUP_FEEDBACK_SUB_BUYER',
          },
        },

        {
          path: 'trade',
          name: 'Trade',
          component: () => import('/@/views/feedback/trade/index.vue'),
          meta: {
            title: '商家反馈',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_FEEDBACK_GROUP_FEEDBACK_SUB_VENDOR',
          },
        },
        {
          path: 'tradeDetail/:path(.*)',
          name: 'TradeDetail',
          component: () => import('/@/views/feedback/trade/TradeDetail.vue'),
          meta: {
            title: '商家反馈',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/feedback/manage/trade',
          },
        },
        {
          path: 'detail/:path(.*)',
          name: 'Detail',
          component: () => import('../../../../views/feedback/customer/CustomerDetail.vue'),
          meta: {
            title: '详情',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/feedback/manage/customer',
          },
        },
      ],
    },
  ],
};

export default setup;
