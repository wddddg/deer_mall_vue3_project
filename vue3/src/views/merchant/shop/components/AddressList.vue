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
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'returnProductAddressDefault'">
        <Icon
          size="18"
          color="#5CB85C"
          icon="ant-design:check-circle-outlined"
          v-if="record?.returnProductAddressDefault"
        />
        <span v-if="!record?.returnProductAddressDefault">-</span>
      </template>
      <template v-if="column.key === 'invoiceAddressDefault'">
        <Icon
          size="18"
          color="#5CB85C"
          icon="ant-design:check-circle-outlined"
          v-if="record?.invoiceAddressDefault"
        />
        <span v-if="!record?.invoiceAddressDefault">-</span>
      </template>
    </template>
  </BasicTable>
</template>
<script lang="ts" name="staff" setup>
  import { unref } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { BasicTable, useTable } from '/@/components/Table';
  import Icon from '/@/components/Icon';
  import { getAddressColumns } from '../shop.data';
  import { addressList } from '../shop.api';
  import { useRouter } from 'vue-router';
  const { currentRoute } = useRouter();
  const { params } = unref(currentRoute);
  const { path } = params;
  console.log(path, 'path');
  const addressListApi = () => {
    return defHttp.get({ url: addressList + '/' + path });
  };
  const [registerTable, {}] = useTable({
    // title: '开启搜索区域',
    api: addressListApi,
    columns: getAddressColumns(),
    useSearchForm: false,
    // formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    // 请求之前对参数做处理
    beforeFetch(params) {
      params.offset = params.offset - 1;
    },
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'offset',
      // 传给后台的每页显示多少条的字段
      sizeField: 'limit',
      // 接口返回表格数据的字段
      listField: 'shopVendors',
      // 接口返回表格总数的字段
      totalField: 'totalCount',
    },
    rowKey: 'id',
  });
</script>
