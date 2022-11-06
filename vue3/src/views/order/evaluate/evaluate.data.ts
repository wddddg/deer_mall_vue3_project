import { getListGrades } from './evaluate.api';
import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 等级处理
function initializePage(code) {
  let result = '';
  switch (code) {
    case 'GOOD':
      result = '好评';
      break;
    case 'NORMAL':
      result = '中评';
      break;
    case 'BAD':
      result = '差评';
      break;
  }

  return result;
}

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '评价编号',
      dataIndex: 'id',
      align: 'left',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      align: 'left',
    },
    {
      title: '订单编号',
      dataIndex: 'tradeId',
      align: 'left',
    },
    {
      title: '评价',
      dataIndex: 'grade',
      align: 'left',
      customRender: ({ text }) => {
        return initializePage(text);
      },
    },
    {
      title: '评价内容',
      dataIndex: 'content',
      align: 'left',
    },
    {
      title: '买家',
      dataIndex: 'buyerNickName',
      align: 'left',
    },
    {
      title: '评价时间',
      dataIndex: 'createdDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
  ];
}

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
          span: 4,
        },
      },
      {
        field: `productName`,
        label: `商品名称`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `defaultGoodReview`,
        label: `评价方式`,
        component: 'Select',
        componentProps: {
          options: [
            {
              label: '全部',
              value: '',
            },
            {
              label: '用户自评',
              value: false,
            },
            {
              label: '默认好评',
              value: true,
            },
          ],
        },
        colProps: {
          span: 4,
        },
      },
      {
        field: `createdDate`,
        label: `评价时间`,
        component: 'RangePicker',
        componentProps: {
          format: 'YYYY-MM-DD',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: `grade`,
        label: `评价等级`,
        component: 'ApiSelect',
        componentProps: {
          api: getListGrades,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: {
          span: 4,
        },
      },
    ],
  };
}
