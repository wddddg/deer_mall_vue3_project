import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const setup: AppRouteModule = {
  path: '/chat',
  name: 'Chat',
  component: LAYOUT,
  redirect: '/chat/basic/chatRecord',
  meta: {
    orderNo: 130,
    hideChildrenInMenu: false,
    icon: 'whh:paintroll',
    title: '会话',
    code: 'MAMA_PERMISSION_MODULE_CHAT',
  },
  children: [
    {
      path: 'basic',
      name: 'Basic',
      component: LAYOUT,
      meta: {
        title: '会话管理',
        code: 'MAMA_PERMISSION_MODULE_CHAT_GROUP_CHAT',
        icon: 'ant-design:message-outlined',
      },
      redirect: '/chat/basic/chatRecord',
      children: [
        {
          path: 'chatRecord/:path(.*)',
          name: 'ChatRecord',
          component: () => import('/@/views/chat/chat-record/index.vue'),
          meta: {
            title: '会话记录',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_CHAT_GROUP_CHAT_SUB_CHAT',
          },
        },
      ],
    },
    {
      path: 'platform',
      name: 'Platform',
      component: LAYOUT,
      meta: {
        title: '平台客服',
        code: 'MAMA_PERMISSION_MODULE_CHAT_MAMA_CHAT',
        icon: 'ant-design:customer-service-outlined',
      },
      redirect: '/chat/platform/chatCustomer',
      children: [
        {
          path: 'chatCustomer',
          name: 'ChatCustomer',
          component: () => import('/@/views/chat/chat-customer/index.vue'),
          meta: {
            title: '客户服务',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_CHAT_GROUP_CHAT_SUB_MAMA_CHAT',
          },
        },
        {
          path: 'chatCustomerRecord',
          name: 'ChatCustomerRecord',
          component: () => import('/@/views/chat/chat-customer-record/index.vue'),
          meta: {
            title: '聊天记录',
            icon: 'whh:paintroll',
            hideMenu: false,
            code: 'MAMA_PERMISSION_MODULE_CHAT_GROUP_CHAT_SUB_CHAT_RECORD',
          },
        },
      ],
    },
  ],
};

export default setup;
