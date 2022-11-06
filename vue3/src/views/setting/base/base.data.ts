import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { h } from 'vue';
import { Input, Tooltip } from 'ant-design-vue';
import { QuestionCircleFilled } from '@ant-design/icons-vue';

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
    },
    {
      title: '分账金额(元)',
      dataIndex: 'finishFee',
      align: 'left',
    },
    {
      title: '总金额比例(%)',
      dataIndex: 'finishRate',
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
            'show-time': "{ format: 'HH:mm' }",
            onChange(field, value) {
              if (formModel.billTime === 'pay') {
                formModel.payStartDate = value[0];
                formModel.payEndDate = value[1];
              } else {
                formModel.createdStartDate = value[0];
                formModel.createdEndDate = value[1];
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
    showAdvancedButton: false,
  };
}
// 订单表单
export const orderSchemas: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '默认库存扣减方式：',
    field: 'quantityMinusTypeCode',
    component: 'ApiRadioGroup',
    componentProps: {
      options: [
        {
          value: 'TRADE_CREATE_MINUS',
          label: '拍下减库存',
        },
        {
          value: 'TRADE_PAY_MINUS',
          label: '付款减库存',
        },
      ],
    },
    colProps: {
      span: 24,
    },
  },
  {
    label: '待付款订单取消时间：',
    field: 'waitBuyerPayTimeLimitMinute',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h('div', { style: { width: '240px' } }, ['拍下未付款订单']),
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model[field],
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '分钟内未付款，自动取消订单',
      ]);
    },
  },
  {
    label: '发货后自动确认收货时间：',
    field: 'waitBuyerAcceptGoodDeliveryTimeLimitDay',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h('div', { style: { width: '240px' } }, ['发货后']),
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model[field],
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '天，自动确认收货',
      ]);
    },
  },
  {
    label: '收货后自动确认好评：',
    field: 'waitBuyerReviewProductTimeLimitDay',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h('div', { style: { width: '240px' } }, ['确认收货后']),
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model[field],
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '天，自动确认好评',
      ]);
    },
  },
  {
    label: '售后自动同意申请时间：',
    field: 'waitVendorAcceptBuyerAfterSaleRequestTimeLimitDay',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h('div', { style: { width: '240px' } }, ['消费者发起售后后']),
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model[field],
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '天，自动同意售后申请',
      ]);
    },
  },
  {
    label: '商家拒绝申请自动关闭时间：',
    field: 'waitBuyerForVendorRejectAfterSaleTimeLimitDay',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h('div', { style: { width: '240px' } }, ['	商家拒绝售后申请后']),
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model[field],
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '天，自动关闭售后订单',
      ]);
    },
  },
  {
    label: '退货自动确认收货时间：',
    field: 'waitVendorConfirmAfterSaleDoneTimeLimitDay',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h('div', { style: { width: '240px' } }, ['消费者退货退款后']),
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model[field],
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '天，自动确认商家收货，售后成功',
      ]);
    },
  },
  {
    label: '订单分账时间：',
    field: 'waitMamaTriggerProfitSharingTimeLimitDay',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h('div', { style: { width: '240px' } }, ['订单确认收货后']),
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model[field],
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '天，收藏鹿平台向微信发起分账申请',
        h(
          Tooltip,
          {
            title:
              '若订单发生售后，则从售后结束时开始计算，如设置10天，则在订单售后结束后10天向微信发起分账申请。',
            trigger: 'hover',
          },
          [h(QuestionCircleFilled, { style: { color: '#ccc', margin: '0px 10px' } })],
        ),
      ]);
    },
  },
];

// SMS通知表单
export const SMSSchemas: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '消費者换绑手机发验证码频率：',
    field: 'waitBuyerPayTimeLimitMinute',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          defaultValue: '5',
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '分钟内，不允许发送第二条',
      ]);
    },
  },
  {
    label: '商家换绑手机发验证码频率：',
    field: 'waitBuyerAcceptGoodDeliveryTimeLimitDay',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          defaultValue: '5',
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '分钟内，不允许发送第二条',
      ]);
    },
  },
  {
    label: '店铺经营主体到期提醒：',
    field: 'info',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h('div', { style: {} }, ['到期前']),
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model['regularReviewThirdNotificationBeforeExpireDay'],
          onChange(value) {
            model['regularReviewThirdNotificationBeforeExpireDay'] = value.target.value;
          },
        }),
        '天，',
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model['regularReviewSecondNotificationBeforeExpireDay'],
          onChange(value) {
            model['regularReviewSecondNotificationBeforeExpireDay'] = value.target.value;
          },
        }),
        '天，',
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model['regularReviewFirstNotificationBeforeExpireDay'],
          onChange(value) {
            model['regularReviewFirstNotificationBeforeExpireDay'] = value.target.value;
          },
        }),
        '天短信提醒，到期后',
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model['regularReviewFourthNotificationAfterExpireDay'],
          onChange(value) {
            model['regularReviewFourthNotificationAfterExpireDay'] = value.target.value;
          },
        }),
        '天短信提醒',
      ]);
    },
  },
  {
    label: '',
    field: 'regularReviewThirdNotificationBeforeExpireDay',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'regularReviewSecondNotificationBeforeExpireDay',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'regularReviewFirstNotificationBeforeExpireDay',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'regularReviewFourthNotificationAfterExpireDay',
    component: 'Input',
    show: false,
  },
];

