<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="500"
    :height="model.height"
    :min-height="model.height"
    :title="model.title"
    @ok="handleOk"
  >
    <div class="message-box">
      <div v-if="model.testOnly == false">
        消费者设置为测试人员后，可查看测试店铺的所有商品。 是否设置为测试人员？
      </div>
      <div v-else>是否确定取消其测试人员资格？</div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { updateBuyer } from '../list.api';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  const model = reactive({
    title: '标题',
    id: '',
    testOnly: false,
    height: 60,
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('data =>', data);

    model.id = data.id;
    model.title = data.title;
    model.testOnly = data.testOnly;

    // 重置表单
    setModalProps({ confirmLoading: false });
  });

  //表单提交事件
  async function handleOk() {
    try {
      setModalProps({ confirmLoading: true });
      //提交表单

      await updateBuyer({
        id: model.id,
        testOnly: !model.testOnly,
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
  .message-box {
    height: 60px;
    display: flex;
    align-items: center;
  }
</style>
