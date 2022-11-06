<template>
  <BasicTable @register="registerTable">
    <!--插槽:table标题-->
    <template #tableTitle>
      <a-button
        type="primary"
        @click="openModals"
        v-if="hasPermission('TRADE_PROFIT_EXPORT_REPORT')"
      >
        导出报表
      </a-button>
    </template>
    <template #statusCode="{ record }">
      <a-tag
        class="statusTag"
        :color="
          record.statusCode === 'PENDING'
            ? '#3582fb'
            : record.statusCode === 'rgb(255, 85, 0)'
            ? '处理中'
            : '#a7a7a7'
        "
      >
        {{
          record.statusCode === 'PENDING'
            ? '待分账'
            : record.statusCode === 'PROCESSING'
            ? '处理中'
            : '处理完成'
        }}
      </a-tag>
    </template>
    <!--插槽:列表中的操作菜单-->
    <template #bodyCell="{ column, record, text }">
      <!-- 自定义【订单编号】列 -->
      <template v-if="column.key == 'tradeId'">
        <div @click="hasPermission('TRADE_DETAIL_GET')? goDetail(record, 'order'):''" :class="hasPermission('TRADE_DETAIL_GET')? 'link' : 'no-drop'">
          <span>{{ text }}</span>
        </div>
      </template>
      <!-- 自定义【商品名称】列 -->
      <template v-if="column.key == 'id'">
        <div class="link" @click="goDetail(record, 'id')">
          <span>{{ text }}</span>
        </div>
      </template>
      <!-- 自定义【所属店铺】列 -->
      <template v-if="column.key == 'shopName'">
        <div @click="hasPermission('SHOP_DETAIL_GET')?goDetail(record, 'shop'):''" :class="hasPermission('SHOP_DETAIL_GET')? 'link' : 'no-drop'">
          <span>{{ text }}</span>
        </div>
      </template>
    </template>
  </BasicTable>
  <Modal @register="modalRegister" />
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import Modal from './components/Modal.vue';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import { getBasicColumns, getFormConfig } from './sales.data';
  import { getSalesList } from './sales.api';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';
  const go = useGo();
  const { hasPermission } = usePermission();

  const [registerTable] = useTable({
    api: getSalesList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    fetchSetting: getFetchSetting('tradeProfitSharingList'),
    // 请求之前对参数做处理
    beforeFetch: getBeforeFetch,
    rowKey: 'id',
  });

  const goIndexDetail = (record) => {
    go('/settlement/basic/indexDetail/' + record.id);
  };

  const [modalRegister, { openModal, setModalProps }] = useModal();
  const openModals = (data) => {
    openModal(true, data);
  };
  const goDetail = (record, type: 'order' | 'id' | 'shop') => {
    if (type == 'order') {
      go(`/order/trades/tradesListDetail/${record.tradeId}`);
    } else if (type == 'id') {
      go(`/settlement/sales/indexDetail/${record.id}`);
    } else if (type == 'shop') {
      go(`/merchant/basic/shopDetail/${record.shopId}`);
    }
  };
</script>

<style scoped lang="less">
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
