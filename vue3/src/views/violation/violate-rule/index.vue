<template>
  <BasicTable @register="registerTable" />
</template>

<script setup lang="ts">
  import { BasicTable, useTable } from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import { getBasicColumns, getFormConfig } from './violateRule.data';
  import { getTradesList } from './violateRule.api';
  import { dateUtil } from '/@/utils/dateUtil';
  // const go = useGo();
  const [registerTable, { reload, getForm }] = useTable({
    api: getTradesList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: false, redo: false, size: false, setting: false },
    showIndexColumn: false,
    fetchSetting: getFetchSetting('tickets'),
    beforeFetch: (params) => {
      params.userTypeCode = 'buyer';
      params.offset = 0;
      if (params?.saleSubmittedDate) {
        params.startDate = dateUtil(params.saleSubmittedDate[0]).format('YYYY-MM-DD 00:00:00');
        params.endDate = dateUtil(params.saleSubmittedDate[1]).format('YYYY-MM-DD 23:59:59');
      } else {
        params.saleSubmittedDate = undefined;
        params.saleSubmittedDate = undefined;
      }
      delete params.saleSubmittedDate;
    },
    // dataSource:dataSource,
    rowKey: 'tradeId',
  });
</script>

<style lang="less" scoped>
  .link {
    cursor: pointer;
    &:hover {
      color: #007bff;
    }
  }
</style>
