<template>
  <template v-if="getShow">
    <div class="login-page">
      <div class="flex_center">
        <div class="login-box">
          <div class="login_title">忘记密码</div>
          <div class="subtitle" v-if="forgetPasswordType === 'VerificationMobile'">
            <div> 请输入你绑定的手机号码 </div>
            <div> 我们会向你发送验证码 </div>
          </div>
          <div class="subtitle" v-if="forgetPasswordType === 'confirmPassword'">
            <div> 请输入该账号的新密码 </div>
            <div> 并二次确认新密码 </div>
          </div>
          <!-- <LoginFormTitle class="enter-x" /> -->
          <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
            <!-- <FormItem name="account" class="enter-x">
      <Input size="large" v-model:value="formData.account" :placeholder="t('sys.login.userName')" />
    </FormItem> -->
            <!-- <a-input
                size="large"
                v-model:value="formData.mobile"
                :placeholder="t('sys.login.mobile')"
              >
                <template #prefix>
                  <user-outlined type="user" />
                </template>
              </a-input> -->
            <FormItem
              name="mobile"
              class="enter-x"
              v-if="forgetPasswordType === 'VerificationMobile'"
            >
              <Input
                size="large"
                v-model:value="formData.mobile"
                :placeholder="t('sys.login.mobile')"
              />
            </FormItem>
            <FormItem
              name="verificationCode"
              class="enter-x"
              v-if="forgetPasswordType === 'VerificationMobile'"
            >
              <CountdownInput
                size="large"
                v-model:value="formData.verificationCode"
                :sendCodeApi="getSms"
                :placeholder="t('sys.login.smsCode')"
              />
            </FormItem>

            <FormItem class="enter-x" v-if="forgetPasswordType === 'VerificationMobile'">
              <Button
                type="primary"
                class="_confirm"
                size="large"
                block
                @click="handleReset"
                :loading="loading"
              >
                <!-- {{ t('common.resetText') }} -->
                下一步
              </Button>
              <Button size="large" class="_cancal mt-4" block @click="handleBackLogin">
                <!-- {{ t('sys.login.backSignIn') }} -->
                取消
              </Button>
            </FormItem>
            <FormItem name="mobile" class="enter-x" v-if="forgetPasswordType === 'confirmPassword'">
              <InputPassword
                size="large"
                visibilityToggle
                v-model:value="formData.password"
                placeholder="新密码"
              />
            </FormItem>
            <FormItem
              name="verificationCode"
              class="enter-x"
              v-if="forgetPasswordType === 'confirmPassword'"
            >
              <InputPassword
                size="large"
                visibilityToggle
                v-model:value="formData.pwd"
                placeholder="确认新密码"
              />
            </FormItem>

            <FormItem class="enter-x" v-if="forgetPasswordType === 'confirmPassword'">
              <Button
                type="primary"
                class="_confirm"
                size="large"
                block
                @click="forgetPasswordConfirm"
                :loading="loading"
              >
                <!-- {{ t('common.resetText') }} -->
                确认修改
              </Button>
              <Button size="large" class="_cancal mt-4" block @click="handleBack">
                <!-- {{ t('sys.login.backSignIn') }} -->
                取消
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref } from 'vue';
  import { UserOutlined } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button, message } from 'ant-design-vue';
  import { CountdownInput } from '/@/components/CountDown';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { sendSmsForgetPasswordVerificationCode } from '/@/api/sys/user';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const { prefixCls } = useDesign('login');
  const forgetPasswordType = ref('VerificationMobile'); // confirmPassword
  const { notification, createErrorModal } = useMessage();
  const userStore = useUserStore();

  const formData = reactive({
    // account: '',
    mobile: '',
    verificationCode: '',
    password: '',
    pwd: '',
  });

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);
  const { validForm } = useFormValid(formRef);

  const handleReset = async () => {
    // const data = await validForm();
    // if (!data) return;
    // 账户为空时报错
    if (formData.mobile == '') {
      message.error('请填写手机号码！');
      return false;
    }
    // 检测合法手机号码
    if (!ruleValidate('PhoneNumber', formData.mobile).status) {
      message.error('请填写正确的手机号码！');
      return false;
    }
    if (formData.verificationCode == '') {
      message.error('请输入验证码！');
      return false;
    }
    try {
      const res = await userStore.getForgetPasswordConfirm({
        mobile: formData.mobile,
        verificationCode: formData.verificationCode,
        mode: 'none', //不要默认的错误提示
      });
      if (res) {
        forgetPasswordType.value = 'confirmPassword';
      }
    } catch (error) {
      message.error(error?.response?.data?.message || '操作失败，请重试');
    }
    // const form = unref(formRef);
    // if (!form) return;
    // await form.resetFields();
  };

  const getSms = async () => {
    // 账户为空时报错
    if (formData.mobile == '') {
      message.warn('请填写手机号码！');
      return false;
    }
    // 检测合法手机号码
    if (!ruleValidate('PhoneNumber', formData.mobile).status) {
      message.warn('请填写正确的手机号码！');
      return false;
    }
    return sendSmsForgetPasswordVerificationCode({ mobile: formData.mobile });
  };

  async function forgetPasswordConfirm() {
    // const data = await validForm();
    // if (!data) return;
    if (formData.password == '') {
      message.warn('请填写新密码！');
      return false;
    }
    let reg = new RegExp(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![(0-9a-zA-Z)]+$).{8,16}$/);
    if (!reg.test(formData.password)) {
      message.warn('新密码不符合规范，密码必须由大小写字母、数字和特殊字符组成，长度8-16位');
      return false;
    }
    if (formData.pwd == '') {
      message.warn('请确认新密码！');
      return false;
    }
    if (formData.pwd !== formData.password) {
      message.warn('输入的密码不一致，请检查！');
      return false;
    }
    try {
      loading.value = true;
      const res = await userStore.getForgetPasswordConfirm({
        mobile: formData.mobile,
        verificationCode: formData.verificationCode,
        password: formData.password,
        mode: 'none', //不要默认的错误提示
      });
      if (res) {
        message.info('密码修改成功！');
        forgetPasswordType.value = 'VerificationMobile';
        handleBackLogin();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || '操作失败，请重试');
    } finally {
      loading.value = false;
    }
  }

  const ruleValidate = (
    rule: 'Email' | 'PhoneNumber' | 'Price' | 'Phone' | 'Password' | '',
    value,
  ) => {
    const ruleList = {
      Email: /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/, // 邮箱
      PhoneNumber: /^1[34578]\d{9}$/, // 手机号码
      Price: /^(0|[1-9][0-9]*)(\.[0-9]{2})?$/, // 两位小数的数值
      Phone: /^\+?[0-9]+\-?[0-9]+$/, // 电话号码
      Password: /^((?=.*\\d)(?=.*\\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,}$/, // 密码
    };
    if (!ruleList.hasOwnProperty(rule)) {
      return { status: false, msg: '匹配失败，无对应校验规则' };
    }
    // console.log(this.ruleList[rule], value);
    if (value === '' || value === undefined || value === null) {
      return { status: false, msg: '匹配失败，检验值为空' };
    }
    if (ruleList[rule].test(String(value)) || ruleList[rule].test(Number(value))) {
      return { status: true, msg: '校验成功' };
    } else {
      return { status: false, msg: '校验失败' };
    }
  };

  const handleBack = async () => {
    forgetPasswordType.value = 'VerificationMobile';
  };
</script>
<style lang="less" scoped>
  .subtitle {
    text-align: center;
    padding: 20px 0 50px;
    line-height: 24px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 18px;
  }
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
    margin-top: 40px;
  }
  ._cancal {
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
