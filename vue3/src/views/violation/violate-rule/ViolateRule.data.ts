import { ref } from 'vue';
import { getStatusTypesList } from './violateRule.api';
import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '店铺名称',
      dataIndex: 'nickName',
      align: 'left',
    },
    {
      title: '违规编号',
      dataIndex: 'id',
      align: 'left',
    },
    {
      title: '违规时间',
      dataIndex: 'createdDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '违规类型',
      dataIndex: 'type',
      align: 'left',
      customRender: ({ text }) => {
        return text.name;
      },
    },
    {
      title: '扣分',
      dataIndex: '',
      align: 'left',
    },
    {
      title: '申诉',
      dataIndex: '',
      align: 'left',
    },
    {
      title: '处罚状态',
      dataIndex: 'status',
      align: 'left',
      customRender: ({ text }) => {
        return text.name;
      },
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
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
        field: `id`,
        label: `违规编号`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `saleSubmittedDate`,
        label: `违规时间`,
        component: 'RangePicker',
        colProps: {
          span: 6,
        },
        componentProps: {
          format: 'YYYY-MM-DD',
        }
      },
      {
        field: `statusCode`,
        label: `申诉`,
        // component: 'ApiSelect',
        component: 'Select',
        componentProps: {
          // api: getStatusTypesList,
          // labelField: 'name',
          // valueField: 'code',
          // onOptionsChange: (e) => {
          // 清空数组
          // statusList.value.splice(0);

          // for (const item of e) {
          //   statusList.value.push(item);
          //   console.log(item);

          // }
          // },
          // onChange: (e) => {
          //   activeKey.value = e;
          // },
          options: [
            { label: '可申述', value: '1' },
            { label: '不申诉', value: '2' },
          ],
        },
        colProps: {
          span: 4,
        },
      },
      {
        field: `status`,
        label: `处罚状态`,
        // component: 'ApiSelect',
        component: 'Select',
        componentProps: {},
        colProps: {
          span: 4,
        },
      },
    ],
  };
}
