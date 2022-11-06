<!--
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-24 21:14:38
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-25 18:36:45
-->
<template>
  <BasicTable @register="registerTable">
    <template #form-custom> custom-slot </template>
    <template #firstAction>
      <Icon icon="ion:language" />
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <div style="color: #007bff" @click="showAccount(record)"> 查看 </div>
      </template>
      <template v-if="column.key === 'name'">
        <div :style="record.enabled ? { color: '#5cb85c' } : {}">
          {{ record.enabled ? '使用中' : '已停用' }}
        </div>
      </template>
    </template>
  </BasicTable>
  <StaffDrawer @register="registerDrawer" />
</template>
<script lang="ts" name="staff" setup>
  import { unref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getStaffColumns } from '../shop.data';
  import { useDrawer } from '/@/components/Drawer';
  import StaffDrawer from './StaffDrawer.vue';

  import { staffList } from '../shop.api';
  import { useRouter } from 'vue-router';
  const { currentRoute } = useRouter();
  const { params } = unref(currentRoute);
  const { path } = params;
  console.log(path, 'path');
  const [registerDrawer, { openDrawer, setDrawerProps }] = useDrawer();
  // 打开关联店铺记录弹窗
  const showAccount = (record) => {
    // let data = { columns: getStoreColumns, api: storeList + '/' + record.id, record };
    openDrawer(true, record);
    setDrawerProps({ title: '员工信息' });
  };
  const [registerTable, {}] = useTable({
    // title: '开启搜索区域',
    api: staffList,
    searchInfo: { shopId: path },
    columns: getStaffColumns(),
    useSearchForm: false,
    // formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'pageNo',
      // 传给后台的每页显示多少条的字段
      sizeField: 'pageSize',
      // 接口返回表格数据的字段
      listField: 'shopVendors',
      // 接口返回表格总数的字段
      totalField: 'totalCount',
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
      params.pageNo = params.pageNo - 1;
    },
    rowKey: 'id',
  });
</script>
