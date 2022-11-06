import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { Checkbox } from 'ant-design-vue';
import { h } from 'vue';
import Big from 'big.js';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '分类名称',
      dataIndex: 'name',
      align: 'left',
      width: 500,
    },
    {
      title: '商品费率',
      dataIndex: 'mamaPlatformCommissionRate',
      align: 'left',
      customRender: ({ text, record }) => {
        if (record.children && record.children.length > 0 && text) {
          const rate = new Big(text);
          return `${rate.times(100).toNumber()}%`;
        } else {
          return '';
        }
      },
    },
    {
      title: '排序',
      dataIndex: 'orderId',
      align: 'left',
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 80,
    schemas: [
      {
        field: `name`,
        label: `分类名称`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
    ],
  };
}

export function getPropertyModalColumns(): BasicColumn[] {
  return [
    {
      title: '属性值名称',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: '属性类型',
      dataIndex: 'type',
      customRender: ({ record }) => {
        return record?.type?.name;
      },
      width: 90,
    },
    {
      title: '必填',
      dataIndex: 'mandatoryField',
      customRender: ({ record }) => {
        return h(Checkbox, {
          checked: record.mandatoryField === true,
          onChange() {
            record.mandatoryField = !record.mandatoryField;
          },
        });
      },
      width: 60,
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];
}
