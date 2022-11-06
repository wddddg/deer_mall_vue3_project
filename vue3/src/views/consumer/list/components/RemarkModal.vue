<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="540"
    :min-height="80"
    title="编辑备注"
    :destroy-on-close="true"
    :can-fullscreen="false"
    @ok="handleOk"
  >
    <div class="container">
      <a-input v-model:value="form.description" maxlength="100" />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { updateBuyer } from '../list.api';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  const form = reactive({
    id: '',
    description: '',
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('data =>', data);

    form.id = data.id;
    form.description = data.description;

    // 重置表单
    setModalProps({ confirmLoading: false });
  });

  //表单提交事件
  async function handleOk() {
    try {
      setModalProps({ confirmLoading: true });

      //提交表单
      await updateBuyer({
        ...form,
      });

      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style scoped lang="less">
  .container {
    height: 80px;
    display: flex;
    align-items: center;
  }
</style>
