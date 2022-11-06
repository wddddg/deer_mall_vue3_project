/*
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-24 16:32:21
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-26 14:43:12
 */
import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const setup: AppRouteModule = {
  path: '/merchant',
  name: 'Merchant',
  component: LAYOUT,
  redirect: '/merchant/basic',
  meta: {
    orderNo: 20,
    hideChildrenInMenu: false,
    icon: 'whh:paintroll',
    title: '商家',
    code: 'MAMA_PERMISSION_MODULE_VENDOR',
  },
  children: [
    {
      path: 'basic',
      name: 'Basic',
      component: LAYOUT,
      meta: {
        title: '商家管理',
        icon: 'ant-design:shop-twotone',
        code: 'MAMA_PERMISSION_MODULE_VENDOR_GROUP_VENDOR',
      },
      redirect: '/merchant/basic/shop',
      children: [
        {
          path: 'shop',
          name: 'Shop',
          component: () => import('/@/views/merchant/shop/index.vue'),
          meta: {
            title: '店铺列表',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_VENDOR_GROUP_VENDOR_SUB_SHOP',
          },
        },

        {
          path: 'merchantApply',
          name: 'merchantApply',
          component: () => import('/@/views/merchant/merchant-apply/index.vue'),
          meta: {
            title: '微信商户申请',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_VENDOR_GROUP_VENDOR_SUB_SHOP_APPLYMENT',
          },
        },
        {
          path: 'operatorList',
          name: 'OperatorList',
          component: () => import('/@/views/merchant/operator-list/index.vue'),
          meta: {
            title: '经营主体列表',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_VENDOR_GROUP_VENDOR_SUB_ORGANIZATION',
          },
        },

        {
          path: 'accountList',
          name: 'accountList',
          component: () => import('/@/views/merchant/account-list/index.vue'),
          meta: {
            title: '账号列表',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_VENDOR_GROUP_VENDOR_SUB_ACCOUNT',
          },
        },
        {
          path: 'shopDetail/:path(.*)',
          name: 'ShopDetail',
          component: () => import('/@/views/merchant/shop/ShopDetail.vue'),
          meta: {
            title: '详情',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/merchant/basic/shop',
          },
        },
        {
          path: 'operatorDetail/:path(.*)',
          name: 'OperatorDetail',
          component: () => import('/@/views/merchant/operator-list/OperatorDetail.vue'),
          meta: {
            title: '详情',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/merchant/basic/operatorList',
          },
        },
        {
          path: 'accountDetail/:path(.*)',
          name: 'AccountDetail',
          component: () => import('/@/views/merchant/account-list/AccountDetail.vue'),
          meta: {
            title: '详情',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/merchant/basic/accountList',
          },
        },
      ],
    },
    {
      path: 'salesMan',
      name: 'SalesMan',
      component: LAYOUT,
      meta: {
        title: '销售员',
        icon: 'ant-design:user-outlined',
        code: 'MAMA_PERMISSION_MODULE_VENDOR_GROUP_SELLER',
      },
      redirect: '/merchant/salesMan/index',
      children: [
        {
          path: 'index',
          name: 'SalesManPage',
          component: () => import('/@/views/merchant/sales-man/index.vue'),
          meta: {
            title: '销售员列表',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_VENDOR_SUB_GROUP_SELLER',
          },
        },
        {
          path: 'rank',
          name: 'SaleRank',
          component: () => import('/@/views/merchant/rank/index.vue'),
          meta: {
            title: '销售排名',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_VENDOR_GROUP_SELLER_RANKING',
          },
        },
        {
          path: 'salesManDetail/:path(.*)',
          name: 'SalesManDetailPage',
          component: () => import('/@/views/merchant/sales-man/Detail.vue'),
          meta: {
            title: '销售员详情',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/merchant/salesMan/index',
          },
        },
        {
          path: 'salesManRankDetail/:path(.*)',
          name: 'SalesManRankDetailPage',
          component: () => import('/@/views/merchant/sales-man/Detail.vue'),
          meta: {
            title: '销售排名详情',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/merchant/salesMan/rank',
          },
        },
      ],
    },
  ],
};

export default setup;
