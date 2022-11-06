export interface GrowCardItem {
  icon: string;
  title: string;
  value: number;
  total: number;
  color: string;
  action: string;
}

// 菜单栏
export const MenuBar = [
  // 真实数据
  {
    code: 'AssetManagement',
    title: '资产管理',
    icon: '',
    level: 1,
    isShowChildren: false,
    isShow: true,
    subChildren: [
      {
        code: 'MoneyCollecting',
        title: '资金分账',
        icon: '',
        level: 2,
        isShow: true,
        subChildren: [
          {
            id: 1,
            code: 'MoneyCollecting_FZZJSM',
            isShow: true,
            title: '收藏鹿分账资金说明',
            subTitle: '',
            date: '2021-01-13',
          },
          {
            id: 2,
            code: 'MoneyCollecting_FZZQSM',
            isShow: true,
            title: '收藏鹿分账周期说明',
            date: '2021-01-13',
          },
          {
            id: 3,
            code: 'MoneyCollecting_ZZSZYFP',
            isShow: true,
            title: '增值税专用发票',
            date: '2021-01-13',
          },
          {
            id: 4,
            code: 'MoneyCollecting_DSFMJDDZBZCFPBKYHK',
            isShow: true,
            title: '第三方卖家订单暂不支持发票补开与换开',
            date: '2021-01-13',
          },
        ],
      },
      {
        code: 'MoneyDivided',
        title: '资金划入',
        icon: '',
        level: 2,
        isShow: true,
        subChildren: [],
      },
      {
        code: 'ComputeMode',
        title: '计算方式',
        icon: '',
        level: 2,
        isShow: true,
        subChildren: [],
      },
    ],
  },
  {
    code: 'CommodityManagement',
    title: '商品管理',
    icon: '',
    level: 1,
    isShowChildren: false,
    isShow: true,
    subChildren: [],
  },
];

