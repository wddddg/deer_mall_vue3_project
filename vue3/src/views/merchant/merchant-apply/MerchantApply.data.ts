import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
// import { getOrganizationTypesList } from "/@/views/merchant/shop/shop.api";
import {
  getOrganizationReviewStatusTypesList,
  getShopWxPayApplymentStatusTypesList,
} from './merchantApply.api';

export function getModalColumns(): BasicColumn[] {
  return [
    {
      title: '操作时间',
      dataIndex: 'wxReviewUpdatedDate',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '微信商户申请状态',
      dataIndex: 'wxReviewStatus',
      slots: { customRender: 'wxReviewStatus' },
    },
  ];
}
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '最新微信申请编号',
      dataIndex: 'wxPayApplymentId',
      align: 'left',
      slots: { customRender: 'wxPayApplymentId' },
    },
    {
      title: '店铺名称',
      dataIndex: 'name',
      align: 'left',
      slots: { customRender: 'shopName' },
    },
    {
      title: '证件号码',
      dataIndex: 'vendorCertNumber',
    },
    {
      title: '商户类型',
      align: 'left',
      dataIndex: 'organizationType',
      slots: { customRender: 'organizationType' },
      // customRender: ({ record }) => {
      //   return record.organizationType?.name ? record.organizationType.name : '';
      // },
    },
    {
      title: '微信商户申请状态',
      dataIndex: 'wxPayApplymentStatus',
      slots: { customRender: 'wxPayApplymentStatus' },
    },
    {
      title: '微信商户号',
      dataIndex: 'wxPaySubMchId',
      align: 'left',
      customRender: ({ record }) => {
        return record.wxPaySubMchId ? record.wxPaySubMchId : '-';
      },
    },
    {
      title: '平台审核状态',
      dataIndex: 'organizationReviewStatusType',
      slots: { customRender: 'organizationReviewStatusType' },
    },
    {
      title: '申请时间',
      dataIndex: 'wxPayApplymentSubmittedDate',
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedDate',
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
        field: `vendorCertNumber`,
        label: `证件号码`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `wxPaySubMchId`,
        label: `商户号`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `wxPayApplymentId`,
        label: `微信申请编号`,
        component: 'Input',
        colProps: {
          span: 4,
        },
      },
      {
        field: `wxPayApplymentStatusCode`,
        label: `微信商户申请状态`,
        component: 'ApiSelect',
        labelWidth: 130,
        componentProps: {
          api: getShopWxPayApplymentStatusTypesList,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: {
          span: 5,
        },
      },
      {
        field: `organizationReviewStatusCode`,
        label: `平台审核状态`,
        component: 'ApiSelect',
        componentProps: {
          api: getOrganizationReviewStatusTypesList,
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
export const Status_Code = {
  // 待提交 - 绿色
  submitItem: {
    ORG_REVIEW_STATUS_WAIT_SUBMIT: true,
    TRADE_WAITING_DELIVERY: true,
    PROCESSING: true, // 处理中

    NOT_SUBMIT: true, // 未提交
    CHECKING: true, // 资料校验中
    ACCOUNT_NEED_VERIFY: true, // 待账户验证
    NEED_SIGN: true, // 待签约
  },
  // 待审核 - 蓝色
  reviewItem: {
    ORG_REVIEW_STATUS_WAIT_REVIEW: true,
    TRADE_WAITING_RECEIPT: true,
    PENDING: true, // 待分账

    AUDITING: true, // 微信审核中
  },
  // 驳回 - 红色
  rejectedItem: {
    ORG_REVIEW_STATUS_REJECTED: true,
    TRADE_CANCELLED: true,
    CLOSED: true,

    REJECTED: true, // 微信已驳回
  },
  //  通过 - 灰色
  approvedItem: {
    ORG_REVIEW_STATUS_APPROVED: true,
    TRADE_SUCCEEDED: true,
    FINISHED: true, // 处理完成

    FINISH: true, // 微信通过，已完成
  },
};

// 根据表格状态获取状态样式
export function getStatusClass(status) {
  if (Status_Code.submitItem.hasOwnProperty(status)) {
    return '#93C46B';
  } else if (Status_Code.reviewItem.hasOwnProperty(status)) {
    return '#3582FB';
  } else if (Status_Code.rejectedItem.hasOwnProperty(status)) {
    return '#F85E5E';
  } else if (Status_Code.approvedItem.hasOwnProperty(status)) {
    return '#A7A7A7';
  }
}
