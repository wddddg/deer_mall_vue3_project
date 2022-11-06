<!--
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-25 19:55:25
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-26 10:26:50
-->
<template>
  <BasicTable @register="registerTable">
    <template #feedbackId="{ record }">
      <div class="link" @click="hasPermission('VENDOR_FEEDBACK_GET')? goShopDetail(record) : ''">{{ record.id }}</div>
    </template>
    <template #action="{ record }">
      <div
        class="actiondel"
        @click="openDelete(record)"
        v-if="hasPermission('VENDOR_FEEDBACK_DELETE')"
        >删除</div
      >
    </template>
  </BasicTable>
  <BasicModal
    centered
    :destroyOnClose="true"
    :maskClosable="false"
    :useWrapper="false"
    @register="registerModal"
    title="提示"
    @ok="handleDelete()"
    :bodyStyle="{ height: '100px' }"
  >
    <div class="box">
      <div>是否删除选中的数据？</div>
      <div>
        反馈编号：<span class="id">{{ selectId }}</span>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getBasicColumns, getFormConfig } from './trade.data';
  import { feedbackList, deleteFeedback } from './trade.api';
  import { useMerchantStore } from '/@/store/modules/merchant';
  import { useGo } from '/@/hooks/web/usePage';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const go = useGo();

  const merchantStore = useMerchantStore();
  let selectId = ref('');
  const [registerTable, { reload }] = useTable({
    api: feedbackList,
    searchInfo: { userTypeCode: 'vendor' },
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'pageNo',
      // 传给后台的每页显示多少条的字段
      sizeField: 'pageSize',
      // 接口返回表格数据的字段
      listField: 'tickets',
      // 接口返回表格总数的字段
      totalField: 'totalCount',
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
      params.pageNo = params.pageNo - 1;
    },
    rowKey: 'id',
  });
  const handleDelete = async () => {
    await deleteFeedback(selectId.value);
    closeModal();
    reload();
    message.success('删除成功！');
  };
  const [registerModal, { openModal: openModal, closeModal: closeModal }] = useModal();

  const openDelete = (record) => {
    selectId.value = record.id;
    openModal(true);
  };
  const goShopDetail = (record) => {
    if (!hasPermission('VENDOR_FEEDBACK_GET')) {
      return;
    }
    go('/feedback/manage/tradeDetail/' + record.id);
  };
  const goAccountDetail = (record) => {
    merchantStore.setAccountInfo(record);
    go('/merchant/basic/accountDetail/' + record.roles[0].id);
  };
</script>
<style lang="less" scoped>
  :deep(.ant-table-title) {
    padding: 0 !important;
  }
  :deep(.ant-tabs > .ant-tabs-nav) {
    margin: 0 !important;
  }
  :deep(.vben-basic-table-header__toolbar) {
    display: none !important;
  }
  :deep(.ant-table-title) {
    display: none;
  }
  .link {
    cursor: pointer;
    &:hover {
      color: #007bff;
    }
  }
  .actiondel {
    cursor: pointer;
    color: #007bff;
  }
  .box {
    height: 100px;
    font-size: 16px;
    padding: 6px 20px 12px;
    .id {
      color: #ff5050;
    }
  }
</style>
