<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="320"
    :min-height="460"
    :title="'分类排序'"
    :destroy-on-close="true"
    :can-fullscreen="false"
    @ok="handleOk"
  >
    <div v-if="form.parent.id" style="margin-bottom: 10px">
      上级分类名称：{{ form.parent.name }}
    </div>

    <div class="table-box">
      <a-row :gutter="5" v-for="(item, index) in form.list" :key="index">
        <a-col :span="18" class="input-col">
          {{ item.name }}
        </a-col>
        <a-col :span="3">
          <div
            class="action-text"
            :class="{ _disable: index == 0 }"
            @click="multisItemAction('up', index)"
          >
            <Icon icon="ion:arrow-up" :size="20" />
          </div>
        </a-col>
        <a-col :span="3">
          <div
            class="action-text"
            :class="{ _disable: index == form.list.length - 1 }"
            @click="multisItemAction('down', index)"
          >
            <Icon icon="ion:arrow-down" :size="20" />
          </div>
        </a-col>
      </a-row>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import * as _ from 'lodash';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { productCategoriesSort } from '../category.api';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  const form = reactive({
    parent: {
      // 父级数据
      id: '',
      name: '',
    },
    // 排序列表
    list: [] as any[],
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('data =>', { ...data });

    if (data.level == 1) {
      // 层级1获取总表
      form.list = deepCopy(data.list);
      form.parent.id = '';
      form.parent.name = '';
    } else {
      const parentData = findData(data.parentId, data.list);
      const children = deepCopy(parentData.children);
      console.log('父级数据', children);
      form.list = children;
      form.parent.id = parentData.id;
      form.parent.name = parentData.name;
    }

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

  // 深度複製 破壞儲存內存
  const deepCopy = (data) => {
    return JSON.parse(JSON.stringify(data));
  };

  // 属性值列表操作
  const multisItemAction = async (action, index) => {
    let editData = deepCopy(form.list);

    switch (action) {
      case 'up':
        if (index === 0) {
          message.warning('已经是第一个');
          return;
        }

        editData[index - 1] = deepCopy(form.list[index]);
        editData[index] = deepCopy(form.list[index - 1]);
        form.list = deepCopy(editData);
        break;
      case 'down':
        if (index === form.list.length - 1) {
          message.warning('已经是最后一个');
          return;
        }
        editData[index + 1] = deepCopy(form.list[index]);
        editData[index] = deepCopy(form.list[index + 1]);
        form.list = deepCopy(editData);
        break;
    }
  };

  //表单提交事件
  async function handleOk() {
    try {
      setModalProps({ confirmLoading: true });

      //提交参数
      let params = {
        productCategories: [] as any[],
      };
      // 根据当前数据位置进行orderId赋值
      form.list.forEach((item, index) => {
        params.productCategories.push({
          id: item.id,
          orderId: index + 1,
        });
      });

      // 提交
      await productCategoriesSort(params)
        .then((res) => {
          console.log('productCategoriesSort.res =>', res);
          message.success('排序成功');

          //关闭弹窗
          closeModal();

          //刷新列表
          emit('success');
        })
        .catch((error) => {
          console.error('productCategoriesSort.error =>', error);

          message.error(error?.response?.data?.message || '操作失败，请重试');
        });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped>
  .table-box {
    border-radius: 8px;
    border: 1px solid #ccc;
  }

  .action-text {
    cursor: pointer;
    color: #007bff !important;
    &._disable {
      cursor: not-allowed;
      color: #d1d3d7 !important;
    }
  }

  .ant-row {
    padding: 8px 10px;

    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  }
</style>
