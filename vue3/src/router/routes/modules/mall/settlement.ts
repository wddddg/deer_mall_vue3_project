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
  path: '/settlement',
  name: 'Settlement',
  component: LAYOUT,
  redirect: '/settlement/basic/index',
  meta: {
    orderNo: 70,
    hideChildrenInMenu: false,
    icon: 'whh:paintroll',
    title: '结算',
    code: 'MAMA_PERMISSION_MODULE_SETTLEMENT',
  },
  children: [
    {
      path: 'basic',
      name: 'Basic',
      meta: {
        title: '结算',
        code: 'MAMA_PERMISSION_MODULE_SETTLEMENT_GROUP_SETTLEMENT',
        icon: 'ant-design:table-outlined',
      },
      redirect: '/settlement/basic/index',
      component: LAYOUT,
      children: [
        {
          path: 'index',
          name: 'BasicList',
          component: () => import('/@/views/settlement/basic/index.vue'),
          meta: {
            title: '结算汇总',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_SETTLEMENT_GROUP_SETTLEMENT_SUB_SETTLEMENT',
          },
        },
        {
          path: 'indexDetail/:path(.*)',
          name: 'IndexBasicDetail',
          component: () => import('/@/views/settlement/basic/IndexDetail.vue'),
          meta: {
            title: '查看明细',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/settlement/basic/index',
          },
        },
      ],
    },
    {
      path: 'sales',
      name: 'Sales',
      meta: {
        title: '分账',
        icon: 'ant-design:percentage-outlined',
        code: 'MAMA_PERMISSION_MODULE_SETTLEMENT_GROUP_TRADE_PROFIT_SHARING',
      },
      redirect: '/settlement/sales/index',
      component: LAYOUT,
      children: [
        {
          path: 'index',
          name: 'SalesList',
          component: () => import('/@/views/settlement/sales/index.vue'),
          meta: {
            title: '分账列表',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_SETTLEMENT_GROUP_TRADE_PROFIT_SHARING_SUB_TRADE_PROFIT_SHARING',
          },
        },
        {
          path: 'indexDetail/:path(.*)',
          name: 'IndexSalesDetail',
          component: () => import('/@/views/settlement/sales/IndexDetail.vue'),
          meta: {
            title: '详情',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/settlement/sales/index',
          },
        },
      ],
    },
  ],
};

export default setup;
