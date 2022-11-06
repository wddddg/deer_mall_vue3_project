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
      <div>是否删除选中的商品分类？</div>
      <div>
        分类名称：
        <span class="red">{{ model.name }}</span>
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { deleteProductCategoriesById } from '../category.api';

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
      await deleteProductCategoriesById(model.id)
        .then((res) => {
          console.log('deleteProductCategoriesById.res =>', res);

          message.success('删除成功');
          //关闭弹窗
          closeModal();
          //刷新列表
          emit('success');
        })
        .catch((error) => {
          console.error('deleteProductCategoriesById.error =>', error);

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
