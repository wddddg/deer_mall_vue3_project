import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

// 表格列定义
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '消费者账号',
      dataIndex: 'mobile',
      align: 'left',
      width: 200,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      align: 'left',
    },
    {
      title: '会员等级',
      dataIndex: 'grade',
      align: 'left',
      customRender: ({ text }) => {
        return text ?? '-';
      },
    },
    {
      title: '成长值',
      dataIndex: 'growthValue',
      align: 'left',
      customRender: ({ text }) => {
        return text ?? '-';
      },
    },
    {
      title: '微信授权',
      dataIndex: 'wxAuth',
      align: 'left',
      customRender: ({ text }) => {
        return text ? '已授权' : '未授权';
      },
    },
    {
      title: '注册时间',
      dataIndex: 'createdDate',
      align: 'left',
      format: 'date|YYYY-MM-DD HH:mm:ss',
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
        field: `mobile`,
        label: `手机号`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `nickName`,
        label: `昵称`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `grade`,
        label: `会员等级`,
        component: 'Select',
        colProps: {
          span: 3,
        },
      },
      {
        field: `testOnly`,
        label: `测试人员`,
        component: 'Select',
        componentProps: {
          options: [
            {
              label: '全部',
              value: null,
            },
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
        colProps: {
          span: 3,
        },
      },
    ],
  };
}
