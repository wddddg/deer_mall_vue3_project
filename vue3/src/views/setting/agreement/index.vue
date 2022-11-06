<template>
  <BasicTable @register="registerTable">
    <!--插槽:table标题-->
    <!-- <template #headerTop>
      <a-button type="primary"> 创建 </a-button>
    </template> -->
    <!--插槽:table标题中的 tab框-->
    <template #headerTop>
      <a-tabs @change="tabChange" :activeKey="activeKey">
        <a-tab-pane tab="全部" key="all" forceRender />
        <a-tab-pane v-for="item in statusList" :tab="item.label" :key="item.value" />
      </a-tabs>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a-dropdown>
          <a class="ant-dropdown-link">更多 <Icon icon="ant-design:down-outlined" /> </a>
          <template #overlay>
            <a-menu class="antd-more">
              <a-menu-item v-if="hasPermission('CONFIG_AGREEMENT_UPDATE')">
                <a @click="openEdit(record)">编辑</a>
              </a-menu-item>
              <a-menu-item v-if="hasPermission('CONFIG_AGREEMENT_VERSION_RECORD_GET')">
                <a @click="openHistory(record)">版本记录</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </BasicTable>
  <HistoryModal @register="historyModalRegister" />
  <DefaultModal @register="defaultModalRegister" @success="handleSuccess" />
</template>

<script setup lang="ts">
  import { BasicTable, useTable } from '/@/components/Table';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import HistoryModal from './components/HistoryModal.vue';
  import DefaultModal from './components/DefaultModal.vue';
  import Icon from '/@/components/Icon';
  import { getBasicColumns, getFormConfig, useStatus } from './agreement.data';
  import { getAgreementList } from './agreement.api';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const { statusList, activeKey } = useStatus();
  // 注册表格
  const [registerTable, { reload, getForm }] = useTable({
    api: getAgreementList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: false, redo: false, size: false, setting: false },
    showIndexColumn: true,
    fetchSetting: getFetchSetting('usageAgreements'),
    beforeFetch: (params) => {
      getBeforeFetch(params);
      // if (params?.createdDate) {
      //   params.startDate = params.createdDate[0];
      //   params.endDate = params.createdDate[1];
      //   delete params.createdDate;
      // }
      if (activeKey.value === '2') {
        params.draft = true;
      } else if(activeKey.value === '1') {
        params.draft = false;
      }else{
        params.draft = null
      }
    },
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
    },
    rowKey: 'id',
  });
  // 注册弹窗
  const [historyModalRegister, { openModal: openHistoryModal }] = useModal();
  const [defaultModalRegister, { openModal: openDefaultModal }] = useModal();
  // tab切换时重新加载数据
  const tabChange = (key) => {
    activeKey.value = key;
    // if (key === '2') {
    //   getForm().setFieldsValue({ draft: true });
    // } else {
    //   getForm().resetFields();
    // }
    reload({
      page: 1,
    });
  };
  // 打开版本记录modal
  const openHistory = (record) => {
    openHistoryModal(true, record);
  };
  // 打开编辑modal
  const openEdit = (record) => {
    openDefaultModal(true, {
      record,
      isEdit: true,
      key: activeKey.value,
    });
  };
  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
  }
</script>

<style lang="less" scoped>
  .link {
    cursor: pointer;
    &:hover {
      color: #007bff;
    }
  }
</style>
