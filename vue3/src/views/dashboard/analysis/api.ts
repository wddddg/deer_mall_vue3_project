import { defHttp } from '/@/utils/http/axios';

enum Api {
  loginfo = '/user-api/v1/mamas/organizations/actions/search', //待审核经营主体
  visitInfo = '/user-api/v1/mamas/shops/actions/search', // 待签约/验证微信商户
  listByVendorNotReply = '/general-api/v1/mamas/buyerChats/actions/listByVendorNotReply', //商家未复消息
  chats = '/general-api/v1/mamas/chats', //平台客服未读消息
}
/**
 * 待审核经营主体
 * @param params
 */
//  limit: 5
//  offset: 0
//  reviewStatusCode: "ORG_REVIEW_STATUS_WAIT_REVIEW"

export const getShopList = (params) => {
  const data = {
    reviewStatusCode: 'ORG_REVIEW_STATUS_WAIT_REVIEW',
    ...params,
  };
  return defHttp.post({ url: Api.loginfo, params: data });
};

// 待签约
export const visitInfo = (params) => {
  const data = {
    organizationReviewStatusCode: 'ORG_REVIEW_STATUS_APPROVED',
    subGroupPermissionCode: 'MAMA_PERMISSION_MODULE_VENDOR_GROUP_VENDOR_SUB_SHOP_APPLYMENT',
    wxPayApplymentStatusCode: 'NEED_SIGN',
    ...params,
  };
  return defHttp.post({ url: Api.visitInfo, params: data });
};
// 验证微信商户
// organizationReviewStatusCode: ""
// subGroupPermissionCode: "MAMA_PERMISSION_MODULE_VENDOR_GROUP_VENDOR_SUB_SHOP_APPLYMENT"
// wxPayApplymentStatusCode: "ACCOUNT_NEED_VERIFY"
/**
 * 商家未复消息
 * @param params
 */
export const listByVendorNotReply = (params) =>
  defHttp.get({ url: Api.listByVendorNotReply, params });

// 平台客服未读消息
export const getChats = (params) => {
  const data = {
    notRead: true,
    // userTypeCode: 'buyer', //消费者
    // userTypeCode: "vendor", //商家
    ...params,
  };
  return defHttp.post({ url: Api.chats, params: data });
};
