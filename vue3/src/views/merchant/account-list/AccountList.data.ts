import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
const span = 4;

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '账号（手机号）',
      dataIndex: 'mobile',
      width: 150,
      align: 'left',
      slots: { customRender: 'mobile' },
    },
    {
      title: '昵称',
      align: 'left',
      dataIndex: 'nickName',
    },
    {
      title: '所属店铺',
      dataIndex: 'shopName',
      align: 'left',
      slots: { customRender: 'shopName' },
    },
    {
      title: '角色',
      dataIndex: 'roles',
      align: 'left',
      customRender: ({ record }) => {
        return record.roles.map((item) => item.name).join('、');
      },
    },
    {
      title: '账号状态',
      dataIndex: 'enabled',
      align: 'left',
      customRender: ({ record }) => {
        return record.enabled ? '使用中' : '已停用';
      },
    },
    {
      title: '账号类型',
      dataIndex: 'admin',
      align: 'left',
      customRender: ({ record }) => {
        return record.admin ? '店主' : '店员';
      },
    },
    {
      title: '创建时间',
      align: 'left',
      dataIndex: 'createdDate',
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
        field: `mobile`,
        label: `账号`,
        component: 'Input',
        colProps: {
          span: span,
        },
      },
      {
        field: `nickName`,
        label: `昵称`,
        component: 'Input',
        colProps: {
          span: span,
        },
      },
      {
        field: `shopName`,
        label: `所属店铺`,
        component: 'Input',
        colProps: {
          span: span,
        },
      },
      {
        field: `admin`,
        label: `账号类型`,
        component: 'Select',
        componentProps: {
          options: [
            {
              label: '店员',
              value: 0,
            },
            {
              label: '店主',
              value: 1,
            },
          ],
        },
        colProps: {
          span: span,
        },
      },
      {
        field: `enabled`,
        label: `账号状态`,
        component: 'Select',
        componentProps: {
          options: [
            {
              label: '启用',
              value: 1,
            },
            {
              label: '禁用',
              value: 0,
            },
          ],
        },
        colProps: {
          span: span,
        },
      },
    ],
  };
}
