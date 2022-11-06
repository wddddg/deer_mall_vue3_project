<template>
  <BasicTable @register="registerTable">
    <!--插槽:列表中的操作菜单-->
    <template #bodyCell="{ column, record, text }">
      <!-- 自定义【评价编号】列 -->
      <template v-if="column.key == 'id'">
        <div
          class="link"
          @click="goDetail(record, 'evaluate')"
          v-if="hasPermission(permissionCodeList.EVALUATION_GET)"
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
    </template>
  </BasicTable>
</template>

<script setup lang="ts">
  import { BasicTable, useTable } from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getBasicColumns, getFormConfig } from './evaluate.data';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import { getReviewsList } from './evaluate.api';
  import { dateUtil } from '/@/utils/dateUtil';

  const permissionCodeList = {
    EVALUATION_GET: 'EVALUATION_GET',
    PRODUCT_DETAIL_GET: 'PRODUCT_DETAIL_GET',
    TRADE_DETAIL_GET: 'TRADE_DETAIL_GET',
  };

  const { hasPermission } = usePermission();
  const go = useGo();
  const [registerTable] = useTable({
    api: getReviewsList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    fetchSetting: getFetchSetting('tradeProductBuyerReviews'),
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
    },
    rowKey: 'id',
  });

  const goDetail = (record, type: 'order' | 'product' | 'evaluate') => {
    if (type == 'order') {
      go(`/order/trades/tradesListDetail/${record.tradeId}`);
    } else if (type == 'product') {
      go(`/goods/basic/productDetail/${record.productId}`);
    } else if (type == 'evaluate') {
      console.log('record.id =>', record.id);

      go(`/order/trades/evaluateDetail/${record.id}`);
    }
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
