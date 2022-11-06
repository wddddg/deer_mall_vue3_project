import { h } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 表格列定义
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '分账编号',
      dataIndex: 'id',
      align: 'left',
      width: 200,
    },
    {
      title: '店铺名称',
      dataIndex: 'shopName',
      align: 'left',
    },
    {
      title: '订单编号',
      dataIndex: 'tradeId',
      align: 'left',
    },
    {
      title: '微信订单号',
      dataIndex: 'wxTradeId',
      align: 'left',
    },
    {
      title: '支付时间',
      dataIndex: 'paidDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '分账申请时间',
      dataIndex: 'createdDate',
      format: 'date|YYYY-MM-DD HH:mm:ss',
      filterDropdown: true,
      filterIcon: () => {
        return h(Tooltip, { title: '即确认收货时间' }, [h(ExclamationCircleOutlined)])
      }
    },
    {
      title: '分账完成时间',
      dataIndex: 'finishedDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '分账状态',
      dataIndex: 'statusCode',
      align: 'left',
      slots: { customRender: 'statusCode' },
      width: 100,
    },
    {
      title: '分账金额',
      dataIndex: 'finishFee',
      align: 'left',
      width: 100,
    },
  ];
}
// 跳转后的表单列
export function getBasicColumnsStore(): BasicColumn[] {
  return [
    {
      title: '分账发起时间',
      dataIndex: 'createdDate',
      align: 'left',
      width: 200,
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '分账完成时间',
      dataIndex: 'finishedDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '分账接收方',
      dataIndex: 'receiverAccount',
      align: 'left',
    },
    {
      title: '分账接收方名称',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '分账接收方类型',
      dataIndex: 'type',
      align: 'left',
    },
    {
      title: '分账描述',
      dataIndex: 'description',
      align: 'left',
    },
    {
      title: '分账结果',
      dataIndex: 'result',
      align: 'left',
      customRender:({text}) => {
        return text === 'PENDING'? '待分账':'分账成功'
      }
    },
    {
      title: '分账金额(元)',
      dataIndex: 'finishFee',
      align: 'left',
      customRender:({text}) => {
        return completingDecimalLength(text) || "0.00"
      }
    },
    {
      title: '总金额比例(%)',
      dataIndex: 'finishRate',
      align: 'left',
      customRender:({text}) => {
        return text*100 + '%'
      }
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
        field: `shopName`,
        label: `店铺名称`,
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: `tradeId`,
        label: `订单编号`,
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: `wxTradeId`,
        label: `微信订单号`,
        labelWidth: 100,
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: `statusCode`,
        label: `分账状态`,
        component: 'Select',
        colProps: {
          span: 6,
        },
        componentProps: {
          options: [
            {
              label: '待分账',
              value: 'PENDING',
            },
            {
              label: '处理中',
              value: 'PROCESSING',
            },
            {
              label: '处理完成',
              value: 'FINISHED',
            },
          ],
        },
      },
      {
        field: `billTime`,
        label: `账单时间`,
        component: 'Select',
        colProps: {
          span: 4,
        },
        componentProps: {
          options: [
            {
              label: '支付时间',
              value: 'pay',
            },
            {
              label: '确定收货时间',
              value: 'created',
            },
          ],
        },
      },
      {
        field: ``,
        label: ``,
        component: 'RangePicker',
        colProps: {
          span: 8,
        },
        componentProps: ({ formModel }) => {
          return {
            'show-time': false,
            onChange(field, value) {
              if (formModel.billTime === 'pay') {
                formModel.payStartDate = value[0] + ' 00:00:00';
                formModel.payEndDate = value[1] + ' 23:59:59';
              } else {
                formModel.createdStartDate = value[0] + ' 00:00:00';
                formModel.createdEndDate = value[1] + ' 23:59:59';
              }

            },
          };
        },
      },
      {
        field: `payStartDate`,
        label: ``,
        component: 'Input',
        show: false,
        colProps: {
          span: 8,
        },
      },
      {
        field: `payEndDate`,
        label: ``,
        component: 'Input',
        show: false,
        colProps: {
          span: 8,
        },
      },
      {
        field: `createdStartDate`,
        label: ``,
        component: 'Input',
        show: false,
        colProps: {
          span: 8,
        },
      },
      {
        field: `createdEndDate`,
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
    label: '店铺名称',
    field: 'shopName',
    component: 'Select',
    colProps: {
      span: 24,
    },
    slot: 'shopName'
  },
  {
    label: '时间类型',
    field: 'billTime',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '支付时间',
          value: 'pay',
        },
        {
          label: '确定收货时间',
          value: 'created',
        },
      ],
      defaultValue: 'pay'
    },
    colProps: {
      span: 24,
    }
  },
  {
    field: `timer`,
    label: `日期范围`,
    component: 'RangePicker',
    colProps: {
      span: 24,
    },
    slot:'timer',
    // defaultValue: '123'
    // componentProps: ({ formModel }) => {
    //   return {
    //     'show-time': false,
    //     onChange(field, value) {
    //       if (formModel.billTime === 'pay') {
    //         formModel.payStartDate = value[0] + ' 00:00:00';
    //         formModel.payEndDate = value[1] + ' 23:59:59';
    //       } else {
    //         formModel.createdStartDate = value[0] + ' 00:00:00';
    //         formModel.createdEndDate = value[1] + ' 23:59:59';
    //       }
    //     },
    //     // getCalendarContainer:''
    //   };
    // },
    // rules: [{ message: '请选择导出时间范围', required: true }]
  },
  {
    field: `payStartDate`,
    label: ``,
    component: 'Input',
    show: false,
  },
  {
    field: `payEndDate`,
    label: ``,
    component: 'Input',
    show: false,
  },
  {
    field: `createdStartDate`,
    label: ``,
    component: 'Input',
    show: false,
  },
  {
    field: `createdEndDate`,
    label: ``,
    component: 'Input',
    show: false,
  },
];

function completingDecimalLength(number: string | number) {
  let result = '';
  if (!number) {
    number = '0.00';
  } else {
    let matchData = String(number).split('.');
    if (matchData.length > 1) {
      const DecimalLength = matchData[1].length;
      if (DecimalLength === 2) {
        result = String(number); // 返回原数据
      } else if (DecimalLength === 1) {
        result = number + '0'; // 补0
      } else if (DecimalLength === 0) {
        // 异常 有小数点 没有小数位,因为已经有小数点直接补0
        result = number + '00'; // 补0
      } else if (DecimalLength > 2) {
        // 小数位大于两位，异常情况？裁剪两位，todo:是否需要添加金额进制算法？
        result = matchData[0] + '.' + matchData[1].slice(0, 2);
      }
    } else {
      result = number + '.00'; // 补0, 没有小数位
    }
  }

  return result;
}