import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { getOrganizationTypesList, getShopStatusTypesList } from './shop.api';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '店铺名称',
      dataIndex: 'name',
      align: 'left',
      slots: { customRender: 'shopName' },
    },
    {
      title: '经营主体',
      dataIndex: 'organizationType',
      align: 'left',
      customRender: ({ record }) => {
        return record?.organizationType?.name;
      },
    },
    {
      title: '负责人联系电话',
      align: 'left',
      dataIndex: 'vendorMobile',
    },
    {
      title: '负责人',
      align: 'left',
      dataIndex: 'vendorName',
    },
    {
      title: '店铺编号',
      align: 'left',
      dataIndex: 'code',
    },
    {
      title: '微信商户号',
      align: 'left',
      dataIndex: 'wxPaySubMchId',
      customRender: ({ record }) => {
        return record?.wxPaySubMchId ? record?.wxPaySubMchId : '-';
      },
    },
    {
      title: '运营方式',
      align: 'left',
      dataIndex: 'mamaOwned', //{{listItem?.mamaOwned?'自营店铺':listItem?.mamaOperated?'代运营店铺，'+listItem?.mamaOperatedCommissionRate+'%':'-'}}
      customRender: ({ record }) => {
        return record?.mamaOwned
          ? '自营店铺'
          : record?.mamaOperated
            ? '代运营店铺，' + Math.floor(Number(record?.mamaOperatedCommissionRate) * 100) + '%'
            : '-';
      },
    },
    {
      title: '店铺销售费率',
      align: 'left',
      dataIndex: 'saleCommissionRate',
      customRender: ({ record }) => {
        return record?.saleCommissionRate ? Number(record?.saleCommissionRate) * 100 + '%' : '-';
      },
    },
    {
      title: '店铺状态',
      align: 'left',
      dataIndex: 'status',
      customRender: ({ record }) => {
        return record?.status?.name;
      },
    },
    {
      title: '开店时间',
      dataIndex: 'startDate',
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
        field: `name`,
        label: `店铺名称`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `organizationTypeCode`,
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
        label: `店铺状态`,
        component: 'ApiSelect',
        componentProps: {
          api: getShopStatusTypesList,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: {
          span: 4,
        },
      },
      {
        field: `code`,
        label: `店铺编号`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `vendorName`,
        label: `店铺负责人`,
        labelWidth: 110,
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
        field: `operationList`,
        label: `运营方式`,
        component: 'Select',
        componentProps: {
          options: [
            { label: '全部', value: '' },
            { label: '自营店铺', value: 'mamaOwned' },
            { label: '代运营店铺', value: 'mamaOperated' },
          ],
        },
        colProps: {
          span: 4,
        },
      },
      {
        field: `testOnly`,
        label: `测试店铺`,
        component: 'Select',
        componentProps: {
          options: [
            {
              label: '是',
              value: 'true',
            },
            {
              label: '否',
              value: 'false',
            },
          ],
        },
        colProps: {
          span: 4,
        },
      },
    ],
  };
}
export function getStaffColumns(): BasicColumn[] {
  return [
    {
      title: '账号（手机号）',
      dataIndex: 'mobile',
      align: 'left',
    },
    {
      title: '员工昵称',
      align: 'left',
      dataIndex: 'nickName',
    },
    {
      title: '角色',
      align: 'left',
      dataIndex: 'roles',
      customRender: ({ record }) => {
        if (record?.roles) {
          return record.roles.map((item) => item.name).join('、') || '-';
        } else {
          return '-';
        }
      },
    },
    {
      title: '账号状态',
      dataIndex: 'name',
      align: 'left',
      // customRender: ({ record }) => {
      //   return record.enabled ? '使用中' : '已停用';
      // },
    },
    {
      title: '账号类型',
      dataIndex: 'name',
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
export function getAddressColumns(): BasicColumn[] {
  return [
    {
      title: '收货人',
      dataIndex: 'consigneeName',
      align: 'left',
    },
    {
      title: '手机号码',
      align: 'left',
      dataIndex: 'consigneeMobile',
    },
    {
      title: '固定电话',
      align: 'left',
      dataIndex: 'consigneePhoneDistrictNumber',
      customRender: ({ record }) => {
        if (
          record?.consigneePhoneDistrictNumber &&
          record?.consigneePhone &&
          record?.consigneePhoneExtensionNumber
        ) {
          return (
            record?.consigneePhoneDistrictNumber +
            '-' +
            record?.consigneePhone +
            '-' +
            record?.consigneePhoneExtensionNumber
          );
        } else {
          return '';
        }
      },
    },
    {
      title: '地址',
      dataIndex: 'areaName',
      align: 'left',
      // customRender: ({ record }) => {
      //   return record.enabled ? '使用中' : '已停用';
      // },
    },
    {
      title: '地址类型',
      dataIndex: 'invoiceAddress',
      align: 'left',
      customRender: ({ record }) => {
        if (record?.returnProductAddress && record?.invoiceAddress) {
          return '退货地址' + '、' + '发票地址';
        } else if (record?.returnProductAddress) {
          return '退货地址';
        } else if (record?.invoiceAddress) {
          return '发票地址';
        }
      },
    },
    {
      title: '默认退货地址',
      align: 'left',
      dataIndex: 'returnProductAddressDefault',
      // customRender: ({ record }) => {
      //   return record?.returnProductAddressDefault ? record?.returnProductAddressDefault : '-';
      // },
    },
    {
      title: '默认发票地址',
      align: 'left',
      dataIndex: 'invoiceAddressDefault',
      // customRender: ({ record }) => {
      //   return record?.invoiceAddressDefault ? record?.invoiceAddressDefault : '-';
      // },
    },
  ];
}
