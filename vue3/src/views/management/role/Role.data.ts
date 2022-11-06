import { FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

export function getBasicColumns(): BasicColumn[] {
  return [
    // {
    //   title: '序号',
    //   dataIndex: 'id',
    //   align: 'left',
    // },
    {
      title: '角色类型',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '备注',
      dataIndex: 'description',
      align: 'left',
    },
  ];
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色类型名称',
    component: 'Input',
    colProps: { span: 4 },
  },
];

export const infoFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    colProps: { span: 24 },
    show: false,
  },
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'description',
    label: '描述',
    component: 'Input',
    colProps: { span: 16 },
  },
];
