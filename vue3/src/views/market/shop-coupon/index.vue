<template>
  <BasicTable @register="registerTable">
    <!--插槽:列表中的操作菜单-->
    <!-- <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a-dropdown>
          <a class="ant-dropdown-link">更多 <Icon icon="ant-design:down-outlined" /> </a>
          <template #overlay>
            <a-menu class="antd-more">
              <a-menu-item>
                <a @click="goIndexDetail(record)" v-if="hasPermission('BILL_GET')">查看</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template> -->
  </BasicTable>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import Icon from '/@/components/Icon';
  import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
  import { getBasicColumns, getFormConfig } from './shopCoupon.data';
  import { getSettleList } from './shopCoupon.api';
  // import { useGo } from '/@/hooks/web/usePage';
  // import { usePermission } from '/@/hooks/web/usePermission';
  // const go = useGo();
  // const { hasPermission } = usePermission();
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

  const [registerTable] = useTable({
    // api: getSettleList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    // fetchSetting: getFetchSetting('buyers'),
    // 请求之前对参数做处理
    // beforeFetch: getBeforeFetch,
    dataSource: dataSource,
    rowKey: 'id',
    // actionColumn: {
    //   width: 110,
    //   title: '操作',
    //   dataIndex: 'action',
    // },
  });

  // const goIndexDetail = (record) => {
  //   go('/settlement/basic/indexDetail/' + record.id)
  // };
</script>
