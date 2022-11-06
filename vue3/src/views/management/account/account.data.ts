import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { roleList, update } from './account.api';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { formatToDateTime } from '/@/utils/dateUtil';
import { usePermission } from '/@/hooks/web/usePermission';
const { hasPermission } = usePermission();

import { h } from 'vue';
import { left } from 'inquirer/lib/utils/readline';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '收藏鹿账号',
      dataIndex: 'mobile',
      // width: 150,
    },
    {
      title: '管理员姓名',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '客服名称',
      dataIndex: 'nickName',
      align: 'left',
    },
    {
      title: '角色',
      dataIndex: 'role',
      align: 'left',
      customRender: ({ record }) => {
        return record.roles.map((item) => item.name).join('、');
      },
    },
    {
      title: '操作人',
      dataIndex: 'updatedUserName',
      align: 'left',
    },
    {
      title: '最后操作时间',
      dataIndex: 'updatedDate',
      align: 'left',
      customRender: ({ record }) => {
        return record.updatedDate ? formatToDateTime(record.updatedDate) : '-';
      },
    },
    {
      title: '修改密码时间',
      dataIndex: 'lastPasswordChangeDate',
      align: 'left',
      customRender: ({ record }) => {
        return record.lastPasswordChangeDate
          ? formatToDateTime(record.lastPasswordChangeDate)
          : '-';
      },
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      customRender: ({ record }) => {
        return h(Switch, {
          checked: record.enabled,
          disabled: !hasPermission('ACCOUNT_ENABLED'),
          checkedChildren: '是',
          unCheckedChildren: '否',
          loading: record.pendingStatus,
          onClick(checked: boolean) {
            record.pendingStatus = true;
            const { createMessage } = useMessage();
            const data = {
              enabled: checked,
              id: record.id,
            };
            update(record.id, data)
              .then(() => {
                record.enabled = !record.enabled;
                createMessage.success('修改成功');
              })
              .catch(() => {
                createMessage.error('启用失败');
              })
              .finally(() => {
                record.pendingStatus = false;
              });
          },
        });
      },
    },
  ];
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'mobile',
    label: '账号',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'name',
    label: '管理员姓名',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'roleId',
    label: '账号角色',
    component: 'ApiSelect',
    componentProps: {
      api: roleList,
      labelField: 'name',
      valueField: 'id',
    },
    colProps: { span: 4 },
  },
  {
    field: 'enabled',
    label: '账号状态',
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
    colProps: { span: 4 },
  },
  {
    field: 'mamaChat',
    label: '是否客服',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '是',
          value: true,
        },
        {
          label: '否',
          value: false,
        },
      ],
    },
    colProps: { span: 4 },
  },
];
export const editFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    colProps: { span: 24 },
    show: false,
  },
  {
    field: 'mobile',
    label: '收藏鹿账号',
    component: 'Input',
    colProps: { span: 24 },
    rules: [{ required: true }],
  },
  {
    field: 'name',
    label: '管理员姓名',
    component: 'Input',
    colProps: { span: 24 },
    rules: [{ required: true }],
  },
  {
    field: 'roleId',
    label: '账号角色',
    component: 'ApiSelect',
    componentProps: {
      api: roleList,
      labelField: 'name',
      valueField: 'id',
    },
    colProps: { span: 24 },
    // rules: [{ required: true }],
  },
];
export const pwdFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    colProps: { span: 24 },
    show: false,
  },
  {
    field: 'mobile',
    label: '收藏鹿账号',
    component: 'Input',
    colProps: { span: 24 },
    dynamicDisabled: true,
  },
  {
    field: 'password',
    label: '新密码',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    field: 'passwordOk',
    label: '确认新密码',
    component: 'Input',
    colProps: { span: 24 },
  },
];
export const serviceFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    colProps: { span: 24 },
    show: false,
  },
  {
    field: 'nickName',
    label: '客服名称',
    component: 'Input',
    colProps: { span: 24 },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'account',
    label: '用户名',
    component: 'Input',
    helpMessage: ['本字段演示异步验证', '不能输入带有admin的用户名'],
    rules: [
      {
        required: true,
        message: '请输入用户名',
      },
      {
        validator(_, value) {
          return new Promise((resolve, reject) => {
            isAccountExist(value)
              .then(() => resolve())
              .catch((err) => {
                reject(err.message || '验证失败');
              });
          });
        },
      },
    ],
  },
  {
    field: 'pwd',
    label: '密码',
    component: 'InputPassword',
    required: true,
    ifShow: false,
  },
  {
    label: '角色',
    field: 'role',
    component: 'ApiSelect',
    componentProps: {
      // api: getAllRoleList,
      labelField: 'roleName',
      valueField: 'roleValue',
    },
    required: true,
  },
  {
    field: 'dept',
    label: '所属部门',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'deptName',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    required: true,
  },

  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    required: true,
  },

  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `name`,
        label: `店铺名称`,
        component: 'Input',
        colProps: {
          span: 8,
        },
      },
      {
        field: `vendorCertNumber`,
        label: `证件号码`,
        component: 'Input',
        colProps: {
          span: 8,
        },
      },
      {
        field: `wxPaySubMchId`,
        label: `商户号`,
        component: 'Input',
        colProps: {
          span: 8,
        },
      },
      {
        field: `wxPayApplymentId`,
        label: `微信申请编号`,
        component: 'Input',
        colProps: {
          span: 8,
        },
      },
      {
        field: `wxPayApplymentStatusCode`,
        label: `微信商户申请状态`,
        component: 'Select',
        componentProps: {
          options: [
            {
              label: '选项1',
              value: '1',
              key: '1',
            },
            {
              label: '选项2',
              value: '2',
              key: '2',
            },
          ],
        },
        colProps: {
          span: 8,
        },
      },
      {
        field: `organizationReviewStatusCode`,
        label: `平台审核状态`,
        component: 'Input',
        colProps: {
          span: 8,
        },
      },
    ],
  };
}

