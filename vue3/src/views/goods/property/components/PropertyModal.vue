<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="600"
    :title="form.title"
    :can-fullscreen="false"
    :destroy-on-close="true"
    @ok="handleOk"
  >
    <div class="modalContent">
      <a-form :model="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off">
        <a-form-item label="属性名称" name="name" :rules="[{ required: true }]">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-input v-model:value="form.remark" />
        </a-form-item>

        <a-form-item label="属性类型" name="typeCode" :rules="[{ required: true }]">
          <a-radio-group v-model:value="form.typeCode" @change="changeAttributeType">
            <a-radio :value="'MULTI'">多属性</a-radio>
            <a-radio :value="'SINGLE'">单属性</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          label="文件类型"
          name="typeSingleValueTypeCode"
          :rules="[{ required: true }]"
          v-if="form.typeCode == 'SINGLE'"
        >
          <a-select v-model:value="form.typeSingleValueTypeCode">
            <a-select-option
              v-for="(item, index) in typeSingleValueTypeCodeList"
              :key="index"
              :value="item.code"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <div v-if="form.typeCode == 'MULTI'">
          <a-row class="flex-1 header">
            <a-col :span="16"> 属性值名称 </a-col>
            <a-col :span="8"> 操作 </a-col>
          </a-row>

          <a-row
            class="flex-1"
            v-for="(item, index) in form.productAttributeConfigTypeMultis"
            :key="index"
          >
            <a-col :span="12" class="input-col">
              <a-input v-model:value="item.name" />
            </a-col>
            <a-col :span="12">
              <div class="opt-box">
                <span
                  class="symbol"
                  :class="{ active: index > 0 }"
                  @click="multisItemAction('up', index)"
                >
                  <Icon icon="ion:arrow-up" :size="20" />
                </span>
                <span
                  class="symbol"
                  :class="{ active: index !== form.productAttributeConfigTypeMultis.length - 1 }"
                  @click="multisItemAction('down', index)"
                >
                  <Icon icon="ion:arrow-down" :size="20" />
                </span>
                <span
                  class="symbol"
                  :class="{ active: true }"
                  @click="multisItemAction('add', index)"
                >
                  <Icon icon="ion:add-outline" :size="20" />
                </span>
                <span
                  class="symbol"
                  :class="{ active: form.productAttributeConfigTypeMultis.length > 1 }"
                  @click="multisItemAction('delete', index)"
                >
                  <Icon icon="ion:minus" :size="20" />
                </span>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import * as _ from 'lodash';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    createProductAttribute,
    updateProductAttribute,
    getProductAttributeConfigTypeSingleValueTypesList,
    deleteProductAttributeValidateById,
  } from '../property.api';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  const form = reactive({
    // 表单数据
    id: '',
    name: '',
    remark: '',
    typeCode: 'SINGLE',
    typeSingleValueTypeCode: '',
    productAttributeConfigTypeMultis: [] as any[],

    // 辅助数据
    title: '',
  });

  // typeCode为单属性时的数据类型 【可选数据列表】
  const typeSingleValueTypeCodeList = ref<any[]>([]);

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('data =>', { ...data });

    // 清空原始数据
    form.id = '';
    form.name = '';
    form.remark = '';
    form.typeCode = 'SINGLE';
    form.typeSingleValueTypeCode = '';
    form.productAttributeConfigTypeMultis = [];

    // 初始化 form 数据
    Object.keys(form).forEach((item) => {
      let key = item as keyof typeof form;
      if (data.hasOwnProperty(key)) {
        form[key] = data[key] as never;

        // 初始化多属性列表;
        if (key === 'productAttributeConfigTypeMultis') {
          form[key] = [...form[key]];
        }
      }
    });
    console.log('form =>', { ...form });

    // 初始化下拉列表
    await getProductAttributeConfigTypeSingleValueTypesList().then((res) => {
      // 清空数组
      // typeSingleValueTypeCodeList.value.splice(0);
      // typeSingleValueTypeCodeList.value.push(...res);
      console.log('getProductAttributeConfigTypeSingleValueTypesList => ', res);

      typeSingleValueTypeCodeList.value = res;
    });

    setModalProps({ confirmLoading: false });
  });

  // 获取name 不为空的列表并排重
  const matchMultisList = (params) => {
    let result: any[] = [];
    // 排重
    result = _.uniqBy(result, 'name');
    params.productAttributeConfigTypeMultis.forEach((item) => {
      if (item.name) {
        item.orderId = result.length + 1;
        result.push(item);
      }
    });

    return result;
  };

  // 深度複製 破壞儲存內存
  const deepCopy = (data) => {
    return JSON.parse(JSON.stringify(data));
  };

  // 更改属性类型
  const changeAttributeType = () => {
    if (
      form.typeCode === 'MULTI' &&
      form.productAttributeConfigTypeMultis &&
      form.productAttributeConfigTypeMultis.length === 0
    ) {
      form.productAttributeConfigTypeMultis.push({ id: null, name: '', orderId: null });
    }
  };

  // 属性值列表操作
  const multisItemAction = async (action, index) => {
    let editData = deepCopy(form.productAttributeConfigTypeMultis);

    switch (action) {
      case 'up':
        if (index === 0) {
          message.warning('已经是第一个');
          return;
        }

        editData[index - 1] = deepCopy(form.productAttributeConfigTypeMultis[index]);
        editData[index] = deepCopy(form.productAttributeConfigTypeMultis[index - 1]);
        form.productAttributeConfigTypeMultis = deepCopy(editData);
        break;
      case 'down':
        if (index === form.productAttributeConfigTypeMultis.length - 1) {
          message.warning('已经是最后一个');
          return;
        }
        editData[index + 1] = deepCopy(form.productAttributeConfigTypeMultis[index]);
        editData[index] = deepCopy(form.productAttributeConfigTypeMultis[index + 1]);
        form.productAttributeConfigTypeMultis = deepCopy(editData);
        break;
      case 'add':
        form.productAttributeConfigTypeMultis.splice(index + 1, 0, {
          id: null,
          name: '',
          orderId: null,
        });
        break;
      case 'delete':
        if (form.productAttributeConfigTypeMultis.length === 1) {
          message.warning('至少保留一个');
          return;
        }
        // todo:判断当前属性值名称是否可以删除：调用API
        if (form.id) {
          await deleteProductAttributeValidateById(form.id)
            .then((res) => {
              console.log('deleteProductAttributeValidateById.res =>', res);

              form.productAttributeConfigTypeMultis.splice(index, 1);
            })
            .catch(() => {
              message.error('删除失败，请重试');
            });
        } else {
          form.productAttributeConfigTypeMultis.splice(index, 1);
        }
        break;
    }
  };

  //表单提交事件
  async function handleOk() {
    try {
      setModalProps({ confirmLoading: true });

      if (!form.name) {
        message.error('请输入属性名称');
        return;
      }
      if (!form.typeCode) {
        message.error('请选择属性类型');
        return;
      }

      //提交表单
      let params = deepCopy(form);
      if (params.typeCode === 'MULTI') {
        params['productAttributeConfigTypeMultis'] = matchMultisList(params);

        console.log(
          "params['productAttributeConfigTypeMultis'] =>",
          params['productAttributeConfigTypeMultis'],
        );

        if (params['productAttributeConfigTypeMultis'].length == 0) {
          message.error('请输入多属性值名称');
          return;
        }
        if (params['productAttributeConfigTypeMultis'].some((item) => !item.name)) {
          message.error('请输入多属性值名称');
          return;
        }
      } else {
        if (!form.typeSingleValueTypeCode) {
          message.error('请选择文件类型');
          return;
        }
        params['productAttributeConfigTypeMultis'] = [];
      }
      if (form.id) {
        const result = await updateProductAttribute(params.id, params)
          .then((res) => {
            message.success('编辑成功');

            return res;
          })
          .catch((error) => {
            console.error('handle.error =>', error);

            message.error(error?.response?.data?.message || '操作失败，请重试');
          });

        if (!result) {
          return;
        }
      } else {
        const result = await createProductAttribute(params)
          .then((res) => {
            message.success('新增成功');

            return res;
          })
          .catch((error) => {
            console.error('handle.error =>', error);

            message.error(error?.response?.data?.message || '操作失败，请重试');
          });

        if (!result) {
          return;
        }
      }

      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped>
  .modalContent {
    min-height: 100px;
    padding: 30px;
    color: #838681;

    .flex-1 {
      flex: 1;
    }

    .header {
      padding: 10px;
      background-color: #f8f8f8;
      color: #83868e;
    }

    .input-col {
      padding: 5px;
    }

    .opt-box {
      padding: 5px;
      display: flex;
      align-items: center;

      .symbol {
        color: #d1d3d7 !important;
        padding: 5px 8px;
      }

      .active {
        color: #007bff !important;
        cursor: pointer;
      }
    }
  }
</style>
