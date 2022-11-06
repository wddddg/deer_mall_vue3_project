<template>
  <BasicTable @register="registerTable">
    <!--插槽:table标题-->
    <template #tableTitle>
      <a-button type="primary"> 导出报表 </a-button>
    </template>

    <!--插槽:列表中的操作菜单-->
    <template #bodyCell="{ column, record }" v-if="hasPermission('BILL_GET')">
      <template v-if="column.key === 'action'">
        <a-dropdown>
          <a class="ant-dropdown-link">更多 <Icon icon="ant-design:down-outlined" /> </a>
          <template #overlay>
            <a-menu class="antd-more">
              <a-menu-item>
                <a @click="goIndexDetail(record)">查看</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
    <template #mobile="{ record }">
      <a-tag class="statusTag" :color="record.mobile ? '#5cb85c' : '#f85e5e'">
        {{ record.mobile ? '已授权' : '未授权' }}
      </a-tag>
    </template>
  </BasicTable>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import Icon from '/@/components/Icon';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import { getBasicColumns, getFormConfig } from './settle.data';
  import { getSettleList } from './settle.api';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { dateUtil } from '/@/utils/dateUtil';
  const go = useGo();
  const { hasPermission } = usePermission();

  const [registerTable] = useTable({
    api: getSettleList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    fetchSetting: getFetchSetting('buyers'),
    // 请求之前对参数做处理
    beforeFetch: (params) => {
      getBeforeFetch(params);

      if (params?.saleSubmittedDate) {
        params.startDate = dateUtil(params.saleSubmittedDate[0]).format('YYYY-MM-DD 00:00:00');
        params.endDate = dateUtil(params.saleSubmittedDate[1]).format('YYYY-MM-DD 23:59:59');
      } else {
        params.startDate = undefined;
        params.endDate = undefined;
      }
      delete params.saleSubmittedDate;
    },
    rowKey: 'id',
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
    },
  });

  const goIndexDetail = (record) => {
    go('/settlement/basic/indexDetail/' + record.id);
  };
</script>
