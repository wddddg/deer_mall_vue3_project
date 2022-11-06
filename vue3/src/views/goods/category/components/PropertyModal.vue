<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="760"
    :min-height="460"
    title="设置属性"
    :can-fullscreen="false"
    :destroy-on-close="true"
    @ok="handleOk"
  >
    <div style="padding-bottom: 15px">
      <span class="action-text" @click="openAttributeSelectModule()">
        <Icon icon="ant-design:plus-outlined" />选择属性
      </span>
    </div>

    <BasicTable @register="registerTable">
      <!--插槽:列表中的操作菜单-->
      <template #bodyCell="{ index, column }">
        <!-- 操作列 -->
        <template v-if="column.key === 'action'">
          <a-row :gutter="5">
            <a-col :span="8">
              <div
                class="action-text"
                :class="{ _disable: index === 0 }"
                @click="menuAciton('up', index)"
              >
                <Icon icon="ion:arrow-up" :size="20" />
              </div>
            </a-col>
            <a-col :span="8">
              <div
                class="action-text"
                :class="{ _disable: index + 1 === model.data?.productAttributeConfigs?.length }"
                @click="menuAciton('down', index)"
              >
                <Icon icon="ion:arrow-down" :size="20" />
              </div>
            </a-col>
            <a-col :span="8">
              <div class="action-text" @click="menuAciton('delete', index)">
                <Icon icon="ion:minus" :size="20" />
              </div>
            </a-col>
          </a-row>
        </template>
      </template>
    </BasicTable>
  </BasicModal>

  <!-- 选择属性 -->
  <PropertySelectModal @register="registerPropertySelectModal" @success="handleSuccess" />
</template>

<script setup lang="ts">
  import { Icon } from '/@/components/Icon';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useModal } from '/@/components/Modal';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import { getPropertyModalColumns } from '../category.data';
  import { getProductCategories, updateProductCategoriesByID } from '../category.api';
  import { reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import PropertySelectModal from './PropertySelectModal.vue';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  const model = reactive({
    id: '',
    data: null as any,
  });

  const [registerTable, { setTableData }] = useTable({
    isTreeTable: false,
    // api: getProductCategories,
    columns: getPropertyModalColumns(),
    pagination: false,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    canResize: false,
    fetchSetting: getFetchSetting('productAttributeConfigs'),
    beforeFetch: getBeforeFetch,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
    rowKey: 'id',
  });

  // 深度複製 破壞儲存內存
  const deepCopy = (data) => {
    return JSON.parse(JSON.stringify(data));
  };

  // 操作菜单处理
  const menuAciton = async (action, index) => {
    let editData = deepCopy(model.data.productAttributeConfigs);
    switch (action) {
      case 'up':
        if (index === 0) {
          message.warning('已经是第一个');
          return;
        }
        editData[index - 1] = deepCopy(model.data.productAttributeConfigs[index]);
        editData[index] = deepCopy(model.data.productAttributeConfigs[index - 1]);
        model.data.productAttributeConfigs = deepCopy(editData);
        break;
      case 'down':
        if (index === model.data.productAttributeConfigs.length - 1) {
          message.warning('已经是最后一个');
          return;
        }
        editData[index + 1] = deepCopy(model.data.productAttributeConfigs[index]);
        editData[index] = deepCopy(model.data.productAttributeConfigs[index + 1]);
        model.data.productAttributeConfigs = deepCopy(editData);
        break;
      case 'delete':
        model.data.productAttributeConfigs.splice(index, 1);
        break;
    }

    // 从新列表赋值
    setTableData(model.data.productAttributeConfigs);
  };

  // 表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: true });
    console.log('data =>', data);

    model.id = data.id;
    model.data = await getProductCategories(model.id);
    if (model.data && model.data.productAttributeConfigs) {
      setTableData(model.data.productAttributeConfigs);
    }

    // 重置表单
    setModalProps({ confirmLoading: false });
  });

  // 提交前格式化提交数据，保留后端需要的数据
  const filterAttributeConfigData = (data: any[]) => {
    let result = [] as any[];
    data.forEach((item) => {
      result.push({
        id: item.id,
        productAttributeConfigId: item.productAttributeConfigId,
        mandatoryField: item.mandatoryField,
      });
    });

    return result;
  };

  // 选择属性
  const openAttributeSelectModule = () => {
    openModal(true, {
      attributeData: model.data,
    });
  };

  // 提交
  async function handleOk() {
    try {
      setModalProps({ confirmLoading: true });

      let params = {
        id: model.id,
        productCategoryAttributeConfigs: filterAttributeConfigData(
          model.data.productAttributeConfigs,
        ),
        updateProductCategoryAttributeConfig: true,
      };

      await updateProductCategoriesByID(params)
        .then((res) => {
          console.log('updateProductCategoriesByID.res =>', res);

          message.success('设置属性成功');

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

  // -----------------弹窗相关功能-----------------
  const [registerPropertySelectModal, { openModal }] = useModal();

  /**
   * 成功回调
   */
  function handleSuccess(attributes: any[]) {
    if (attributes && model.data?.productAttributeConfigs) {
      console.log('=================', attributes);
      // model.data.productAttributeConfigs = attributes;
      model.data.productAttributeConfigs.splice(0);
      model.data.productAttributeConfigs.push(...attributes);
    }

    console.log('成功回调');
  }
</script>

<style scoped lang="less">
  .action-text {
    cursor: pointer;
    color: #007bff !important;
    &._disable {
      cursor: not-allowed;
      color: #d1d3d7 !important;
    }
  }
</style>
