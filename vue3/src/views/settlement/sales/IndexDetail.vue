<template>
  <div>
    <a-row class="p-4" :gutter="10">
      <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
        <a-card :bordered="false" style="height: 100%">
          <Store />
        </a-card>
      </a-col>
    </a-row>
    <div class="footerBack">
      <a-button class="goBack" @click="goBack">返回</a-button>
    </div>
  </div>
</template>

<script lang="ts" name="shopDetail" setup>
  import Store from './components/Store.vue';
  import { useGo } from '/@/hooks/web/usePage';
  const go = useGo();
  const goBack = () => {
    go('/settlement/sales/index');
  };
</script>

<style lang="less">
  :deep(.ant-card-head-title) {
    padding: 16px 0 0 0;
  }
  :deep(.ant-card-body) {
    padding: 12px;
    background-color: rgb(247, 247, 247);
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
  .footerBack {
    position: relative;
    .goBack {
      margin-right: 1rem;
      position: absolute;
      right: 0;
    }
  }
</style>
