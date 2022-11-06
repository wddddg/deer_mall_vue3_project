<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="500"
    :min-height="240"
    title="设置费率"
    @ok="handleOk"
  >
    <div class="modalContent">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" autocomplete="off">
        <a-form-item
          name="name"
          :rules="[{ required: true }]"
          v-for="(item, index) in form.showList"
          :key="item.id"
          :label="index === form.showList.length - 1 ? '分类名称' : '上级分类名称'"
        >
          <a-input v-model:value="item.name" disabled />
        </a-form-item>

        <a-form-item
          label="费率"
          name="mamaPlatformCommissionRate"
          :rules="[{ required: true, message: '' }]"
        >
          <a-input v-model:value="form.mamaPlatformCommissionRate" suffix="%" maxlength="2" />
        </a-form-item>
      </a-form>
      <div class="remark">
        说明：子级商品分类费率跟其直属二级商品分类费率，若二级商品分类费率未设置，
        则跟其直属一级分类费率
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { updateProductCategoriesByID } from '../category.api';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  const form = reactive({
    id: '',
    parentId: '',
    name: '',
    mamaPlatformCommissionRate: 0,
    list: [] as any[],
    showList: [] as any,
  });

  // 表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('data =>', { ...data });

    // 初始化 form 数据
    Object.keys(form).forEach((item) => {
      let key = item as keyof typeof form;
      if (data.hasOwnProperty(key)) {
        form[key] = data[key] as never;
      }
    });
    form.mamaPlatformCommissionRate = Number(form.mamaPlatformCommissionRate) * 100;

    // 从新整理 list 递归父类
    let showList = [] as any[];
    showList.push({ id: data.id, parentId: data.parentId, name: data.name });
    while (data && data.parentId) {
      data = findData(data.parentId, form.list);
      if (data) {
        showList.push({ id: data.id, parentId: data.parentId, name: data.name });
      }
    }
    form.showList = showList.reverse();
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

      form.mamaPlatformCommissionRate = Number(form.mamaPlatformCommissionRate);
      if (
        !/^[0-9]+$/.test(form.mamaPlatformCommissionRate + '') ||
        form.mamaPlatformCommissionRate < 0 ||
        form.mamaPlatformCommissionRate > 10
      ) {
        message.error('商品分类费率范围0~10');
        return;
      }

      // 提交参数
      const params = {
        id: form.id,
        parentId: form.parentId,
        name: form.name,
        mamaPlatformCommissionRate: form.mamaPlatformCommissionRate / 100,
      };

      // 提交
      await updateProductCategoriesByID(params)
        .then((res) => {
          console.log('updateProductCategoriesByID.res =>', res);

          //关闭弹窗
          closeModal();

          //刷新列表
          emit('success');
        })
        .catch((error) => {
          console.error('updateProductCategoriesByID.error =>', error);

          message.error(error?.response?.data?.message || '操作失败，请重试');
        });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style scoped lang="less">
  .modalContent {
    min-height: 100px;
    padding: 30px;
    color: #838681;

    .remark {
      color: red;
    }
  }
</style>
