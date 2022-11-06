<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="500"
    :height="60"
    :min-height="60"
    :title="'删除'"
    @ok="handleOk"
  >
    <div class="message-box">
      <div>是否删除选中的物流公司？</div>
      <div>
        公司名称：
        <span class="red">{{ model.name }}</span>
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { deleteComany } from '../company.api';
  import { message } from 'ant-design-vue';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  const model = reactive({
    id: '',
    name: '',
  });

  // 表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('data =>', data);

    model.id = data.id;
    model.name = data.name;

    // 重置表单
    setModalProps({ confirmLoading: false });
  });

  // 删除提交
  async function handleOk() {
    try {
      setModalProps({ confirmLoading: true });

      //删除提交
      await deleteComany(model.id)
        .then(() => {
          message.success('删除成功');
          //关闭弹窗
          closeModal();
          //刷新列表
          emit('success');
        })
        .catch((error) => {
          console.log('error?.response?.data?.message=>', error?.response?.data?.message);

          message.error(error?.response?.data?.message || '操作失败，请重试');
        });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style scoped lang="less">
  .message-box {
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-size: 16px;

    .red {
      color: red;
    }
  }
</style>
