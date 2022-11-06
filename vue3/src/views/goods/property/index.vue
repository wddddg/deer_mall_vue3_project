<template>
  <BasicTable @register="registerTable">
    <!--插槽:table标题-->
    <template #tableTitle>
      <a-button
        v-if="hasPermission('PRODUCT_ATTRIBUTE_CONFIG_CREATE')"
        type="primary"
        @click="handleAction({}, 'create')"
        preIcon="ant-design:plus-outlined"
      >
        新增属性
      </a-button>
    </template>

    <!--插槽:列表中的操作菜单-->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a-dropdown>
          <a class="ant-dropdown-link">更多 <Icon icon="ant-design:down-outlined" /> </a>
          <template #overlay>
            <a-menu class="antd-more">
              <a-menu-item v-if="hasPermission('PRODUCT_ATTRIBUTE_CONFIG_UPDATE')">
                <a @click="handleAction(record, 'edit')">编辑</a>
              </a-menu-item>
              <a-menu-item v-if="hasPermission('PRODUCT_ATTRIBUTE_CONFIG_DELETE')">
                <a @click="handleAction(record, 'delete')">删除</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </BasicTable>

  <!-- 新增、编辑 -->
  <PropertyModal @register="registerEditModal" @success="handleSuccess" />

  <!-- 删除 -->
  <DeleteModal @register="registerDeleteModal" @success="handleSuccess" />
</template>

<script setup lang="ts">
  import { BasicTable, useTable } from '/@/components/Table';
  import { getBasicColumns, getFormConfig } from './property.data';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import { getProductPropertyList } from './property.api';
  import { useModal } from '/@/components/Modal';
  import Icon from '/@/components/Icon';
  import PropertyModal from './components/PropertyModal.vue';
  import DeleteModal from './components/DeleteModal.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { hasPermission } = usePermission();
  const [registerTable, { reload }] = useTable({
    api: getProductPropertyList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    fetchSetting: getFetchSetting('productAttributeConfigs'),
    beforeFetch: getBeforeFetch,
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
    },
    rowKey: 'id',
  });

  const handleAction = async (record, key: 'create' | 'edit' | 'delete') => {
    if (key == 'delete') {
      openDeleteModal(true, { ...record });

      return;
    }

    let title = '属性';
    if (key == 'create') {
      title = `新增${title}`;
    } else if (key == 'edit') {
      title = `编辑${title}`;
    }

    // 打开编辑框
    openModal(true, {
      ...record,
      title,
    });
  };

  // -----------------弹窗相关功能-----------------
  const [registerEditModal, { openModal }] = useModal();
  const [registerDeleteModal, { openModal: openDeleteModal }] = useModal();

  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
  }
</script>
