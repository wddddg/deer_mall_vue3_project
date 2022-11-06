<template>
  <BasicTable @register="registerTable">
    <!--插槽:table标题-->
    <template #headerTop>
      <a-button type="primary"> 创建 </a-button>
    </template>
    <!--插槽:table标题中的 tab框-->
    <template #tableTitle>
      <a-tabs @change="tabChange" :activeKey="activeKey">
        <a-tab-pane tab="全部" key="all" forceRender />
        <a-tab-pane v-for="item in statusList" :tab="item.label" :key="item.value" />
      </a-tabs>
    </template>
  </BasicTable>
</template>

<script setup lang="ts">
  import { BasicTable, useTable } from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import { getBasicColumns, getFormConfig, useStatus } from './platform.data';
  import { getTradesList } from './platform.api';

  const { statusList, activeKey } = useStatus();

  const dataSource = [
    {
      nickName: '5元劵',
      money: '5',
      door: '满15可用',
      isTimer: '2022.07.01 - 2022.07.10',
      createdTime: '2022.08.30',
      name: '金大福珠宝行',
      shopNumber: '10252363',
    },
    {
      nickName: '15元劵',
      money: '15',
      door: '满20可用',
      isTimer: '2022.07.01 - 2022.07.10',
      createdTime: '2022.02.22',
      name: '好运来文玩店',
      shopNumber: '17541254',
    },
    {
      nickName: '25元劵',
      money: '25',
      door: '满40可用',
      isTimer: '2022.07.01 - 2022.07.10',
      createdTime: '2022.03.11',
      name: '素芳斋',
      shopNumber: '10252363',
    },
    {
      nickName: '15元劵',
      money: '15',
      door: '满30可用',
      isTimer: '2022.04.21 - 2022.08.10',
      createdTime: '2022.04.21',
      name: '金大福珠宝行',
      shopNumber: '00154120',
    },
    {
      nickName: '35元劵',
      money: '35',
      door: '满50可用',
      isTimer: '2022.09.11 - 2022.09.12',
      createdTime: '2022.09.11',
      name: '缘定终身婚戒定制店',
      shopNumber: '11245600',
    },
  ];

  // const go = useGo();
  const [registerTable, { reload, getForm }] = useTable({
    // api: getTradesList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: false, redo: false, size: false, setting: false },
    showIndexColumn: false,
    fetchSetting: getFetchSetting('trades'),
    beforeFetch: (params) => {
      getBeforeFetch(params);
      if (params?.createdDate) {
        params.startDate = params.createdDate[0];
        params.endDate = params.createdDate[1];
        delete params.createdDate;
      }
      if (activeKey.value !== 'all') {
        params.statusCode = activeKey.value;
      }
    },
    dataSource: dataSource,
    rowKey: 'tradeId',
  });

  // const goDetail = (record, type: 'order' | 'product' | 'shop') => {
  //   if (type == 'order') {
  //     go(`/order/trades/tradesListDetail/${record.tradeId}`);
  //   } else if (type == 'product') {
  //     go(`/goods/basic/productDetail/${record.productId}`);
  //   } else if (type == 'shop') {
  //     go(`/merchant/basic/shopDetail/${record.shopId}`);
  //   }
  // };

  // tab切换时重新加载数据
  const tabChange = (key) => {
    activeKey.value = key;
    if (key == 'all') {
      getForm().resetFields();
    } else {
      getForm().setFieldsValue({ statusCode: key });
    }
    reload({
      page: 1,
    });
  };
</script>

<style lang="less" scoped>
  .link {
    cursor: pointer;
    &:hover {
      color: #007bff;
    }
  }
</style>
