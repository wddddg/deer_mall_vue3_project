import { FormProps } from '/@/components/Table';
import { FormSchema } from '/@/components/Form/index';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { statusCodeList, typeCodeList } from './customer.api';
const span = 5;

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '反馈编号',
      dataIndex: 'id',
      align: 'left',
      slots: { customRender: 'feedbackId' },
    },
    {
      title: '反馈内容',
      dataIndex: 'description',
      align: 'left',
    },
    {
      title: '反馈人',
      dataIndex: 'createdUserNickName',
      align: 'left',
    },
    {
      title: '反馈分类',
      dataIndex: 'typeCode',
      align: 'left',
      customRender: ({ record }) => {
        return record?.typeCode ? record?.type?.name : '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'statusCode',
      align: 'left',
      customRender: ({ record }) => {
        return record?.statusCode ? record?.status?.name : '-';
      },
    },
    {
      title: '反馈提交时间',
      dataIndex: 'createdDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
  ];
}
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    showAdvancedButton: false,
    schemas: [
      {
        field: `id`,
        label: `反馈编号`,
        component: 'Input',
        colProps: {
          span: span,
        },
      },
      {
        field: `createdUserNickName`,
        label: `消费者昵称`,
        component: 'Input',
        colProps: {
          span: span,
        },
      },

      {
        field: `statusCode`,
        label: `状态`,
        component: 'ApiSelect',
        componentProps: {
          api: statusCodeList,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: {
          span: span,
        },
      },
      {
        field: `typeCode`,
        label: `反馈分类`,
        component: 'ApiSelect',
        componentProps: {
          api: typeCodeList,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: {
          span: span,
        },
      },
    ],
  };
}
