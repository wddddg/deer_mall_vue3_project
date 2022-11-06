import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 表格列定义
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '任务名称',
      dataIndex: 'nickName',
      align: 'left',
      width: 200,
    },
    {
      title: '所属模块',
      dataIndex: 'createdDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '大小',
      dataIndex: 'phoneNumber',
      align: 'left',
    },
    {
      title: '创建时间',
      dataIndex: 'companyUrl',
      align: 'left',
    },
    {
      title: '完成时间',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '任务状态',
      dataIndex: 'name',
      align: 'left',
    },
  ];
}
// 跳转后的表单列
export function getBasicColumnsStore(): BasicColumn[] {
  return [
    {
      title: '付款时间',
      dataIndex: 'nickName',
      align: 'left',
      width: 200,
    },
    {
      title: '订单号',
      dataIndex: 'createdDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '商品名称',
      dataIndex: 'phoneNumber',
      align: 'left',
    },
    {
      title: '单价',
      dataIndex: 'companyUrl',
      align: 'left',
    },
    {
      title: '数量',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '运费',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '退款金额',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '服务费率',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '服务费',
      dataIndex: 'createdDate',
      align: 'left',
    },
    {
      title: '结算金额',
      dataIndex: 'mobile',
      align: 'left',
    },
  ];
}
// 表格搜索条件
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 80,
    schemas: [
      {
        field: `nickName`,
        label: `店铺名称`,
        component: 'Input',
        colProps: {
          span: 8,
        },
      },
      {
        field: `saleSubmittedDate`,
        label: `到账时间`,
        component: 'RangePicker',
        colProps: {
          span: 8,
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
          span: 8,
        },
      },
      {
        field: `endDate`,
        label: ``,
        component: 'Input',
        show: false,
        colProps: {
          span: 8,
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
