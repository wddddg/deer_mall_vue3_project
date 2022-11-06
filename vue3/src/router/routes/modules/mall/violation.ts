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
  path: '/violation',
  name: 'Violation',
  component: LAYOUT,
  redirect: '/violation/basic/index',
  meta: {
    orderNo: 120,
    hideChildrenInMenu: false,
    icon: 'whh:paintroll',
    title: '违规',
  },
  children: [
    {
      path: 'basic',
      name: 'Basic',
      component: LAYOUT,
      meta: {
        title: '违规处罚',
        icon: 'ant-design:info-circle-outlined',
      },
      redirect: '/violation/basic/index',
      children: [
        {
          path: 'index',
          name: 'ViolateRule',
          component: () => import('/@/views/violation/violate-rule/index.vue'),
          meta: {
            title: '店铺违规',
            hideMenu: false,
          },
        },
      ],
    },
  ],
};

export default setup;
