import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const setup: AppRouteModule = {
  path: '/order',
  name: 'Order',
  component: LAYOUT,
  redirect: '/order/trades',
  meta: {
    orderNo: 40,
    hideChildrenInMenu: false,
    icon: 'whh:paintroll',
    title: '订单',
    code: 'MAMA_PERMISSION_MODULE_TRADE',
  },
  children: [
    {
      path: 'trades',
      name: 'Trades',
      component: LAYOUT,
      meta: {
        title: '订单管理',
        code: 'MAMA_PERMISSION_MODULE_TRADE_GROUP_TRADE',
        icon: 'ant-design:audit-outlined',
      },
      redirect: '/order/trades/list',
      children: [
        {
          path: 'list',
          name: 'TradesList',
          component: () => import('/@/views/order/trades-list/index.vue'),
          meta: {
            title: '订单列表',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_TRADE_GROUP_TRADE_SUB_TRADE',
          },
        },

        {
          path: 'afterSales',
          name: 'AfterSales',
          component: () => import('/@/views/order/after-sales/index.vue'),
          meta: {
            title: '售后列表',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_TRADE_GROUP_TRADE_SUB_AFTER_SALE',
          },
        },

        {
          path: 'evaluate',
          name: 'Evaluate',
          component: () => import('/@/views/order/evaluate/index.vue'),
          meta: {
            title: '评价列表',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_TRADE_GROUP_TRADE_SUB_EVALUATION',
          },
        },
        {
          path: 'afterSalesDetail/:path(.*)',
          name: 'AfterSalesDetail',
          component: () => import('/@/views/order/after-sales/AfterSalesDetail.vue'),
          meta: {
            title: '详情',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/order/trades/afterSales',
          },
        },
        {
          path: 'tradesListDetail/:path(.*)',
          name: 'TradesListDetail',
          component: () => import('/@/views/order/trades-list/TradesListDetail.vue'),
          meta: {
            title: '详情',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/order/trades/list',
          },
        },
        {
          path: 'evaluateDetail/:path(.*)',
          name: 'EvaluateDetail',
          component: () => import('/@/views/order/evaluate/EvaluateDetail.vue'),
          meta: {
            title: '详情',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/order/trades/evaluate',
          },
        },
      ],
    },
    {
      path: 'sales',
      name: 'Sales',
      component: LAYOUT,
      meta: {
        title: '交易管理',
        code: 'MAMA_PERMISSION_MODULE_TRADE_GROUP_TRANSACTION',
        icon: 'ant-design:money-collect-outlined',
      },
      redirect: '/order/sales/operatin',
      children: [
        {
          path: 'operatin',
          name: 'Operatin',
          component: () => import('/@/views/order/operatin/index.vue'),
          meta: {
            title: '交易流水列表',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_TRADE_GROUP_TRANSACTION_SUB_TRANSACTION',
          },
        },

        {
          path: 'refundFlow',
          name: 'RefundFlow',
          component: () => import('/@/views/order/refund-flow/index.vue'),
          meta: {
            title: '退款流水列表',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_TRADE_GROUP_TRANSACTION_SUB_REFUND',
          },
        },
        {
          path: 'refundFlowDetail/:path(.*)',
          name: 'RefundFlowDetail',
          component: () => import('/@/views/order/refund-flow/RefundFlowDetail.vue'),
          meta: {
            title: '详情',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/order/sales/refundFlow',
          },
        },
        {
          path: 'operatinDetail/:path(.*)',
          name: 'OperatinDetail',
          component: () => import('/@/views/order/operatin/OperatinDetail.vue'),
          meta: {
            title: '详情',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/order/sales/operatin',
          },
        },
      ],
    },
  ],
};

export default setup;