// 费用表单
export const CostSchemas: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '主体认证费用：',
    field: 'organizationReviewFirstFee',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model[field],
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '元',
      ]);
    },
  },
  {
    label: '店铺转让审核费用：',
    field: 'shopTransferReviewFee',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value:  model[field],
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '元',
      ]);
    },
  },
  {
    label: '年审费用：',
    field: 'organizationReviewAnnualFee',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model[field],
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '元',
      ]);
    },
  },
  {
    label: '平台销售员分佣费率：',
    field: 'mamaSaleCommissionRate',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model[field] * 100,
          onChange(value) {
            model[field] = value.target.value * 0.01;
          },
        }),
        '%',
        h(Tooltip, { title: '平台设置销售人员分佣费率，费率范围0~5%', trigger: 'hover' }, [
          h(QuestionCircleFilled, { style: { color: '#ccc', margin: '0px 10px' } }),
        ]),
      ]);
    },
  },
  {
    label: '分佣推广图片：',
    field: 'img',
    component: 'Input',
    colProps: {
      span: 24,
    },
    slot: 'imgUrl',
  },
];

// 营销表单
export const MarketingSchemas: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '消费1元等值于多少鹿币：',
    field: 'waitBuyerPayTimeLimitMinute',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          defaultValue: '1',
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '个鹿币',
      ]);
    },
  },
  {
    label: '店铺初始分值：',
    field: 'waitBuyerAcceptGoodDeliveryTimeLimitDay',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          defaultValue: '100',
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '分',
      ]);
    },
  },
  {
    label: '店铺初始分值重置时间：',
    field: 'waitBuyerAcceptGoodDeliveryTimeLimitDay',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          defaultValue: '1',
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '年',
        h(
          Tooltip,
          {
            title:
              '按自然年算，即每年的1月-12月为一个周期，若店铺在其中某月申请开通，则次年1月开始，店铺初始分值仍会重置为100',
            trigger: 'hover',
          },
          [h(QuestionCircleFilled, { style: { color: '#ccc', margin: '0px 10px' } })],
        ),
      ]);
    },
  },
];

// 积分表单
export const AccumulateSchemas: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '消费1元等值于多少积分：	',
    field: 'waitBuyerPayTimeLimitMinute',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          defaultValue: '1',
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '个积分',
      ]);
    },
  },
  {
    label: '签到积分：',
    field: 'waitBuyerAcceptGoodDeliveryTimeLimitDay',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          defaultValue: '18',
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '个积分/天',
      ]);
    },
  },
  {
    label: '用户初始分值：',
    field: 'waitBuyerAcceptGoodDeliveryTimeLimitDay',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          defaultValue: '0',
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '分',
      ]);
    },
  },
];

// 系统表单
export const SystemSchemas: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '同一经营主体数量：',
    field: 'organizationApprovedLimitForAllVendors',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h('div', { style: { width: '250px' } }, ['同一经营主体允许注册']),
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model[field],
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '个实体帐号（所有商家帐号共享次数）',
        h(
          Tooltip,
          {
            title:
              '微信商户申请状态为完成的才纳入统计，如设置为5，则签约完成的同一主体仅允许有5个。',
            trigger: 'hover',
          },
          [h(QuestionCircleFilled, { style: { color: '#ccc', margin: '0px 10px' } })],
        ),
      ]);
    },
  },
  {
    label: '同一商家帐号（微信号）认证经营主体数量：',
    field: 'organizationCreationLimitForOneVendor',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h('div', { style: { width: '250px' } }, ['同一商家帐号（微信号）允许认证']),
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model[field],
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '个经营主体',
      ]);
    },
  },
  {
    label: '同一商家帐号（微信号）创建店铺数量：',
    field: 'shopCreationLimitForOneVendor',
    component: 'Input',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h('div', { style: { width: '250px' } }, ['同一商家帐号（微信号）允许创建']),
        h(Input, {
          style: { width: '100px', margin: '0px 10px', 'text-align': 'center' },
          value: model[field],
          onChange(value) {
            model[field] = value.target.value;
          },
        }),
        '个店铺',
      ]);
    },
  },
];