// 资产管理 - 资金分账 0 收藏鹿分账资金说明
export const MoneyCollecting = {
  MoneyCollecting_FZZJSM: {
    code: 'MoneyCollecting_FZZJSM',
    title: '收藏鹿分账资金说明',
    subTitle: '',
    date: '2021-01-14 14:20:30',
    moduleData: [
      {
        title: '名词解释',
        subTitle: '',
        contentData: [
          {
            moduleType: 'TextModule',
            content: [
              { type: 'text', class: 'text-item-weight', title: '分账接收方：' },
              {
                type: 'text',
                class: '',
                title: '接收分账资金的商户或个人，如：商家、销售人员等。',
              },
            ],
          },
          {
            moduleType: 'TextModule',
            content: [
              { type: 'text', class: 'text-item-weight', title: '分账金额：' },
              {
                type: 'text',
                class: '',
                title: '即订单实付金额，若订单产生退款，则分账金额为订单实付金额扣减退款金额。',
              },
            ],
          },
          {
            moduleType: 'TextModule',
            content: [
              { type: 'text', class: 'text-item-weight', title: '分账申请时间：' },
              {
                type: 'text',
                class: '',
                title: `消费者确认收货或订单发货后超时自动确认收货之日起三十天期满时，收藏鹿平台向微信发起的分账申请时间。
                          若在确认收货之日起三十天内发生售后，且于届满三十天时售后仍未处理完成的订单，分账申请时间将延迟至售后完成之日起三天期满时。`,
              },
            ],
          },
        ],
      },
      {
        title: '分账举例',
        subTitle: '某张订单实付金额100元，其中商品费率6%，平台设置销售费率4%，商家设置销售费率3%',
        contentData: [
          {
            moduleType: 'TextModule',
            content: [
              { type: 'text', class: '', title: '①订单确认收货后届满三十天，各分账接收方分账情况' },
            ],
          },
          {
            moduleType: 'TableModule',
            widthLenght: '470px',
            content: [
              [
                { class: '', title: '分账接收方属性', colspan: 1, rowspan: 1 },
                { class: '', title: '分账金额', colspan: 1, rowspan: 1 },
                { class: '', title: '计算过程', colspan: 1, rowspan: 1 },
              ],
              [
                { class: '', title: '商户', colspan: 1, rowspan: 1 },
                { class: '', title: '91', colspan: 1, rowspan: 1 },
                { class: '', title: '100*（1-6%-3%）', colspan: 1, rowspan: 1 },
              ],
              [
                { class: '', title: '销售人员', colspan: 1, rowspan: 1 },
                { class: '', title: '7', colspan: 1, rowspan: 1 },
                { class: '', title: '100*（4%+3%）', colspan: 1, rowspan: 1 },
              ],
              [
                { class: '', title: '收藏鹿平台', colspan: 1, rowspan: 1 },
                { class: '', title: '1.4', colspan: 1, rowspan: 1 },
                { class: '', title: '100*（6%-4%-0.6%）', colspan: 1, rowspan: 1 },
              ],
              [
                { class: '', title: '微信', colspan: 1, rowspan: 1 },
                { class: '', title: '0.6', colspan: 1, rowspan: 1 },
                { class: '', title: '100*0.6%', colspan: 1, rowspan: 1 },
              ],
            ],
          },
          {
            moduleType: 'TextModule',
            class: 'margin-top-15',
            content: [
              { type: 'text', class: '', title: '②订单产生售后退款10元，各分账接收方分账情况' },
            ],
          },
          {
            moduleType: 'TableModule',
            widthLenght: '470px',
            content: [
              [
                { class: '', title: '分账接收方属性', colspan: 1, rowspan: 1 },
                { class: '', title: '分账金额', colspan: 1, rowspan: 1 },
                { class: '', title: '计算过程', colspan: 1, rowspan: 1 },
              ],
              [
                { class: '', title: '商户', colspan: 1, rowspan: 1 },
                { class: '', title: '81.90', colspan: 1, rowspan: 1 },
                { class: '', title: '(100-10) *（1-6%-3%）', colspan: 1, rowspan: 1 },
              ],
              [
                { class: '', title: '销售人员', colspan: 1, rowspan: 1 },
                { class: '', title: '6.30', colspan: 1, rowspan: 1 },
                { class: '', title: '(100-10) *（4%+3%）', colspan: 1, rowspan: 1 },
              ],
              [
                { class: '', title: '收藏鹿平台', colspan: 1, rowspan: 1 },
                { class: '', title: '1.4', colspan: 1, rowspan: 1 },
                { class: '', title: '(100-10) *（6%-4%-0.6%）', colspan: 1, rowspan: 1 },
              ],
              [
                { class: '', title: '微信', colspan: 1, rowspan: 1 },
                { class: '', title: '0.6', colspan: 1, rowspan: 1 },
                { class: '', title: '(100-10) * 0.6%', colspan: 1, rowspan: 1 },
              ],
            ],
          },
          {
            moduleType: 'TextModule',
            class: 'margin-top-30',
            content: [
              { type: 'text', class: 'font-color-FF5050', title: '说明一：' },
              {
                type: 'text',
                class: '',
                title: '若订单是消费者自行下单的，则不涉及销售人员分账。',
              },
            ],
          },
          {
            moduleType: 'TextModule',
            class: '',
            content: [
              { type: 'text', class: 'font-color-FF5050', title: '说明二：' },
              {
                type: 'text',
                class: '',
                title:
                  '平台提交给微信的分账信息仅涉及收藏鹿平台（含微信手续费）及销售人员的分账金额，商户分账金额是订单实付金额扣除收藏鹿平台及销售人员分账金额后的金额。',
              },
            ],
          },
          {
            moduleType: 'TextModule',
            class: '',
            content: [
              { type: 'text', class: 'font-color-FF5050', title: '说明三：' },
              {
                type: 'text',
                class: '',
                title:
                  '商品费率、平台设置销售费率、商家设置销售费率，三个费率在订单确认收货时确定最终费率。',
              },
            ],
          },
        ],
      },
    ],
  },
  MoneyCollecting_FZZQSM: {
    code: 'MoneyCollecting_FZZQSM',
    title: '收藏鹿分账周期说明',
    subTitle: '',
    date: '2021-01-14 14:20:30',
    moduleData: [],
  },
  MoneyCollecting_ZZSZYFP: {
    code: 'MoneyCollecting_ZZSZYFP',
    title: '增值税专用发票',
    subTitle: '',
    date: '2021-01-14 14:20:30',
    moduleData: [],
  },
  MoneyCollecting_DSFMJDDZBZCFPBKYHK: {
    code: 'MoneyCollecting_DSFMJDDZBZCFPBKYHK',
    title: '第三方卖家订单暂不支持发票补开与换开',
    subTitle: '',
    date: '2021-01-14 14:20:30',
    moduleData: [],
  },
};
