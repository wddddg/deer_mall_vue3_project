<template>
  <BasicTable @register="registerTable" :searchInfo="searchInfo" />
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  // import { getBasicColumns, searchFormSchema } from './salesMan.data';
  import { Alert } from 'ant-design-vue';

  import { listIng } from '../salesMan.api';
  import { useGo } from '/@/hooks/web/usePage';

  const columns: BasicColumn[] = [
    {
      title: '订单关闭时间',
      dataIndex: 'tradeCompletedDate',
      fixed: 'center',
      width: 280,
    },
    {
      title: '名称',
      dataIndex: 'productName',
      width: 260,
    },
    {
      dataIndex: 'orderNo',
      title: '订单编号|支付单号',
      align: 'center',
      customRender: ({ record }) => {
        return record.tradeId + ' | ' + record.wxTradeId;
      },
    },
    {
      title: '分账金额（元）',
      dataIndex: 'finishFee',
      width: 300,
    },
    {
      title: '订单金额（元）',
      width: 200,
      dataIndex: 'tradePaidFee',
    },
    {
      title: '订单状态',
      dataIndex: 'tradeStatus',
      width: 200,
      customRender: ({ record }) => {
        return record.tradeStatus.name;
      },
    },
  ];

  const searchFormSchema = [
    {
      field: 'keywords',
      label: '订单编号|支付单号',
      component: 'Input',
      colProps: { span: 6 },
      placeholder: '请输入订单编号|支付单号',
    },
  ];

  export default defineComponent({
    components: { BasicTable, AAlert: Alert, TableAction },
    setup() {
      const go = useGo();
      const checkedKeys = ref<Array<string | number>>([]);
      const { currentRoute } = useRouter();
      const { params } = unref(currentRoute);
      const { path } = params;
      const searchInfo = {
        buyerId: path,
        categoryCode: 'PRODUCT',
        keywords: null,
        result: 'CLOSED',
      };
      const [registerTable, { getForm }] = useTable({
        title: '',
        api: listIng,
        columns: columns,
        useSearchForm: true,
        formConfig: {
          labelWidth: 124,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        showTableSetting: false,
        tableSetting: { fullScreen: true },
        showIndexColumn: false,
        fetchSetting: {
          // 传给后台的当前页字段
          pageField: 'offset',
          // 传给后台的每页显示多少条的字段
          sizeField: 'limit',
          // 接口返回表格数据的字段
          listField: 'tradeProfitSharingSales',
          // 接口返回表格总数的字段
          totalField: 'totalCount',
        },
        // 请求之前对参数做处理
        beforeFetch(params) {
          params.offset = params.offset > 1 ? params.offset - 1 : 0;
        },
        rowKey: 'id',
      });

      function getFormValues() {
        console.log(getForm().getFieldsValue());
      }

      function onSelectChange(selectedRowKeys: (string | number)[]) {
        console.log(selectedRowKeys);
        checkedKeys.value = selectedRowKeys;
      }
      function handleView(record: Recordable) {
        go('/merchant/salesMan/salesManDetail/' + record.id);
      }

      return {
        searchInfo,
        handleView,
        registerTable,
        getFormValues,
        checkedKeys,
        onSelectChange,
      };
    },
  });
</script>
