import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 表格列定义
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '物流公司名称',
      dataIndex: 'name',
      align: 'left',
      width: 200,
    },
    {
      title: '物流公司代码',
      dataIndex: 'code',
      align: 'left',
    },
    {
      title: '公司联系电话',
      dataIndex: 'phoneNumber',
      align: 'left',
    },
    {
      title: '物流公司网址',
      dataIndex: 'companyUrl',
      align: 'left',
    },
  ];
}

// 表格搜索条件
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 80,
    showAdvancedButton: false,
    schemas: [
      {
        field: `name`,
        label: `公司名称`,
        component: 'Input',
        colProps: {
          span: 5,
        },
      },
    ],
  };
}

// 表单编辑
export const formSchema: FormSchema[] = [
  // 主键隐藏字段
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '物流公司名称',
    labelWidth: 120,
    field: 'name',
    required: true,
    component: 'Input',
    colProps: {
      span: 24,
    },
  },
  {
    label: '物流公司代码',
    labelWidth: 120,
    field: 'code',
    required: true,
    component: 'Input',
    colProps: {
      span: 24,
    },
  },
  {
    label: '公司联系电话',
    labelWidth: 120,
    field: 'phoneNumber',
    required: true,
    component: 'Input',
    colProps: {
      span: 24,
    },
  },
  {
    label: '物流公司网址',
    labelWidth: 120,
    field: 'companyUrl',
    component: 'Input',
    colProps: {
      span: 24,
    },
  },
];
