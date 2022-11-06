<template>
  <BasicTable @register="registerTable">
    <!--插槽:table标题中的 tab框-->
    <template #headerTop>
      <a-tabs @change="tabChange" :activeKey="activeKey">
        <!-- <a-tab-pane tab="全部" key="all" forceRender /> -->
        <a-tab-pane v-for="item in statusList" :tab="item.label" :key="item.value" />
      </a-tabs>
    </template>

    <!--插槽:列表中的操作菜单-->
    <template #bodyCell="{ column, record, text }">
      <!-- 自定义【订单编号】列 -->
      <template v-if="column.key == 'tradeId'">
        <div
          class="link"
          @click="goDetail(record, 'order')"
          v-if="hasPermission(permissionCodeList.TRADE_DETAIL_GET)"
        >
          <span>{{ text }}</span>
        </div>
        <div v-else>
          <span>{{ text }}</span>
        </div>
      </template>
      <!-- 自定义【商品名称】列 -->
      <template v-if="column.key == 'productName'">
        <div
          class="link"
          @click="goDetail(record, 'product')"
          v-if="hasPermission(permissionCodeList.PRODUCT_DETAIL_GET)"
        >
          <span>{{ text }}</span>
        </div>
        <div v-else>
          <span>{{ text }}</span>
        </div>
      </template>
      <!-- 自定义【所属店铺】列 -->
      <template v-if="column.key == 'shopName'">
        <div
          class="link"
          @click="goDetail(record, 'shop')"
          v-if="hasPermission(permissionCodeList.SHOP_DETAIL_GET)"
        >
          <span>{{ text }}</span>
        </div>
        <div v-else>
          <span>{{ text }}</span>
        </div>
      </template>
    </template>
  </BasicTable>
</template>

<script setup lang="ts">
  import { BasicTable, useTable } from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import { getBasicColumns, getFormConfig, useStatus } from './tradesList.data';
  import { getTradesList } from './tradesList.api';
  import { dateUtil } from '/@/utils/dateUtil';

  const { statusList, activeKey } = useStatus();
  const permissionCodeList = {
    TRADE_DETAIL_GET: 'TRADE_DETAIL_GET',
    PRODUCT_DETAIL_GET: 'PRODUCT_DETAIL_GET',
    SHOP_DETAIL_GET: 'SHOP_DETAIL_GET',
  };

  const { hasPermission } = usePermission();
  const go = useGo();
  const [registerTable, { reload, getForm }] = useTable({
    api: getTradesList,
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
        params.startDate = dateUtil(params.createdDate[0]).format('YYYY-MM-DD 00:00:00');
        params.endDate = dateUtil(params.createdDate[1]).format('YYYY-MM-DD 23:59:59');
      } else {
        params.startDate = undefined;
        params.endDate = undefined;
      }
      delete params.createdDate;

      if (activeKey.value !== 'all') {
        params.statusCode = activeKey.value;
      } else {
        params.statusCode = '';
      }
    },
    rowKey: 'tradeId',
  });

  const goDetail = (record, type: 'order' | 'product' | 'shop') => {
    if (type == 'order') {
      go(`/order/trades/tradesListDetail/${record.tradeId}`);
    } else if (type == 'product') {
      go(`/goods/basic/productDetail/${record.productId}`);
    } else if (type == 'shop') {
      go(`/merchant/basic/shopDetail/${record.shopId}`);
    }
  };

  // tab切换时重新加载数据
  const tabChange = (key) => {
    activeKey.value = key;
    // if (key == 'all') {
    //   getForm().resetFields();
    // } else {
    //   getForm().setFieldsValue({ statusCode: key });
    // }
    getForm().setFieldsValue({ statusCode: key });
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
