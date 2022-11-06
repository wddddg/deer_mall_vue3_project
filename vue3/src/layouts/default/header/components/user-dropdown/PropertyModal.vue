<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="600"
    :title="'修改密码'"
    @ok="handleOk"
  >
    <div class="modalContent">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" autocomplete="off">
        <a-form-item label="旧密码" name="oldPassword" :rules="[{ required: true }]">
          <a-input-password v-model:value="form.oldPassword" placeholder="请输入旧密码" />
        </a-form-item>
        <a-form-item label="新密码" name="newPassword" :rules="[{ required: true }]">
          <a-input-password v-model:value="form.newPassword" placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item label="确认新密码" name="confirmPassword" :rules="[{ required: true }]">
          <a-input-password v-model:value="form.confirmPassword" placeholder="请确认新密码" />
        </a-form-item>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import * as _ from 'lodash';
  import { useUserStore } from '/@/store/modules/user';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const userStore = useUserStore();

  const form = reactive({
    // 表单数据
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
    setModalProps({ confirmLoading: false });
  });
  // 空值测试
  function checkValueOfEmpty(value) {
    if (value !== '' && value !== undefined && value !== null) {
      return false;
    }
    return true;
  }
  //表单提交事件
  async function handleOk() {
    try {
      setModalProps({ confirmLoading: true });
      if (checkValueOfEmpty(form.oldPassword)) {
        message.error('请输入旧密码');
        return false;
      }
      if (checkValueOfEmpty(form.newPassword)) {
        message.error('请输入新密码');
        return false;
      }
      if (form.newPassword.indexOf(' ') !== -1) {
        message.info('输入的密码不能有空格');
        return false;
      }
      // 新密码不符合规范，密码由大小写字母和数字组成，长度为8-16位
      let reg = new RegExp(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![(0-9a-zA-Z)]+$).{8,16}$/);
      if (!reg.test(form.newPassword)) {
        message.error('新密码不符合规范，密码必须由大小写字母、数字和特殊字符组成，长度8-16位');
        return false;
      }
      if (checkValueOfEmpty(form.confirmPassword)) {
        message.error('请确认新密码');
        return false;
      }
      if (form.newPassword !== form.confirmPassword) {
        message.info('新密码与确认密码不一致');
        return false;
      }
      let data = {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      };
      const datas = await userStore.changePasswordConfirm(data);
      if (datas) {
        message.info('密码已修改，请重新登录');
        userStore.logout(true);
      }

      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } catch (error) {
      message.error(error?.response?.data?.message || '操作失败，请重试');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped>
  .modalContent {
    margin-top: 20px;
  }
</style>
