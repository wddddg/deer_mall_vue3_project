import { ref } from 'vue';
import { getStatusTypesList } from './platform.api';
import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

const activeKey = ref('all');
const statusList = ref<any[]>([]);

export function useStatus() {
  statusList.value = [
    { label: '待生效', value: '1' },
    { label: '生效中', value: '2' },
    { label: '已失效', value: '3' },
  ];
  return {
    activeKey,
    statusList,
  };
}

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '优惠券名称',
      dataIndex: 'nickName',
      align: 'left',
    },
    {
      title: '优惠券金额（元）',
      dataIndex: 'money',
      align: 'left',
    },
    {
      title: '使用门槛',
      dataIndex: 'door',
      align: 'left',
    },
    {
      title: '优惠券有效期',
      dataIndex: 'isTimer',
      align: 'left',
    },
    {
      title: '创券时间',
      dataIndex: 'createdTime',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 90,
    showAdvancedButton: false,
    schemas: [
      {
        field: `shopName`,
        label: `优惠券名称`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `statusCode`,
        label: `优惠券状态`,
        labelWidth: 110,
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
            { label: '待生效', value: '1' },
            { label: '生效中', value: '2' },
            { label: '已失效', value: '3' },
          ],
        },
        colProps: {
          span: 4,
        },
      },
      {
        field: `saleSubmittedDate`,
        label: `创券时间`,
        component: 'RangePicker',
        colProps: {
          span: 6,
        },
        componentProps: ({ formModel }) => {
          return {
            onChange(field, value) {
              formModel.startDate = value[0];
              formModel.endDate = value[1];
            },
          };
        },
      },
      {
        field: `startDate`,
        label: ``,
        component: 'Input',
        show: false,
        colProps: {
          span: 4,
        },
      },
      {
        field: `endDate`,
        label: ``,
        component: 'Input',
        show: false,
        colProps: {
          span: 4,
        },
      },
      {
        field: `saleSubmittedDate`,
        label: `有效期`,
        component: 'RangePicker',
        colProps: {
          span: 6,
        },
        componentProps: ({ formModel }) => {
          return {
            onChange(field, value) {
              formModel.startDate = value[0];
              formModel.endDate = value[1];
            },
          };
        },
      },
      {
        field: `startDate`,
        label: ``,
        component: 'Input',
        show: false,
        colProps: {
          span: 4,
        },
      },
      {
        field: `endDate`,
        label: ``,
        component: 'Input',
        show: false,
        colProps: {
          span: 4,
        },
      },
      {
        field: `nickName`,
        label: `优惠金额`,
        labelWidth: 100,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
    ],
  };
}
