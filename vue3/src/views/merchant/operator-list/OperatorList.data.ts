import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { getOrganizationStatusTypesList } from './operatorList.api';
import { getOrganizationTypesList } from '../shop/shop.api';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '企业名称',
      dataIndex: 'organizationCompanyName',
      align: 'left',
      slots: { customRender: 'organizationCompanyName' },
    },
    {
      title: '负责人姓名',
      align: 'left',
      dataIndex: 'vendorName',
    },
    {
      title: '负责人联系电话',
      align: 'left',
      dataIndex: 'vendorMobile',
    },
    {
      title: '经营主体',
      align: 'left',
      dataIndex: 'type', //
      customRender: ({ record }) => {
        return record.type?.name;
      },
    },
    {
      title: '经营主体状态',
      dataIndex: 'status', //
      customRender: ({ record }) => {
        return record.status?.name;
      },
    },
    {
      title: '年检期',
      align: 'left',
      width: 200,
      dataIndex: 'regularReviewBeforeExpireDate', // regularReviewBeforeExpireDate   regularReviewBeforeExpireDate
      customRender: ({ record }) => {
        const start = record?.regularReviewBeforeExpireDate
          ? record.regularReviewBeforeExpireDate.split('T')[0]
          : '';
        const end = record?.statusExpireDate ? record.statusExpireDate.split('T')[0] : '';
        const arr = [start, end];
        return start && end ? arr.join('至') : '-';
      },
    },
    {
      title: '有效期',
      align: 'left',
      dataIndex: 'statusExpireDate',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '认证提交时间',
      align: 'left',
      dataIndex: 'reviewSubmittedDate',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
      slots: { customRender: 'reviewStatus' },
    },
    {
      title: '审核时间',
      align: 'left',
      dataIndex: 'reviewHandledDate',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
  ];
}
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    showAdvancedButton: false,
    compact: true,
    schemas: [
      {
        field: `organizationCompanyName`,
        label: `企业名称`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `vendorName`,
        label: `负责人姓名`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `vendorMobile`,
        label: `负责人联系电话`,
        labelWidth: 120,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `dateRange`,
        label: `有效期`,
        component: 'RangePicker',
        componentProps: {
          format: 'YYYY-MM-DD',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: `typeCode`,
        label: `经营主体`,
        component: 'ApiSelect',
        componentProps: {
          api: getOrganizationTypesList,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: {
          span: 4,
        },
      },
      {
        field: `statusCode`,
        label: `经营主体状态`,
        component: 'ApiSelect',
        componentProps: {
          api: getOrganizationStatusTypesList,
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

export function getShopListColumns(): BasicColumn[] {
  return [
    {
      title: '店铺名称',
      dataIndex: 'name',
      // slots: { customRender: 'shopName' },
    },
    {
      title: '店铺编号',
      dataIndex: 'code',
    },
    {
      title: '微信商户号',
      dataIndex: 'wxPaySubMchId',
      customRender: ({ record }) => {
        return record?.wxPaySubMchId ? record?.wxPaySubMchId : '-';
      },
    },
    {
      title: '微信审核状态',
      dataIndex: 'wxPayApplymentStatus',
      // slots: { customRender: 'wxPayApplymentStatus' },
    },
    {
      title: '商户申请凭证',
      dataIndex: 'wxReviewDocUrl',
      // slots: { customRender: 'shopStatus' },
    },
    {
      title: '店铺状态',
      dataIndex: 'status',
      customRender: ({ record }) => {
        return record?.name ? record?.name : '-';
      },
    },
    {
      title: '开店时间',
      dataIndex: 'startDate',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '关店时间',
      dataIndex: 'endDate',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
  ];
}

// 操作记录
export function getHistoyColumns(): BasicColumn[] {
  return [
    {
      title: '操作时间',
      align: 'left',
      dataIndex: 'reviewUpdatedDate',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '状态',
      dataIndex: 'remark',
    },
  ];
}
