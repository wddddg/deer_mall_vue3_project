<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :width="600" :title="title" @ok="handleOk">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from '../company.data';
  import { save } from '../company.api';
  import { message } from 'ant-design-vue';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  const title = ref('标题');

  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('data =>', data);

    title.value = data.title;

    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false });

    //表单赋值
    if (data.id) {
      await setFieldsValue({ ...data });
    }
  });

  //表单提交事件
  async function handleOk() {
    try {
      const values = await validate();
      console.log('values =>', values);

      setModalProps({ confirmLoading: true });
      //提交表单
      await save(values)
        .then(() => {
          if (values.id && values.id > 0) {
            message.success('编辑成功');
          } else {
            message.success('新增成功');
          }
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
