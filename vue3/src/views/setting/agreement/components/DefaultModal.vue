<template>
  <div class="px-10">
    <BasicModal
      centered
      :maskClosable="false"
      @register="registerModal"
      v-bind="$attrs"
      :title="title"
      :showCancelBtn="false"
      :showOkBtn="false"
      :width="1200"
    >
      <template #footer v-if="isEdit">
        <a-button @click="handleSave">存草稿</a-button>
        <a-button type="primary" @click="handleOk">发布</a-button>
      </template>
      <BasicForm @register="registerForm">
        <template #editor>
          <div class="editor-content" v-if="!isEdit"></div>
          <Tinymce
            :showImageUpload="false"
            v-model="content"
            @change="handleChange"
            v-else
          />
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { Tinymce } from '/@/components/Tinymce/index';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from '../agreement.data';
  import { getEditInfo, setEditInfo, setDraftEditInfo } from '../agreement.api';
  import { message } from 'ant-design-vue';
  const emit = defineEmits(['register', 'success']);
  const isEdit = ref(false);
  const title = ref('编辑协议');
  const content = ref('');
  const isChange = ref('');
  const key = ref(false);
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    await resetFields();
    isEdit.value = unref(data.isEdit);

    // 判断是否编辑,改变tile
    title.value = data.isEdit ? '编辑协议' : '查看协议';
    
    key.value = data.record.draft

    getEditInfo({ id: data.record.id }).then(async (res) => {
      setFieldsValue({
        ...res,
      });
      isChange.value = { ...res };
      if (!isEdit.value) {
        document.querySelector('.editor-content')!.innerHTML = res.content;
        document.querySelector('.editor-content>h2')!.style.color = 'rgba(0,0,0,.65)';
        document.querySelector('.editor-content>h2')!.style.fontSize = '2rem';
      } else {
        content.value = res.content;
      }
      setProps({ disabled: !data.isEdit });
    });
  });
  const [registerForm, { setProps, validate, setFieldsValue, resetFields }] = useForm({
    schemas: formSchema(key),
    showActionButtonGroup: false,
  });

  const handleChange = (value) => {
    content.value = value;
  };

  const handleSave = async () => {
    let value = await validate();
    value.content = content.value;
    value.oldId = value.id;
    value.draft = true;
    if(value.content === ''){
      return message.warning('请填写协议')
    }
    if(value.name === ''){
      return message.warning('请填写协议名称')
    }
    if (
      isChange.value.content === value.content &&
      isChange.value.name === value.name &&
      isChange.value.remark === value.remark
    ) {
      message.warning('你没有更改的信息');
      closeModal();
    } else {
      if(key.value){
        setDraftEditInfo(value).then((res) => {
          if (res.id) {
            message.success('提交成功');
            closeModal();
            emit('success');
          }
        });
      }else{
        setEditInfo(value).then((res) => {
          if (res.id) {
            message.success('提交成功');
            closeModal();
            emit('success');
          }
        });
      }
    }
  };

  const handleOk = async () => {
    let value = await validate();
    value.content = content.value;
    value.oldId = value.id;
    // value.draft = false;
    if(value.content === ''){
      return message.warning('请填写协议')
    }
    if(value.name === ''){
      return message.warning('请填写协议名称')
    }
    if (
      isChange.value.content === value.content &&
      isChange.value.name === value.name &&
      isChange.value.remark === value.remark && !key.value
    ) {
      message.warning('你没有更改的信息');
      closeModal();
    } else {
      if(key.value){
        value.draft = false
        setDraftEditInfo(value).then((res) => {
          if (res.id) {
            message.success('提交成功');
            closeModal();
            emit('success');
          }
        });
      }else{
        value.draft = false
        setEditInfo(value).then((res) => {
          if (res.id) {
            message.success('提交成功');
            closeModal();
            emit('success');
          }
        });
      }
    }
  };
</script>
<style scoped lang="less">
  .editor-content {
    height: 400px;
    overflow: auto;
    color: rgba(0, 0, 0, 0.65);
  }
  .tinymce-container {
    color: rgba(0, 0, 0, 0.65);
  }
</style>
