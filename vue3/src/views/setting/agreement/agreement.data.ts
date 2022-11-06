import { ref } from 'vue';
import { getStatusTypesList } from './agreement';
import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { h } from 'vue';
import { Input } from 'ant-design-vue';

const activeKey = ref('all');
const statusList = ref<any[]>([]);

export function useStatus() {
  statusList.value = [
    { label: '已发布', value: '1' },
    { label: '草稿箱', value: '2' },
  ];
  return {
    activeKey,
    statusList,
  };
}

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '协议名称',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '版本',
      dataIndex: 'version',
      align: 'left',
    },
    {
      title: '应用端',
      dataIndex: 'code',
      align: 'left',
      customRender: ({ text }) => {
        if (text === 'USAGE_AGREEMENT_CODE_VENDOR_ORG') {
          return '商家端';
        }
        if (text === 'USAGE_AGREEMENT_CODE_INFO') {
          return '消费者端、商家端';
        }
        if (
          text === 'USAGE_AGREEMENT_CODE_BUYER_AUCTION' ||
          text === 'USAGE_AGREEMENT_CODE_SALE_SHARE'
        ) {
          return '消费者端';
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'left',
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '编辑时间',
      dataIndex: 'updatedDate',
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
        field: `name`,
        label: `协议名称：`,
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
    ],
  };
}

export function getModelBasicColumns(): BasicColumn[] {
  return [
    {
      title: '操作时间',
      dataIndex: 'updatedDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '版本',
      dataIndex: 'version',
      align: 'left',
      width: 100,
    },
  ];
}

export const formSchema: FormSchema[] = function (data) {
  return [
    {
      field: 'id',
      label: 'id',
      component: 'Input',
      colProps: { span: 24 },
      show: false,
    },
    {
      field: 'name',
      label: '协议名称：',
      component: 'Input',
      colProps: { span: 16 },
    },
    {
      field: 'version',
      label: '当前版本：',
      component: 'Input',
      colProps: { span: 8 },
      render: ({ model, field }) => {
        return h('div', {}, [
          h(Input, {
            value: !data.value ? parseInt(model[field]) + 1 : model[field],
            disabled: true,
          }),
        ]);
      },
    },
    {
      field: 'remark',
      label: '备注：',
      component: 'Input',
      colProps: { span: 24 },
    },
    {
      field: 'content',
      label: '',
      component: 'Input',
      slot: 'editor',
      colProps: { span: 24 },
    },
  ];
};
