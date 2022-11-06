<template>
  <!-- <LoginFormTitle class="enter-x" /> -->
  <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
    <FormItem name="mobile" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.mobile"
        :placeholder="t('sys.login.mobile')"
        class="fix-auto-fill"
        :maxlength="11"
      />
    </FormItem>
    <FormItem name="verificationCode" class="enter-x">
      <CountdownInput
        size="large"
        class="fix-auto-fill"
        :sendCodeApi="getSms"
        v-model:value="formData.verificationCode"
        :placeholder="t('sys.login.smsCode')"
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
            @click="setLoginState(LoginStateEnum.RESET_PASSWORD)"
            class="forget-password-text"
          >
            <!-- {{ t('sys.login.forgetPassword') }} -->
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
      <!-- <Button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </Button> -->
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref } from 'vue';
  import { Checkbox, Form, Input, Row, Col, Button, Divider, message } from 'ant-design-vue';
  import { CountdownInput } from '/@/components/CountDown';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLocaleStore } from '/@/store/modules/locale';
  import { sendSmsLoginVerificationCode } from '/@/api/sys/user';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';

  const FormItem = Form.Item;
  const { t } = useI18n();
  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    mobile: '',
    verificationCode: '',
  });
  const { prefixCls } = useDesign('login');
  const { notification, createErrorModal } = useMessage();
  const userStore = useUserStore();
  const { validForm } = useFormValid(formRef);
  const rememberMe = ref(false);
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.MOBILE);

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    // 账户为空时报错
    if (data.mobile == '') {
      message.warn('请填写手机号码！');
      return false;
    }
    // 检测合法手机号码
    if (!ruleValidate('PhoneNumber', data.mobile).status) {
      message.warn('请填写正确的手机号码！');
      return false;
    }
    if (data.verificationCode == '') {
      message.warn('请输入验证码！');
      return false;
    }
    try {
      loading.value = true;
      const userInfo = await userStore.getLoginByCode({
        mobile: data.mobile,
        verificationCode: data.verificationCode,
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
      message.error(error?.response?.data?.message || '操作失败，请重试');
      // const tips =
      //   (error as unknown as Error).message == 'Request failed with status code 400'
      //     ? '验证码错误或手机账号不存在！'
      //     : '';
      // createErrorModal({
      //   title: t('sys.api.errorTip'),
      //   content: tips || t('sys.api.networkExceptionMsg'),
      //   getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      // });
    } finally {
      loading.value = false;
    }
  }

  const getSms = () => {
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
    return sendSmsLoginVerificationCode({ mobile: formData.mobile });
    // .then(() => {})
    // .catch((error) => {
    //   message.error(error?.response?.data?.message || '操作失败，请重试');
    //   // console.log(2222222222, error?.response?.data?.message);
    // });
  };

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
</script>
<style lang="less" scoped>
  ._confirm {
    box-shadow: 0 3px 14px rgb(192 34 53 / 30%);
    border-radius: 10px;
  }
  .forget-password-text {
    font-size: 14px;
    color: #007bff;
    line-height: 19px;
    cursor: pointer;
  }
  .ant-input {
    border-radius: 4px !important;
  }
</style>
