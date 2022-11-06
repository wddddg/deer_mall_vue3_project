import { h } from 'vue';
import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { getStatusClass } from '/@/utils/table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '微信交易号',
      dataIndex: 'organizationCompanyName',
      align: 'left',
    },
    {
      title: '订单编号',
      dataIndex: 'vendorName',
      align: 'left',
    },
    {
      title: '交易店铺',
      dataIndex: 'vendorMobile',
      align: 'left',
    },
    {
      title: '退款金额 (元)',
      align: 'left',
      customRender: ({ record }) => {
        return record.type?.name || '';
      },
    },
    {
      title: '退款账号',
      align: 'left',
      customRender: ({ record }) => {
        return h(
          'span',
          {
            class: 'project-item ' + getStatusClass(record?.reviewStatus?.code),
          },
          record.reviewStatus?.name || '',
        );
      },
    },
    {
      title: '退款时间',
      align: 'left',
      customRender: ({ record }) => {
        return record?.status?.name;
      },
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 90,
    showAdvancedButton: false,
    schemas: [
      {
        field: `vendorMobile`,
        label: `店铺名称`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `vendorName`,
        label: `订单编号`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `organizationCompanyName`,
        label: `微信交易号`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `createdDate`,
        label: `付款时间`,
        component: 'RangePicker',
        componentProps: {
          format: 'YYYY-MM-DD',
        },
        colProps: {
          span: 6,
        },
      },
    ],
  };
}
