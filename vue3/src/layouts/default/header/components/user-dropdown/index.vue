<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          <!-- {{ getUserInfo.name }} -->
        </span>
      </span>
    </span>

    <template #overlay>
      <div class="user-module">
        <div class="user-module-main">
          <div class="user-module-body">
            <div class="user-module-info">
              <div class="text-ellipsis">{{ getUserInfo.name }}</div>
              <div class="_text">账号ID：{{ getUserInfo.mobile }}</div>
              <div class="_item" v-for="item in getUserInfo.roles">{{ item.name }}</div>
            </div>
            <div class="module-button" v-if="hasPermission('MAMA_CHAT')">
              <div class="flex_start">
                <div>客服</div>
                <div
                  class="text-ellipsis-1"
                  style="color: #999; max-width: 180px; padding-left: 10px"
                >
                  {{ getUserInfo.nickName }}
                </div>
              </div>
              <a-switch
                v-model:checked="checkedValue"
                @change="changeCustomerState"
                checkedValue="ONLINE"
                unCheckedValue="OFFLINE"
                checked-children="在线"
                un-checked-children="离线"
              />
            </div>
          </div>
        </div>
        <div class="user-module-footer">
          <Menu @click="handleMenuClick">
            <MenuItem
              key="doc"
              :text="t('layout.header.dropdownItemDoc')"
              icon="ion:document-text-outline"
              v-if="getShowDoc"
            />
            <MenuDivider v-if="getShowDoc" />
            <MenuItem
              v-if="getUseLockPage"
              key="lock"
              :text="t('layout.header.tooltipLock')"
              icon="ion:lock-closed-outline"
            />
            <MenuItem key="pwd" text="修改密码" icon="" />
            <a-divider style="margin: 0" />
            <MenuItem
              key="logout"
              :text="t('layout.header.dropdownItemLoginOut')"
              icon="ion:power-outline"
            />
          </Menu>
        </div>
      </div>
    </template>
  </Dropdown>
  <a-modal
    v-model:visible="visible"
    title="在线客服"
    ok-text="确认"
    cancel-text="取消"
    @cancel="closeModal"
    @ok="hideModal"
  >
    <div style="padding: 25px 25px 30px; color: #838681">
      <p>客服下线后将不会收到用户发送的信息，</p>
      <p>确定要下线吗？</p>
    </div>
  </a-modal>
  <LockAction @register="register" />
  <PropertyModal @register="registerEditModal" @success="handleSuccess" />
</template>
<script lang="ts">
  // components
  import { Divider, Dropdown, Menu, Switch, Modal } from 'ant-design-vue';
  import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';

  import { reactive, defineComponent, computed, ref } from 'vue';

  import { DOC_URL } from '/@/settings/siteSetting';

  import { useUserStore } from '/@/store/modules/user';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';

  import headerImg from '/@/assets/images/header.jpg';
  import { propTypes } from '/@/utils/propTypes';
  import { openWindow } from '/@/utils';
  import { changeStatusCode } from '/@/api/sys/user';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useLoginState, LoginStateEnum } from '/@/views/sys/login/useLogin';
  import PropertyModal from './PropertyModal.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  type MenuEvent = 'logout' | 'doc' | 'lock' | 'pwd';

  export default defineComponent({
    name: 'UserDropdown',
    components: {
      PropertyModal,
      Modal,
      Divider,
      Switch,
      Dropdown,
      Menu,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      MenuDivider: Menu.Divider,
      LockAction: createAsyncComponent(() => import('../lock/LockModal.vue')),
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown');
      const { t } = useI18n();
      const { getShowDoc, getUseLockPage } = useHeaderSetting();
      const userStore = useUserStore();
      const { setLoginState, getLoginState } = useLoginState();
      const visible = ref<boolean>(false);
      const { hasPermission } = usePermission();
      const changeCustomerState = async (e) => {
        if (e == 'OFFLINE') {
          checkedValue.value = 'ONLINE';
          visible.value = true; //显示弹出框
        } else {
          const data = await changeStatusCode();
          userStore.setUserInfo(data);
          checkedValue.value = 'ONLINE';
          visible.value = false;
        }
      };

      const hideModal = async () => {
        const data = await changeStatusCode();
        userStore.setUserInfo(data);
        visible.value = false;
        checkedValue.value = 'OFFLINE';
      };
      const closeModal = async () => {
        visible.value = false;
      };

      const getUserInfo = computed(() => {
        const { roles, statusCode, name, nickName, mobile, avatar, desc } =
          userStore.getUserInfo || {};
        return { roles, statusCode, name, nickName, mobile, avatar: avatar || headerImg, desc };
      });
      const checkedValue = ref(userStore.getUserInfo.statusCode || 'ONLINE');

      // console.log(22, userStore.getUserInfo.statusCode);
      const [register, { openModal }] = useModal();
      const [registerEditModal, { openModal: openDeleteModal }] = useModal();

      function handleLock() {
        openModal(true);
      }

      //  login out
      function handleLoginOut() {
        userStore.confirmLoginOut();
      }

      // open doc
      function openDoc() {
        openWindow(DOC_URL);
      }
      // change  passwad
      function changePwd() {
        openDeleteModal(true);
      }
      /**
       * 成功回调
       */
      function handleSuccess() {
        // setLoginState(LoginStateEnum.RESET_PASSWORD);
        userStore.logout(true);
      }

      function handleMenuClick(e: MenuInfo) {
        switch (e.key as MenuEvent) {
          case 'logout':
            handleLoginOut();
            break;
          case 'doc':
            openDoc();
            break;
          case 'lock':
            handleLock();
            break;
          case 'pwd':
            changePwd();
            break;
        }
      }

      return {
        hasPermission,
        changeCustomerState,
        checkedValue,
        // ...state,
        visible,
        hideModal,
        prefixCls,
        t,
        getUserInfo,
        handleMenuClick,
        getShowDoc,
        register,
        getUseLockPage,
        setLoginState,
        registerEditModal,
        handleSuccess,
        closeModal,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
  .user-module {
    width: 318px;
    background: #fff;
    border-radius: 6px;
  }
  .user-module-main {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .user-module-body {
    // height: calc(100% - 40px);
    width: 100%;
    color: #333;

    ul li {
      height: 48px;
      border-top: 1px solid #f2f2f2;
      font-size: 14px;

      > p {
        padding: 0 15px;
        margin: 5px 0;
        height: 38px;
        line-height: 38px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // background: #F5F7F9;
      }
    }

    ul li:hover {
      background: #f5f7f9;
      cursor: pointer;
    }

    .user-module-info {
      padding: 6px 12px 10px 12px;
      line-height: 24px;
      background: #f4f6f7;

      ._text {
        color: #999;
        line-height: 36px;
      }

      ._item {
        display: inline-block;
        padding: 2px 8px;
        color: #fff;
        background: #3395ff;
        border-radius: 3px;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        margin-right: 8px;
      }
    }
  }

  .user-module-footer {
    height: 50px;
    line-height: 50px;
    width: 100%;
    color: #333;
    padding: 0px;
    border-top: 1px solid #f2f2f2;

    ._hover {
      &:hover {
        height: 30px;
        line-height: 30px;
        background: #fbfbfb;
        border: 1px solid #f2f2f2;
        margin: 10px 0;
        cursor: pointer;
      }
    }
  }
  .flex_start {
    display: flex;
    align-items: center;
  }
  .module-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 10px;
  }
  :deep(.user-module-footer .ant-divider-horizontal) {
    margin: 0 !important;
  }
</style>