export function getBasicShortColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      width: 150,
      dataIndex: 'id',
      sorter: true,
      sortOrder: 'ascend',
    },
    {
      title: '',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '编号',
      dataIndex: 'no',
      width: 80,
    },
  ];
}

export function getMultipleHeaderColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
      sorter: true,
      children: [
        {
          title: '编号',
          dataIndex: 'no',
          width: 120,
          filters: [
            { text: 'Male', value: 'male', children: [] },
            { text: 'Female', value: 'female', children: [] },
          ],
        },

        {
          title: '开始时间',
          dataIndex: 'beginTime',
          width: 120,
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          width: 120,
        },
      ],
    },
  ];
}

export function getCustomHeaderColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      helpMessage: 'headerHelpMessage方式1',
      width: 200,
    },
    {
      // title: '姓名',
      dataIndex: 'name',
      width: 120,
      // slots: { title: 'customTitle' },
    },
    {
      // title: '地址',
      dataIndex: 'address',
      width: 120,
      // slots: { title: 'customAddress' },
      sorter: true,
    },

    {
      title: '编号',
      dataIndex: 'no',
      width: 120,
      filters: [
        { text: 'Male', value: 'male', children: [] },
        { text: 'Female', value: 'female', children: [] },
      ],
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 120,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 120,
    },
  ];
}
const renderContent = ({ text, index }: { text: any; index: number }) => {
  const obj: any = {
    children: text,
    attrs: {},
  };
  if (index === 9) {
    obj.attrs.colSpan = 0;
  }
  return obj;
};
export function getMergeHeaderColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 300,
      customRender: renderContent,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 300,
      customRender: renderContent,
    },
    {
      title: '地址',
      dataIndex: 'address',
      colSpan: 2,
      width: 120,
      sorter: true,
      customRender: ({ text, index }: { text: any; index: number }) => {
        const obj: any = {
          children: text,
          attrs: {},
        };
        if (index === 2) {
          obj.attrs.rowSpan = 2;
        }
        if (index === 3) {
          obj.attrs.colSpan = 0;
        }
        return obj;
      },
    },
    {
      title: '编号',
      dataIndex: 'no',
      colSpan: 0,
      filters: [
        { text: 'Male', value: 'male', children: [] },
        { text: 'Female', value: 'female', children: [] },
      ],
      customRender: renderContent,
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 200,
      customRender: renderContent,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 200,
      customRender: renderContent,
    },
  ];
}
export const getAdvanceSchema = (itemNumber = 6): FormSchema[] => {
  const arr: any = [];
  for (let index = 0; index < itemNumber; index++) {
    arr.push({
      field: `field${index}`,
      label: `字段${index}`,
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 8,
      },
    });
  }
  return arr;
};

export function getBasicData() {
  return (() => {
    const arr: any = [];
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(),
      });
    }
    return arr;
  })();
}

export function getTreeTableData() {
  return (() => {
    const arr: any = [];
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(),
        children: [
          {
            id: `l2-${index}`,
            name: 'John Brown',
            age: `1${index}`,
            no: `${index + 10}`,
            address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
            beginTime: new Date().toLocaleString(),
            endTime: new Date().toLocaleString(),
          },
        ],
      });
    }
    return arr;
  })();
}
