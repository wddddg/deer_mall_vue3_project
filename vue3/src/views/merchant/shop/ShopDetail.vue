<!--
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-24 21:58:47
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-25 18:42:06
-->
<template>
  <a-row class="p-4" :gutter="10">
    <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
      <a-card :bordered="false" style="height: 100%">
        <a-tabs defaultActiveKey="all-info">
          <a-tab-pane tab="店铺信息" key="shop-info" :destroyInactiveTabPane="true">
            <Store />
          </a-tab-pane>
          <a-tab-pane tab="员工信息" key="staff-info" :destroyInactiveTabPane="true">
            <staffList
          /></a-tab-pane>
          <a-tab-pane tab="地址库" key="address" :destroyInactiveTabPane="true">
            <AddressList />
          </a-tab-pane>
          <a-tab-pane tab="店铺数据" key="shop-data" :destroyInactiveTabPane="true">
            <ShopData
          /></a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
  </a-row>
</template>

<script lang="ts" name="shopDetail" setup>
  import Store from './components/Store.vue';
  import ShopData from './components/ShopData.vue';
  import staffList from './components/Staff.vue';
  import AddressList from './components/AddressList.vue';
</script>

<style lang="less" scoped>
  :deep(.ant-card-head-title) {
    padding: 16px 0 0 0;
  }
  :deep(.ant-card-body) {
    padding: 12px;
  }
  :deep(.ant-card-head) {
    font-weight: bold;
  }
  .mr10 {
    margin-right: 10px;
  }
  .footer {
    margin-top: 24px;
    padding-left: 200px;
    height: 30px;
  }
</style>
