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
    <template #form-custom> custom-slot </template>
    <template #shopName="{ record }">
      <div :class="hasPermission('ORGANIZATION_GET')? 'link' : 'no-drop'" @click="hasPermission('ORGANIZATION_GET')?goShopDetail(record):''">{{ record.shopName }}</div>
    </template>
    <template #mobile="{ record }">
      <div class="link" @click="goAccountDetail(record)">{{ record.mobile }}</div>
    </template>
  </BasicTable>
</template>
<script lang="ts" setup>
  // import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getBasicColumns, getFormConfig } from './accountList.data';
  import { accountList } from './accountList.api';
  import { useMerchantStore } from '/@/store/modules/merchant';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const go = useGo();
  const router = useRouter();
  const merchantStore = useMerchantStore();

  const [registerTable, { getForm }] = useTable({
    api: accountList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'offset',
      // 传给后台的每页显示多少条的字段
      sizeField: 'limit',
      // 接口返回表格数据的字段
      listField: 'shopVendors',
      // 接口返回表格总数的字段
      totalField: 'totalCount',
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
      params.offset = params.offset - 1;
    },
    rowKey: 'id',
  });
  const goShopDetail = (record) => {
    if (!hasPermission('VENDOR_DETAIL_GET')) {
      return;
    }
    go('/merchant/basic/shopDetail/' + record.shopId);
    // router.push({ path: '/merchant/basic/shopDetail', query: { id: record.shopId } });
  };
  const goAccountDetail = (record) => {
    if (!hasPermission('VENDOR_DETAIL_GET')) {
      return;
    }
    merchantStore.setAccountInfo(record);
    go('/merchant/basic/accountDetail/' + record.roles[0].id);
    // router.push({ path: '/merchant/basic/accountDetail', query: { id: record.roles[0].id } });
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
  .no-drop{
    &:hover{
      cursor: no-drop;
    }
  }
</style>
