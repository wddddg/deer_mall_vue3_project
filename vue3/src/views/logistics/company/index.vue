<template>
  <BasicTable @register="registerTable">
    <!--插槽:table标题-->
    <template #tableTitle>
      <a-button
        type="primary"
        @click="handleAction(null, 'create')"
        preIcon="ant-design:plus-outlined"
      >
        新增物流公司
      </a-button>
    </template>

    <!--插槽:列表中的操作菜单-->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a-dropdown>
          <a class="ant-dropdown-link">更多 <Icon icon="ant-design:down-outlined" /> </a>
          <template #overlay>
            <a-menu class="antd-more">
              <a-menu-item>
                <a @click="handleAction(record, 'edit')">编辑</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleAction(record, 'delete')">删除</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </BasicTable>

  <!-- 新增、编辑 -->
  <CompanyModal @register="registerEditModal" @success="handleSuccess" />

  <!-- 删除 -->
  <DeleteModal @register="registerDeleteModal" @success="handleSuccess" />
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import Icon from '/@/components/Icon';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import { getBasicColumns, getFormConfig } from './company.data';
  import { getTradeLogisticsCompaniesList } from './company.api';
  import CompanyModal from './components/CompanyModal.vue';
  import DeleteModal from './components/DeleteModal.vue';

  const model = reactive({
    title: '',
    modalVisible: false,
    id: '',
    name: '',
    code: '',
    phoneNumber: '',
    companyUrl: '',
  });

  const [registerTable, { reload }] = useTable({
    api: getTradeLogisticsCompaniesList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    fetchSetting: getFetchSetting('tradeLogisticsCompanies'),
    // 请求之前对参数做处理
    beforeFetch: getBeforeFetch,
    rowKey: 'id',
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
    },
  });

  const handleAction = async (record, key: 'create' | 'edit' | 'delete') => {
    if (key == 'delete') {
      openDeleteModal(true, { ...record });

      return;
    }

    if (key == 'create') {
      model.title = '新增物流公司';
      model.id = '';
      model.name = '';
      model.code = '';
      model.phoneNumber = '';
      model.companyUrl = '';
    } else if (key == 'edit') {
      model.title = '编辑物流公司';
      model.id = record.id;
      model.name = record.name;
      model.code = record.code;
      model.phoneNumber = record.phoneNumber;
      model.companyUrl = record.companyUrl;
    }

    // 打开编辑框
    openModal(true, {
      ...model,
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
