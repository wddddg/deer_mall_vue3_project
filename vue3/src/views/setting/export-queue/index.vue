<template>
  <BasicTable @register="registerTable" :rowSelection="rowSelection">
    <!--插槽:table标题-->
    <template #tableTitle>
      <a-button type="primary" class="all-del"> 全部删除 </a-button>
      <a-button type="primary"> 全部下载 </a-button>
    </template>
  </BasicTable>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import Icon from '/@/components/Icon';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import { getBasicColumns, getFormConfig } from './exportQueue.data';
  import { getSettleList } from './exportQueue.api';
  import { useGo } from '/@/hooks/web/usePage';
  const go = useGo();
  const rowSelection = reactive({
    type: 'checkbox',
    onChange(value) {
      console.log(value);
    },
  });

  const [registerTable] = useTable({
    // api: getSettleList,
    columns: getBasicColumns(),
    useSearchForm: false,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
    // fetchSetting: getFetchSetting('buyers'),
    // 请求之前对参数做处理
    // beforeFetch: getBeforeFetch,
    rowKey: 'id',
  });

  // const goIndexDetail = (record) => {
  //   go(`/settlement/basic/indexDetail/${record.id}`);
  // };
</script>

<style lang="less" scoped>
  .all-del {
    margin: 0px 10px;
  }
</style>
