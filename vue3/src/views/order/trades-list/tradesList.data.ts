import { ref } from 'vue';
import { getStatusTypesList } from './tradesList.api';
import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

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
      title: '订单编号',
      dataIndex: 'tradeId',
      align: 'left',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      align: 'left',
    },
    {
      title: '商品编号',
      dataIndex: 'productId',
      align: 'left',
    },
    {
      title: '交易金额',
      dataIndex: 'paidFee',
      align: 'left',
    },
    {
      title: '所属店铺',
      dataIndex: 'shopName',
      align: 'left',
    },
    {
      title: '交易状态',
      dataIndex: 'status',
      align: 'left',
      customRender: ({ record }) => {
        return record.status?.name || '';
      },
    },
    {
      title: '创建时间',
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
        field: `tradeId`,
        label: `订单编号`,
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
        field: `productId`,
        label: `商品编号`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `createdDate`,
        label: `创建时间`,
        component: 'RangePicker',
        componentProps: {
          format: 'YYYY-MM-DD',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: `statusCode`,
        label: `交易状态`,
        component: 'ApiSelect',
        componentProps: {
          api: async () => {
            const list = (await getStatusTypesList()) as any[];
            list.unshift({ code: 'all', name: '全部' });

            return list;
          },
          // value: '全部',
          // value: 'all',
          // 'v-model:value': 'all',
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
