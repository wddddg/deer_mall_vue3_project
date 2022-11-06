import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 表格列定义
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '店铺名称',
      dataIndex: 'nickName',
      align: 'left',
      width: 200,
    },
    {
      title: '到账时间',
      dataIndex: 'createdDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '订单数量',
      dataIndex: 'phoneNumber',
      align: 'left',
    },
    {
      title: '订单总额',
      dataIndex: 'companyUrl',
      align: 'left',
    },
    {
      title: '总运费',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '退款总金额',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '结算金额',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '服务费',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '结算时间',
      dataIndex: 'createdDate',
      align: 'left',
    },
    {
      title: '结算状态',
      dataIndex: 'mobile',
      align: 'left',
      slots: { customRender: 'mobile' },
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
    showAdvancedButton: false,
    schemas: [
      {
        field: `nickName`,
        label: `店铺名称`,
        component: 'Input',
        colProps: {
          span: 5,
        },
      },
      {
        field: `saleSubmittedDate`,
        label: `到账时间`,
        component: 'RangePicker',
        colProps: {
          span: 8,
        },
        componentProps:{
          format: 'YYYY-MM-DD',
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
