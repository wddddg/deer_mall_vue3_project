import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { getListCurrentStatusCodes } from './afterSales.api';
import { ref } from 'vue';

const activeKey = ref('all');
const statusList = ref<any[]>([]);

export function useStatus() {
  return {
    activeKey,
    statusList,
  };
}

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '售后编号',
      dataIndex: 'id',
      align: 'left',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      align: 'left',
    },
    {
      title: '订单编号',
      dataIndex: 'tradeId',
      align: 'left',
    },
    {
      title: '交易金额',
      dataIndex: 'refund',
      align: 'left',
    },
    {
      title: '所属店铺',
      dataIndex: 'shopName',
      align: 'left',
    },
    {
      title: '售后类型',
      dataIndex: 'type',
      align: 'left',
      customRender: ({ record }) => {
        return record.type?.name || '';
      },
    },
    {
      title: '售后状态',
      dataIndex: 'currentStatusCode',
      customRender: ({ record, text }) => {
        return text === 'AFTER_SALE_MAMA_AGREED'
          ? '平台同意申请'
          : text === 'AFTER_SALE_MAMA_REJECTED'
          ? '平台驳回申请'
          : record?.currentStatus?.name;
      },
      align: 'left',
    },
    {
      title: '申请时间',
      dataIndex: 'createdDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 80,
    showAdvancedButton: false,
    schemas: [
      {
        field: `shopName`,
        label: `店铺名称`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `productName`,
        label: `商品名称`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `tradeId`,
        label: `订单编号`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `id`,
        label: `售后编号`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `createdDate`,
        label: `申请时间`,
        component: 'RangePicker',
        componentProps: {
          format: 'YYYY-MM-DD',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: `currentStatusCode`,
        label: `售后状态`,
        component: 'ApiSelect',
        componentProps: {
          api: async () => {
            const list = (await getListCurrentStatusCodes()) as any[];
            list.unshift({ code: 'all', name: '全部' });

            return list;
          },
          placeholder: '全部',
          labelField: 'name',
          valueField: 'code',
          onOptionsChange: (e) => {
            // 清空数组
            statusList.value.splice(0);

            for (const item of e) {
              statusList.value.push(item);
            }
          },
          onChange: (e) => {
            console.log('e =>', e);

            activeKey.value = e;
          },
        },
        colProps: {
          span: 4,
        },
      },
    ],
  };
}
