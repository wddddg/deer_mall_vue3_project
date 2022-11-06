<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="500"
    :min-height="240"
    :title="form.title"
    :can-fullscreen="false"
    :destroy-on-close="true"
    @ok="handleOk"
  >
    <div class="modalContent">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" autocomplete="off">
        <a-form-item
          name="name"
          :rules="[{ required: true }]"
          v-for="item in form.showList"
          :key="item.id"
          :label="'上级分类名称'"
        >
          <a-input v-model:value="item.name" disabled />
        </a-form-item>

        <a-form-item label="分类名称" name="name" :rules="[{ required: true, message: '' }]">
          <a-input v-model:value="form.name" maxlength="20" />
        </a-form-item>

        <a-form-item
          label="分类终端"
          name="name"
          :rules="[{ required: true, message: '' }]"
          v-if="!!form.parentId"
        >
          <a-select v-model:value="form.productAttachable">
            <a-select-option :value="true"> 是 </a-select-option>
            <a-select-option :value="false"> 否 </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="类目LOGO" name="name" :rules="[{ required: true, message: '' }]">
          <div class="file_container flex_center">
            <input class="file_input" type="file" @change="getUploadURL" accept="image/*" />
            <img
              v-if="form.logoUrl"
              :src="getFileUrl(form.logoUrl)"
              class="file_image"
              alt="logo"
            />
            <div v-else class="file_text">
              <loading-outlined v-if="form.loading" />
              <plus-outlined v-else />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { updateProductCategoriesByID, createProductCategories } from '../category.api';
  import { OssUtils } from '/@/utils/ossUtils';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  const form = reactive({
    id: '',
    parentId: '',
    name: '',
    logoUrl: '',
    productAttachable: false,
    orderId: '',

    // 辅助信息
    title: '',
    list: [] as any[],
    showList: [] as any,
    loading: false,
  });

  const ossUtils = new OssUtils();
  function getFileUrl(fileUrl: string) {
    return ossUtils.getSignatureUrl(fileUrl);
  }

  const initForm = () => {
    form.id = '';
    form.parentId = '';
    form.name = '';
    form.logoUrl = '';
    form.productAttachable = false;
    form.orderId = '';
    form.title = '';

    form.title = '';
    form.list = [];
    form.showList = [];
    form.loading = false;
  };

  // 表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('data =>', { ...data });
    initForm();

    // 初始化 form 数据
    Object.keys(form).forEach((item) => {
      let key = item as keyof typeof form;
      if (data.hasOwnProperty(key)) {
        form[key] = data[key] as never;
      }
    });

    // 从新整理 list 递归父类
    let showList = [] as any[];
    while (data && data.parentId) {
      data = findData(data.parentId, form.list);
      // 只显示直属上级条件： && data.id == form.parentId
      if (data && data.id == form.parentId) {
        showList.push({ id: data.id, parentId: data.parentId, name: data.name });
      }
      form.showList = showList.reverse();
    }
    console.log('form =>', { ...form });
    console.log('showList =>', [...showList], showList.length);

    // 重置表单
    setModalProps({ confirmLoading: false });
  });

  // 递归往上查找
  const findData = (id, list) => {
    for (let idx = 0; idx < list.length; idx++) {
      const item = list[idx];
      if (item.id == id) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        let _item = findData(id, item.children);
        if (_item) {
          return _item;
        }
      }
    }

    return null;
  };

  // 提交
  async function handleOk() {
    try {
      setModalProps({ confirmLoading: true });

      // 提交参数
      const params = {
        id: form.id || null,
        parentId: form.parentId || null,
        name: form.name || null,
        orderId: form.orderId || null,
        productAttachable: form.productAttachable,
        tempLogoUrl: form.logoUrl,
      };

      if (!params.name) {
        message.error('请输入分类名称');
        return false;
      }
      if (!params.tempLogoUrl) {
        message.error('请上传类目LOGO');
        return false;
      }

      // 提交
      let handle = params.id ? updateProductCategoriesByID : createProductCategories;
      await handle(params)
        .then(() => {
          if (params.id) {
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
          console.error('handle.error =>', error);

          message.error(error?.response?.data?.message || '操作失败，请重试');
        });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  // 获取网络图片url
  const getUploadURL = (evt: any) => {
    let files = evt.dataTransfer ? evt.dataTransfer.files : evt.target.files;
    if (files.length == 0) {
      message.error('请选择上传图片');
      return;
    }

    let dateUnixTime = new Date().getTime();
    // '.jpeg'
    let name = dateUnixTime + files[0].type.replace('image/', '.');

    return new Promise<any>((resolve: any) => {
      ossUtils
        .uploadFile(name, files[0])
        .then((data) => {
          console.log('data =>', data);

          // resolve(data.url);
          form.logoUrl = data.name;
          resolve(ossUtils.getSignatureUrl(data.name));
        })
        .catch((error) => {
          console.log('error =>', error);

          resolve(files[0]);
        });
    });
  };
</script>

<style scoped lang="less">
  .flex_center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  // 文件
  .file_container {
    text-align: start;
    position: relative;
    width: 100px;
    height: 100px;
    background: #fafafa;
    border: 1px dashed #d9d9d9;

    .file_text {
      line-height: 18px;
      text-align: center;
    }

    // input
    .file_input {
      width: 100px !important;
      height: 100px !important;
      position: absolute;
      top: 0;
      left: 0;
      filter: alpha(opacity=0);
      -moz-opacity: 0;
      opacity: 0;
    }

    // image
    .file_image {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }

  .modalContent {
    min-height: 100px;
    padding: 30px;
    color: #838681;

    .avatar-uploader > .ant-upload {
      width: 128px;
      height: 128px;
    }

    .ant-upload-select-picture-card i {
      font-size: 32px;
      color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }
  }
</style>
