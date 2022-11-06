<template>
  <div class="page-container">
    <div class="update-page-container">
      <div class="update-content-container flex_start_top">
        <div class="header-status-container">
          <div class="_status-text">{{ tradeAfterSalesData?.currentStatusName || '-' }}</div>
          <div class="_product-type-text">{{ tradeAfterSalesData?.currentStatusTime || '-' }}</div>
        </div>
        <div class="header-buyer-container">
          <div class="flex_start_top buyer-detail-box">
            <div class="buyer-avatar-content">
              <img :src="getFileUrl(tradeAfterSalesData.buyerAvatarUrl)" />
            </div>
            <div class="buyer-detail-content">
              <div class="buyer-detail-item">
                买家：
                <span
                  :class="{ 'action-text': hasPermission('BUYER_DETAIL_GET') }"
                  @click="
                    hasPermission('BUYER_DETAIL_GET')
                      ? goDetail(tradeAfterSalesData.buyerId, 'buyer')
                      : ''
                  "
                >
                  {{ tradeAfterSalesData?.buyerNickName }}
                </span>
              </div>
              <div class="buyer-detail-item">
                申请时间：
                {{
                  tradeAfterSalesData?.createdDate
                    ? formatToDateTime(tradeAfterSalesData?.createdDate)
                    : '-'
                }}
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="buyer-action-container">
            <div class="action-btn red" style="margin-right: 20px" @click="menuAction('record')">
              聊天记录
            </div>
            <div
              class="action-btn red"
              v-if="tradeAfterSalesData?.currentStatusCode === 'AFTER_SALE_MAMA_INTERVENED'"
            >
              介入处理
            </div>
          </div>
        </div>
      </div>

      <!--  售后商品 -->
      <div class="update-content-container flex_between-top" style="padding: 20px 35px">
        <div>
          <div class="content-title"> 售后商品</div>
          <div class="flex_start_top _item-box">
            <div class="_item-title" style="width: 100px; height: 100px; margin-right: 20px">
              <img
                :src="getFileUrl(tradeAfterSalesData.productFileUrl)"
                alt=""
                style="width: 100%; height: 100%"
              />
            </div>
            <div
              class="_item-value"
              :class="{ 'action-text': hasPermission('PRODUCT_DETAIL_GET') }"
              @click="
                hasPermission('PRODUCT_DETAIL_GET')
                  ? goDetail(tradeAfterSalesData.productId, 'product')
                  : ''
              "
            >
              {{ tradeAfterSalesData?.productName || '-' }}
            </div>
          </div>
        </div>
        <div>
          <div class="content-title"> 售后信息</div>
          <div class="flex_start _item-box">
            <div class="_item-title">售后方式：</div>
            <div class="_item-value font-color-FF5050">{{ tradeAfterSalesData?.type?.name }}</div>
          </div>
          <div class="flex_start _item-box">
            <template v-if="tradeAfterSalesData?.typeCode === 'EXCHANGE_PRODUCT'">
              <div class="_item-title">换货数量：</div>
              <div class="_item-value">{{ tradeAfterSalesData?.productQuantity }}</div>
            </template>
            <template v-else>
              <div class="_item-title">退款金额：</div>
              <div class="_item-value" style="display: inline-flex; align-items: flex-start">
                <span class="font-color-FF5050">
                  ￥{{ completingDecimalLength(tradeAfterSalesData?.refund) }}
                </span>
                <span
                  class="money-transfer-process-text"
                  v-if="tradeAfterSalesData.tradeAfterSaleRefund"
                >
                  <span
                    @click="handleAction"
                    v-if="tradeAfterSalesData.tradeAfterSaleRefund"
                    style="display: inline-flex; align-items: center"
                  >
                    <Icon icon="ion:information-circle-outline" :size="16" />
                    钱款去向
                  </span>
                </span>
              </div>
            </template>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">
              {{ tradeAfterSalesData?.typeCode !== 'EXCHANGE_PRODUCT' ? '退款' : '换货' }}原因：
            </div>
            <div class="_item-value">{{ tradeAfterSalesData?.reason || '-' }}</div>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">
              {{ tradeAfterSalesData?.typeCode !== 'EXCHANGE_PRODUCT' ? '退款' : '换货' }}说明：
            </div>
            <div class="_item-value">{{ tradeAfterSalesData?.description || '-' }}</div>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">售后历史：</div>
            <div class="_item-value">{{ tradeAfterSalesData?.productAfterSaleCount || '0' }}次</div>
          </div>
        </div>

        <div>
          <div class="content-title"> 订单信息</div>
          <div class="flex_start _item-box">
            <div class="_item-title">订单编号：</div>
            <div
              class="_item-value"
              :class="{ 'action-text': hasPermission('TRADE_DETAIL_GET') }"
              @click="
                hasPermission('TRADE_DETAIL_GET')
                  ? goDetail(tradeAfterSalesData.tradeId, 'order')
                  : ''
              "
            >
              {{ tradeAfterSalesData?.tradeId || '-' }}
            </div>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">微信交易号：</div>
            <div class="_item-value">{{ tradeAfterSalesData?.wxTradeId || '-' }}</div>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">创建时间：</div>
            <div class="_item-value">
              {{
                tradeAfterSalesData?.tradeCreatedDate
                  ? formatToDateTime(tradeAfterSalesData?.tradeCreatedDate)
                  : '-'
              }}</div
            >
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">商品单价：</div>
            <div class="_item-value">
              ￥{{ completingDecimalLength(tradeAfterSalesData?.productPrice) || '0.00' }}</div
            >
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">发货状态：</div>
            <div class="_item-value">
              {{ tradeAfterSalesData?.tradeStatusCode === 'TRADE_SUCCEEDED' ? '已发货' : '未发货' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 协商历史 -->
      <div class="update-content-container" style="padding: 20px 0 0">
        <div class="negotiation-history-container">
          <div class="content-title">协商历史</div>
          <!-- 模板 -->
          <div v-for="(item, idx) in tradeAfterSalesData.tradeAfterSaleNegotiations" :key="idx">
            <div class="flex_start_top history-list">
              <div class="_avatar_box">
                <img :src="getFileUrl(item?.createdUserData.url)" />
              </div>
              <div class="history-content">
                <div class="_title">
                  <span>{{ item?.createdUserData.name || '-' }}</span>
                  <span style="padding-left: 10px">
                    {{ item?.createdDate ? formatToDateTime(item?.createdDate) : '-' }}
                  </span>
                </div>
                <div class="content-container">
                  <div v-html="item.negotiateContent || '-'"></div>
                </div>
                <!-- 凭证 -->
                <div class="img-container flex_start_top" v-if="item.tradeAfterSaleFiles">
                  <div v-for="(file, index) in item.tradeAfterSaleFiles" :key="index">
                    <div style="width: 100px; height: 100px; margin: 20px 20px">
                      <img
                        :src="getFileUrl(file.fileUrl)"
                        alt=""
                        style="width: 100%; height: 100%"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 钱款去向 -->
  <MoneyModal @register="registerModal" />
</template>

<script setup lang="ts">
  import { onMounted, ref, unref } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { Icon } from '/@/components/Icon';
  import { formatToDateTime, dateUtil } from '/@/utils/dateUtil';
  import { useModal } from '/@/components/Modal';
  import { useRouter } from 'vue-router';
  import { getTradeAfterSalesDetail } from './afterSales.api';
  import { TradeFunction } from '/@/utils/tradeFunction';
  import MoneyModal from './components/MoneyModal.vue';
  import { OssUtils } from '/@/utils/ossUtils';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useUserStore } from '/@/store/modules/user';
import { message } from 'ant-design-vue';

  const userStore = useUserStore();
  const { hasPermission } = usePermission();
  const go = useGo();
  const { currentRoute } = useRouter();
  const { params } = unref(currentRoute);
  const { path } = params;

  const tradeAfterSalesData = ref({} as any);
  const tradeFunction = new TradeFunction();

  const ossUtils = new OssUtils();
  function getFileUrl(fileUrl: string) {
    return ossUtils.getSignatureUrl(fileUrl);
  }

  // 触发操作栏
  const menuAction = (action: 'record') => {
    if(!hasPermission('CHAT_RECORD_GET')){
      return message.error('没有相关权限，请联系管理员')
    }
    if (action == 'record') {
      const listData = {
        shopId: tradeAfterSalesData.value.shopId,
        buyerId: tradeAfterSalesData.value.buyerId,
        shopName: tradeAfterSalesData.value.shopName,
        buyerNickName: tradeAfterSalesData.value.buyerNickName,
        createdDate: tradeAfterSalesData.value.createdDate,
      };
      userStore.setSearchChatRecordData(listData);
      goDetail(null, 'chatRecord');
    }
  };

  const goDetail = (id, type: 'buyer' | 'product' | 'order' | 'chatRecord') => {
    if (type == 'buyer') {
      go(`/consumer/basic/consumerDetail/${id}`);
    } else if (type == 'product') {
      go(`/goods/basic/productDetail/${id}`);
    } else if (type == 'order') {
      go(`/order/trades/tradesListDetail/${id}`);
    } else if (type == 'chatRecord') {
      go(`/chat/basic/chatRecord/${'record'}`);
    }
  };

  const handleAction = () => {
    openModal(true, {
      ...tradeAfterSalesData.value,
      refundScheduleProgressBarList: [...refundScheduleProgressBarList],
    });
  };

  // 欠款去向弹窗
  const [registerModal, { openModal }] = useModal();

  // 小数位格式化
  function completingDecimalLength(number: string | number) {
    let result = '';
    if (!number) {
      number = '0.00';
    } else {
      let matchData = String(number).split('.');
      if (matchData.length > 1) {
        const DecimalLength = matchData[1].length;
        if (DecimalLength === 2) {
          result = String(number); // 返回原数据
        } else if (DecimalLength === 1) {
          result = number + '0'; // 补0
        } else if (DecimalLength === 0) {
          // 异常 有小数点 没有小数位,因为已经有小数点直接补0
          result = number + '00'; // 补0
        } else if (DecimalLength > 2) {
          // 小数位大于两位，异常情况？裁剪两位，todo:是否需要添加金额进制算法？
          result = matchData[0] + '.' + matchData[1].slice(0, 2);
        }
      } else {
        result = number + '.00'; // 补0, 没有小数位
      }
    }

    return result;
  }

  const disposeList = [
    { code: 'AFTER_SALE_MAMA_AGREED', name: '同意退款申请' },
    { code: 'AFTER_SALE_MAMA_REJECTED', name: '驳回退款申请' },
  ];
  const refundScheduleProgressBarList = [
    { code: 'AFTER_SALE_REFUNDING', status: 'wait', name: '商家退款', time: '' },
    { code: 'AFTER_SALE_REFUND_SUCCEEDED', status: 'wait', name: '退款成功', time: '' },
  ];

  // 创建协商历史用户类型处理
  function initializeName(code, item) {
    let result = { name: '', url: '' };
    switch (code) {
      case 'buyer':
        result = { name: item.buyerNickName, url: item.buyerAvatarUrl };
        break;
      case 'vendor':
        result = { name: item.shopName, url: item.shopLogoUrl };
        break;
      case 'mama':
        result = { name: '系统', url: 'assets/images/logo.png' };
        break;
    }
    return result;
  }

  // 根据退换单code状态显示内容
  function matchStatusCode(negotiateItem, resData) {
    let result = '';
    switch (negotiateItem.statusCode) {
      case 'AFTER_SALE_WAITING_VENDOR_HANDLE': // 请等待商家处理
      case 'AFTER_SALE_MAMA_AGREED': // 平台同意退款申请
        let description = '';
        let isRefund = '';
        if (resData.typeCode === 'EXCHANGE_PRODUCT') {
          description = '换货';
        } else {
          description = '退款';
          isRefund = ` <br />退款金额：${negotiateItem.refund}元`;
        }

        if (
          negotiateItem.statusCode === 'AFTER_SALE_MAMA_AGREED' &&
          negotiateItem.handleDescription
        ) {
          result = `平台客服介入处理，处理结果：同意${resData.type.name}申请${isRefund}
                    <br />
                    处理说明：${negotiateItem.handleDescription}。`;
        } else {
          result = `买家${negotiateItem?.initiate ? '发起' : '修改'}了${resData.type.name}申请，
                    货物状态：${negotiateItem.productReceived ? '已收到货' : '未收到货'}
                    <br />
                    ${description}原因：${negotiateItem.reason}
                    <br />
                    ${description}说明：${
            negotiateItem.description ? negotiateItem.description : '无'
          }${isRefund}`;
          if (resData.typeCode === 'EXCHANGE_PRODUCT' && negotiateItem.productQuantity) {
            result = result + `<br />换货数量：${negotiateItem.productQuantity}`;
          }
        }
        break;
      case 'AFTER_SALE_WAITING_BUYER_HANDLE': // 请等待买家处理
        if (
          negotiateItem.statusCode === 'AFTER_SALE_MAMA_REJECTED' &&
          negotiateItem.handleDescription
        ) {
          if (resData.typeCode === 'EXCHANGE_PRODUCT') {
            description = '换货';
            isRefund = '';
          } else {
            description = '退款';
            isRefund = `退款金额：${negotiateItem.refund}元，`;
          }
          result = `平台经过审视，同意买家售后申请，请商家及时处理${description}。${isRefund}原因：${negotiateItem.handleDescription}`;
        } else if (negotiateItem.auto) {
          // 若该时间段内商家没有作出回应，则系统默认同意退款
          result = '商家超时未处理，系统默认同意退款'; // (线框没文案)
        } else {
          result = '商家同意了本次售后服务申请';
          result = negotiateItem.vendorName
            ? result +
              `，已确认收货地址：${negotiateItem.vendorName}，${negotiateItem.vendorMobile}，${negotiateItem.vendorAddress} `
            : result;
        }
        // result = '商家同意了本次售后服务申请';
        // result = `商家同意了本次售后服务${negotiateItem.refund ? '，退款给买家' + negotiateItem.refund + '元' : ''}`;
        // 待买家处理|2、商家确认收货地址：袁小姐，13750000000，广东省珠海市香洲区xxx大厦xx室
        break;
      case 'AFTER_SALE_WAITING_VENDOR_RECEIPT': // 商家待收货
        result = `买家已退货，物流公司：${negotiateItem.logisticsCompanyName} ，物流单号：${
          negotiateItem.logisticsNumber
        }
                  <br />
                  退货说明：${negotiateItem.description ? negotiateItem.description : '无'}`;
        break;
      case 'AFTER_SALE_VENDOR_REJECTED': // 商家已拒绝
        result = `商家拒绝了本次售后服务申请
                  <br />
                  拒绝原因：${negotiateItem.rejectReason ? negotiateItem.rejectReason : '无'}
                  <br />
                  拒绝说明：${
                    negotiateItem.vendorDescription ? negotiateItem.vendorDescription : '无'
                  }`;
        break;
      case 'AFTER_SALE_MAMA_INTERVENED': // 平台客服介入中
        result = `${negotiateItem.createdUserType === 'buyer' ? '买家' : '商家'}申请客服介入
                  <br />
                  售后原因：${negotiateItem.afterSaleReason}`;
        break;
      case 'AFTER_SALE_REFUNDING': // 退款中
      case 'AFTER_SALE_ABNORMAL': // 退款异常
        result = `商家同意了本次售后服务${
          negotiateItem.refund ? '，退款给买家' + negotiateItem.refund + '元' : ''
        }，退款处理中`;
        break;
      case 'AFTER_SALE_REFUND_SUCCEEDED': // 退款成功
        if (negotiateItem.auto && negotiateItem.createdUserType === 'mama') {
          // 若该时间段内商家没有作出回应，则系统默认同意退款
          if (resData.typeCode === 'EXCHANGE_PRODUCT') {
            result = '商家超时未处理，系统默认换货成功'; // (线框没文案)
          } else {
            result = '商家超时未处理，系统默认同意退款'; // (线框没文案)
          }
        } else if (!negotiateItem.auto && resData.typeCode === 'EXCHANGE_PRODUCT') {
          result = '买家确认完成换货'; // 换货
        } else {
          // 仅退款 | 退货退款
          result = '退款成功'; // 买家退货阶段，商家确认收货
        }
        break;
      case 'AFTER_SALE_REFUND_CANCELLED': // 退款关闭
      case 'AFTER_SALE_MAMA_REJECTED': // 平台驳回申请
        result = `退款失败`;
        if (
          negotiateItem.statusCode === 'AFTER_SALE_MAMA_REJECTED' &&
          negotiateItem.handleDescription
        ) {
          result = `平台客服介入处理，处理结果：驳回退款申请
                    <br />
                    处理说明：${negotiateItem.handleDescription}。`;
        } else {
          result = negotiateItem.auto ? `商家超时未处理，售后申请自动关闭` : `买家撤销了售后申请`;
        }
        break;
    }
    return result;
  }

  onMounted(async () => {
    let result = await getTradeAfterSalesDetail(path as string).then((resData) => {
      const initData = tradeFunction.initializePage(resData?.currentStatusCode, resData);

      resData['currentStatusName'] = initData.name;
      resData['currentStatusTime'] = initData.time;

      if (resData.typeCode === 'EXCHANGE_PRODUCT') {
        disposeList.forEach((element) => {
          element.name = element.name.split('退款').join('换货');
        });
      }

      if (resData.tradeAfterSaleNegotiations) {
        const negotiationsLength = resData.tradeAfterSaleNegotiations.length;
        // 第一条记录，即是 发起了退款申请
        resData.tradeAfterSaleNegotiations[negotiationsLength - 1]['initiate'] = true;

        resData.tradeAfterSaleNegotiations.forEach((element) => {
          element['createdUserData'] = initializeName(element.createdUserType, element);
          // 退换单状态处理
          element['negotiateContent'] = matchStatusCode(element, resData);
        });
      }

      // 退款进度处理
      if (resData.tradeAfterSaleRefund) {
        refundScheduleProgressBarList.forEach((item) => {
          // 商家退款/微信受理
          if (item.code === 'AFTER_SALE_REFUNDING') {
            item.status = 'process';
            item.time = dateUtil(resData.tradeAfterSaleRefund.createdDate).format(
              'YYYY-MM-DD HH:mm:ss',
            );
          } else if (item.code === 'AFTER_SALE_REFUND_SUCCEEDED') {
            /**
             * SUCCESS：退款成功 CLOSE：退款关闭 ABNORMAL：退款异常
             */
            if (resData.tradeAfterSaleRefund.statusCode === 'SUCCESS') {
              item.time = dateUtil(resData.tradeAfterSaleRefund.succeedDate).format(
                'YYYY-MM-DD HH:mm:ss',
              );
            } else {
              item.name = '退款失败';
              item.time = dateUtil(resData.updatedDate).format('YYYY-MM-DD HH:mm:ss');
            }
            item.status = 'process';
          }
        });
      }

      return resData;
    });

    tradeAfterSalesData.value = result;
  });
</script>

<style lang="less" scoped>
  .font-color-FF5050 {
    color: #ff5050 !important;
  }

  .flex_start {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .flex_start_column {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-flow: column;
  }

  .flex_start_top {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .flex_start_wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .flex_between_column {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-flow: column;
  }

  .flex_between-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .action-text {
    cursor: pointer;
    color: #007bff !important;
    &._disable {
      cursor: not-allowed;
      color: #d1d3d7 !important;
    }
  }

  .action-text-hover {
    &:hover {
      cursor: pointer;
      color: #007bff !important;
    }
  }

  // 操作按钮
  .action-btn {
    display: inline-block;
    padding: 0 8px;
    // width: 82px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: #000;
    border: 1px solid #d9d9d9;
    background-color: #fff;
    border-radius: 3px;
    cursor: pointer;
    user-select: none !important;

    &.red {
      border: 1px solid #c02235;
      background-color: #c02235;
      color: #fff;

      &:active {
        border: 1px solid #b62133;
        background-color: #b62133;
      }
    }

    // 禁用
    &.gray {
      border: 1px solid #b8b8b8;
      background-color: #b8b8b8;
      color: #fff;
      cursor: default;
    }

    &:active {
      background: #ededed;
      -webkit-transition-duration: 0;
      transition-duration: 0;
      -webkit-box-shadow: 0 0 0 2px #ededed, 0 0 0 4px #ededed;
      box-shadow: 0 0 0 2px #ededed, 0 0 0 4px #ededed;
    }
  }

  .update-page-container {
    padding: 20px;
  }

  .update-content-container {
    background-color: #fff;
    border-radius: 5px;
    margin-bottom: 15px;
  }

  .content-title {
    font-size: 16px;
    color: #222222;
    line-height: 21px;
    position: relative;
    padding-bottom: 20px;

    &::before {
      content: '';
      position: absolute;
      left: -14px;
      height: 21px;
      width: 4px;
      background-color: #c02235;
    }
  }

  ._item-box {
    padding-bottom: 10px;
    padding-right: 65px;

    ._item-title {
      font-size: 14px;
      color: #4f4f4f;
      line-height: 22px;
      min-width: 40px;
      flex-shrink: 0; // flex 布局下 不会因为宽度不够而被压缩该元素宽度
    }

    ._item-value {
      font-size: 14px;
      color: #4f4f4f;
      line-height: 22px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }

  // 头部状态栏
  .header-status-container {
    padding: 40px 80px;
    text-align: center;
    flex-shrink: 0;
    border-right: solid 2px #f2f2f2;

    ._status-text {
      color: #c02235;
      font-weight: 700;
      font-size: 24px;
    }

    ._product-type-text {
      color: #4f4f4f;
      margin-top: 35px;
    }
  }

  // 头部买家信息
  .header-buyer-container {
    width: 100%;
    padding: 25px 30px;

    .buyer-detail-box {
      .buyer-avatar-content {
        width: 65px;
        height: 65px;
        flex-shrink: 0;
        background: #f1f1f1;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }

      .buyer-detail-content {
        width: 100%;
        padding-left: 22px;
        padding-top: 5px;

        .buyer-detail-item {
          color: #4f4f4f;
          line-height: 19px;
          margin-bottom: 20px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .buyer-action-container {
      margin-top: 25px;

      .action-btn {
        padding: 0 22px;
        width: auto;

        i {
          padding-right: 8px;
        }
      }
    }
  }

  ._item-title {
    img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }

  .negotiation-history-container {
    .content-title {
      padding-left: 35px;

      &::before {
        content: '';
        left: 21px;
      }
    }

    .history-list {
      padding: 0 33px 22px;
      border-bottom: solid 1px #f2f2f2;
      margin-bottom: 22px;

      &:last-child {
        border-bottom: none;
      }

      ._avatar_box {
        flex-shrink: 0;
        width: 46px;
        height: 46px;
        margin-right: 20px;
        background: #f1f1f1;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }

      .history-content {
        ._title {
          color: #7c7c7c;
          line-height: 22px;
          margin-bottom: 2px;
        }

        .content-container {
          color: #212121;
          line-height: 22px;
        }
      }
    }
  }

  .money-transfer-process-text {
    margin-left: 32px;
    color: #c4c4c4;
    font-size: 14px;
    cursor: pointer;
    user-select: none;

    i {
      margin-right: 5px;
    }
  }

  .refund-schedule-process-text {
    color: #007bff;
    cursor: pointer;
    user-select: none;
  }

  .input-container {
    .title {
      width: 85px;
      text-align: right;
    }
  }

  // 进度条样式重写
  ::ng-deep {
    .ant-steps-label-vertical {
      .ant-steps-item-tail {
        margin-left: 87px;
        padding: 10.5px 21px;
      }

      .ant-steps-item-icon {
        margin-left: 65px;
        width: 43px;
        height: 43px;
        line-height: 43px;
        font-size: 20px;
        background-color: #b8b8b8;
        border-color: #b8b8b8;

        > .ant-steps-icon {
          color: #ffffff !important;
        }
      }

      .ant-steps-item-content {
        width: 175px;
      }
    }

    .ant-steps-item-process .ant-steps-item-icon {
      background-color: #c02235;
      border-color: #c02235;
    }

    .ant-steps-item-title {
      color: #4f4f4f !important;
    }

    .ant-steps-item-description {
      color: #b8b8b8 !important;
    }

    .input-container {
      .ant-select-selection__rendered {
        margin: 0 !important;
        line-height: 34px !important;
      }
    }
  }
</style>
