import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const setup: AppRouteModule = {
  path: '/goods',
  name: 'Goods',
  component: LAYOUT,
  redirect: '/goods/basic',
  meta: {
    orderNo: 30,
    hideChildrenInMenu: false,
    icon: 'whh:paintroll',
    title: '商品',
    code: 'MAMA_PERMISSION_MODULE_PRODUCT',
  },
  children: [
    {
      path: 'basic',
      name: 'Basic',
      component: LAYOUT,
      meta: {
        title: '商品管理',
        code: 'MAMA_PERMISSION_MODULE_PRODUCT_GROUP_PRODUCT',
        icon: 'ant-design:shopping-outlined',
      },
      redirect: '/goods/basic/list',
      children: [
        {
          path: 'list',
          name: 'GoodList',
          component: () => import('/@/views/goods/list/index.vue'),
          meta: {
            title: '商品列表',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_PRODUCT_GROUP_PRODUCT_SUB_PRODUCT',
          },
        },

        {
          path: 'category',
          name: 'GoodCategory',
          component: () => import('/@/views/goods/category/index.vue'),
          meta: {
            title: '商品分类',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_PRODUCT_GROUP_PRODUCT_SUB_CATEGORY',
          },
        },
        {
          path: 'property',
          name: 'GoodProperty',
          component: () => import('/@/views/goods/property/index.vue'),
          meta: {
            title: '商品属性',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_PRODUCT_GROUP_PRODUCT_SUB_ATTRIBUTE_CONFIG',
          },
        },
        {
          path: 'productDetail/:path(.*)',
          name: 'ProductDetail',
          component: () => import('/@/views/goods/list/ProductDetail.vue'),
          meta: {
            title: '详情',
            icon: 'whh:paintroll',
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/goods/basic/list',
          },
        },
      ],
    },
  ],
};

export default setup;
