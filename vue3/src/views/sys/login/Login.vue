<template>
  <div style="height: 100%" :class="prefixCls">
    <div class="relative w-full h-full" style="overflow-y: scroll">
      <ForgetPasswordForm />
      <div class="login-page" v-if="getShow">
        <div class="flex_center">
          <div class="login-box">
            <div class="switch_QRCode_login"></div>
            <div class="login_logo"><img src="../../../assets//images/logo.png" /></div>
            <div class="login_title">欢迎使用收藏鹿后台管理系统</div>
            <div class="flex_start login_tab">
              <div class="tab_item" :class="{ _active: activeTab == 1 }" @click="changeTab(1)">
                密码登录</div
              >
              <div class="tab_item" :class="{ _active: activeTab == 2 }" @click="changeTab(2)">
                短信登录</div
              >
            </div>
            <div v-if="activeTab == 1">
              <Form
                class="p-4 enter-x"
                :model="formData"
                :rules="getFormRules"
                ref="formRef"
                @keypress.enter="handleLogin"
              >
                <FormItem name="account" class="enter-x">
                  <Input
                    size="large"
                    v-model:value="formData.account"
                    :placeholder="t('sys.login.userName')"
                    class="fix-auto-fill"
                  />
                </FormItem>
                <FormItem name="password" class="enter-x">
                  <InputPassword
                    size="large"
                    visibilityToggle
                    v-model:value="formData.password"
                    :placeholder="t('sys.login.password')"
                  />
                </FormItem>

                <ARow class="enter-x">
                  <ACol :span="12">
                    <FormItem>
                      <Checkbox v-model:checked="rememberMe" size="small">
                        <!-- {{ t('sys.login.rememberMe') }} -->
                        记住密码
                      </Checkbox>
                    </FormItem>
                  </ACol>
                  <ACol :span="12">
                    <FormItem :style="{ 'text-align': 'right' }">
                      <Button
                        type="link"
                        size="small"
                        class="forget-password-text"
                        @click="setLoginState(LoginStateEnum.RESET_PASSWORD)"
                      >
                        <!--  @click="forgetPwd" {{ t('sys.login.forgetPassword') }} -->
                        忘记密码
                      </Button>
                    </FormItem>
                  </ACol>
                </ARow>
                <FormItem class="enter-x">
                  <Button
                    type="primary"
                    size="large"
                    block
                    @click="handleLogin"
                    :loading="loading"
                    class="_confirm"
                  >
                    {{ t('sys.login.loginButton') }}
                  </Button>
                </FormItem>
              </Form>
            </div>
            <MobileForm v-if="activeTab == 2" />
          </div>
        </div>
      </div>
    </div>
    <div class="footr">
      <p style="margin-bottom: 0px"> Test&nbsp;&nbsp;&nbsp;版本：0.0.2 </p> © 收藏鹿&nbsp;&nbsp;
      <a href="http://beian.miit.gov.cn/" target="_blank">粤ICP备15032111号</a>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';
  import { AppLogo } from '/@/components/Application';
  import { AppLocalePicker, AppDarkModeToggle } from '/@/components/Application';
  import LoginForm from './LoginForm.vue';
  import ForgetPasswordForm from './ForgetPasswordForm.vue';
  import RegisterForm from './RegisterForm.vue';
  import MobileForm from './MobileForm.vue';
  import QrCodeForm from './QrCodeForm.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLocaleStore } from '/@/store/modules/locale';
  import { Checkbox, Form, Input, Row, Col, Button, Divider } from 'ant-design-vue';
  import {
    GithubFilled,
    WechatFilled,
    AlipayCircleFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
  } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });

  for (let i = 1; i < 100; i++) {
    clearInterval(i);
  }

  const globSetting = useGlobSetting();
  const { prefixCls } = useDesign('login');
  const localeStore = useLocaleStore();
  const showLocale = localeStore.getShowPicker;
  const title = computed(() => globSetting?.title ?? '');
  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);
  const isShowForget = ref(false);
  const activeTab = ref(1);

  const formData = reactive({
    account: '',
    password: '',
  });

  function changeTab(key) {
    activeTab.value = key;
  }

  const { validForm } = useFormValid(formRef);

  //onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        password: data.password,
        mobile: data.account,
        mode: 'none', //不要默认的错误提示
      });
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.name}`,
          duration: 3,
        });
      }
    } catch (error) {
      const { createMessage } = useMessage();
      createMessage.error(error.response.data.message);
      // createErrorModal({
      //   title: t('sys.api.errorTip'),
      //   content: error.response.data.message,
      //   getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      // });
    } finally {
      loading.value = false;
    }
  }

  // const forgetPwd = () => {
  //   isShowForget.value = !isShowForget.value;
  // };
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @logo-prefix-cls: ~'@{namespace}-app-logo';
  @countdown-prefix-cls: ~'@{namespace}-countdown-input';
  @dark-bg: #293146;
  .forget-password-text {
    font-size: 14px;
    color: #007bff;
    line-height: 19px;
    cursor: pointer;
  }
  ._confirm {
    box-shadow: 0 3px 14px rgb(192 34 53 / 30%);
    border-radius: 10px;
  }
  .login_tab {
    padding: 25px 0 30px;
    display: flex;
    align-items: center;
  }
  .login-box .login_tab .tab_item {
    color: #b8b8b8;
    font-size: 18px;
    line-height: 20px;
    margin-right: 20px;
    position: relative;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
    cursor: pointer;
    z-index: 99;
    &:last-child {
      margin-right: 0;
    }
  }
  .login-box .login_tab .tab_item._active {
    color: #323233;
    font-size: 20px;
  }

  .login-box .login_tab .tab_item._active:after {
    content: '';
    position: absolute;
    width: 32px;
    height: 4px;
    background-color: #c02235;
    border-radius: 4px;
    bottom: -10px;
    left: calc(50% - 16px);
  }

  .flex_center,
  .flex_center-top {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: center;
    justify-content: center;
  }
  .switch_QRCode_login {
    width: 74px;
    height: 69px;
    background: url(/@/assets/images/QR_code.png) no-repeat 100% 0;
    position: absolute;
    top: 0;
    right: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
  }
  .login_logo {
    text-align: center;
    padding-bottom: 20px;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
  }
  .login_logo img {
    width: 55px;
    margin: 0 auto;
  }
  .forget-password-box .login_title,
  .login-box .login_title {
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: #323233;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
  }
  .forget-password-box,
  .login-box {
    position: absolute;
    top: calc(50% - 255px);
    width: 421px;
    height: auto;
    background: #fff;
    padding: 35px 60px 40px;
    box-shadow: 0 3px 6px rgb(0 0 0 / 16%);
    border-radius: 4px;
  }

  .login-page {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(/@/assets/images/login-bg.jpg) no-repeat 0;
    background-size: contain;
    min-width: 1100px;
    min-height: 860px;
  }

  .footr {
    position: fixed;
    width: 100%;
    bottom: 15px;
    color: #bfbfbf;
    z-index: 1000;
    font-size: 14px;
    text-align: center;

    a {
      color: #bfbfbf;
    }
  }

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;

      // &::before {
      //   background-image: url(/@/assets/svg/login-bg-dark.svg);
      // }

      .ant-input,
      .ant-input-password {
        background-color: #232a3b;
      }

      .ant-btn:not(.ant-btn-link):not(.ant-btn-primary) {
        border: 1px solid #4a5569;
      }

      &-form {
        background: transparent !important;
      }

      .app-iconify {
        color: #fff;
      }
    }

    input.fix-auto-fill,
    .fix-auto-fill input {
      -webkit-text-fill-color: #c9d1d9 !important;
      box-shadow: inherit !important;
    }
  }

  .@{prefix-cls} {
    height: 100%;
    overflow: hidden;

    @media (max-width: @screen-xl) {
      background-color: #fff;

      .@{prefix-cls}-form {
        background-color: #fff;
      }
    }

    &::before {
      // position: absolute;
      // top: 0;
      // left: 0;
      // right: 0;
      // width: 100%;
      // height: 100%;
      // background-image: url(/@/assets/images/login-bg.jpg);
      // background-position: 100%;
      // background-repeat: no-repeat;
      // background-size: auto 100%;
      // content: '';
      // @media (max-width: @screen-xl) {
      //   display: none;
      // }
    }

    .@{logo-prefix-cls} {
      position: absolute;
      top: 12px;
      height: 30px;

      &__title {
        font-size: 16px;
        color: #fff;
      }

      img {
        width: 32px;
      }
    }

    .container {
      .@{logo-prefix-cls} {
        display: flex;
        width: 60%;
        height: 80px;

        &__title {
          font-size: 24px;
          color: #fff;
        }

        img {
          width: 48px;
        }
      }
    }

    &-sign-in-way {
      .anticon {
        font-size: 22px;
        color: #888;
        cursor: pointer;

        &:hover {
          color: @primary-color;
        }
      }
    }

    input:not([type='checkbox']) {
      // min-width: 360px;
      border-radius: 4px !important;

      @media (max-width: @screen-xl) {
        min-width: 320px;
      }

      @media (max-width: @screen-lg) {
        min-width: 260px;
      }

      @media (max-width: @screen-md) {
        min-width: 240px;
      }

      @media (max-width: @screen-sm) {
        min-width: 160px;
      }
    }

    .@{countdown-prefix-cls} input {
      min-width: unset;
    }

    .ant-divider-inner-text {
      font-size: 12px;
      color: @text-color-secondary;
    }
  }
  .ant-input-affix-wrapper-lg {
    border-radius: 4px;
  }
</style>
