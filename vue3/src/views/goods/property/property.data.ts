import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 表格列定义
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '编号',
      dataIndex: 'id',
      align: 'left',
      width: 200,
    },
    {
      title: '属性名称',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '属性类型',
      dataIndex: 'type',
      align: 'left',
      customRender: ({ record }) => {
        return record?.type?.name || '';
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'left',
      customRender: ({ text }) => {
        return text || '-';
      },
    },
  ];
}

// 表格搜索条件
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 80,
    schemas: [
      {
        field: `name`,
        label: `属性名称`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
    ],
  };
}
