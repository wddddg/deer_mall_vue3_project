<template>
  <div class="page-container">
    <div class="update-page-container">
      <!-- 状态、步骤条信息 -->
      <div class="update-content-container flex_start_top">
        <div class="trade-header-status-container flex_between_column">
          <div class="_status-text">
            {{ tradeData?.statusName }}
            <div class="_status-subtitle" v-if="tradeData.statusCode === 'TRADE_CANCELLED'">
              {{ tradeData?.cancelReason || '-' }}
            </div>
          </div>
          <div class="_product-type-text">下单类型：{{ tradeData?.typeName || '-' }}</div>
        </div>
        <div
          class="trade-header-progress-bar"
          :class="{ _width: tradeData.statusCode === 'TRADE_CANCELLED' }"
        >
          <a-steps :current="current">
            <a-step
              v-for="stepItem in tradeProgressBarList.filter((item) => item.isShow)"
              :key="stepItem.code"
              :title="stepItem?.name"
              :description="stepItem?.time ? formatToDateTime(stepItem.time as any) : ''"
            />
          </a-steps>
        </div>
      </div>

      <!--  订单信息 -->
      <div class="update-content-container flex_between-top" style="padding: 20px 35px">
        <div>
          <div class="content-title"> 订单信息</div>
          <div class="flex_start _item-box">
            <div class="_item-title">订单编号：</div>
            <div class="_item-value">{{ tradeData?.id ?? '-' }}</div>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">微信交易号：</div>
            <div class="_item-value">{{ tradeData?.wxTradeId ?? '-' }}</div>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">创建时间：</div>
            <div class="_item-value">
              {{ tradeData?.createdDate ? formatToDateTime(tradeData?.createdDate) : '-' }}
            </div>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">付款时间：</div>
            <div class="_item-value">
              {{ tradeData?.paidDate ? formatToDateTime(tradeData?.paidDate) : '-' }}
            </div>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">实付金额：</div>
            <div class="_item-value"
              >￥{{ completingDecimalLength(tradeData?.paidFee) || '0.00' }}
            </div>
          </div>
        </div>

        <div>
          <div class="content-title"> 买家、商家信息</div>
          <div class="flex_start _item-box">
            <div class="_item-title">买家昵称：</div>
            <div
              class="_item-value"
              :class="{ 'action-text': hasPermission('BUYER_DETAIL_GET') }"
              @click="hasPermission('BUYER_DETAIL_GET') ? goDetail(tradeData.buyerId, 'buyer') : ''"
            >
              {{ tradeData?.buyerNickName }}</div
            >
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">买家备注：</div>
            <div class="_item-value">{{ tradeData?.buyerRemark }}</div>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">商家名称：</div>
            <div
              class="_item-value"
              :class="{ 'action-text': hasPermission('SHOP_DETAIL_GET') }"
              @click="hasPermission('SHOP_DETAIL_GET') ? goDetail(tradeData.shopId, 'shop') : ''"
            >
              {{ tradeData?.shopName || '-' }}
            </div>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">商家备注：</div>
            <div class="_item-value">{{ tradeData?.vendorRemark || '-' }}</div>
          </div>
        </div>

        <div>
          <div class="content-title"> 物流信息</div>
          <div class="flex_start _item-box">
            <div class="_item-title">物流企业：</div>
            <div class="_item-value">{{ tradeData?.logisticsCompanyName || '-' }}</div>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">运单编号：</div>
            <div class="_item-value">{{ tradeData?.logisticsNumber || '-' }}</div>
          </div>
        </div>
      </div>

      <!-- 订单明细 -->
      <div class="update-content-container">
        <div class="table-container" style="height: auto">
          <table style="position: relative">
            <thead>
              <tr>
                <th style="width: 450px">商品</th>
                <th style="width: 200px">单价 (元)</th>
                <th style="width: 150px">数量</th>
                <th style="width: 120px; max-width: 120px">优惠 (元)</th>
                <th style="width: 120px; max-width: 120px">小计 (元)</th>
                <th style="width: 120px">售后状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(productItem, index) in tradeData.tradeProducts" :key="index">
                <td
                  class="product-item"
                  @click="
                    hasPermission('PRODUCT_DETAIL_GET')
                      ? goDetail(productItem.productId, 'product')
                      : ''
                  "
                >
                  <div class="flex_start_top" style="cursor: pointer">
                    <div class="product-pic">
                      <img :src="getFileUrl(productItem.fileUrl)" />
                    </div>
                    <span class="product-title"> {{ productItem?.name || '-' }} </span>
                  </div>
                </td>
                <td>{{ completingDecimalLength(productItem?.price) || '0.00' }}</td>
                <td>{{ productItem?.quantity }}</td>
                <td>
                  <span>{{ completingDecimalLength(productItem?.discountFee) || '0.00' }}</span>
                </td>
                <td>{{ completingDecimalLength(productItem?.paidFee) || '0.00' }}</td>
                <td>
                  <span
                    class="action-text-hover"
                    @click="goDetail(productItem?.tradeAfterSaleId, 'afterSale')"
                  >
                    {{ productItem?.statusCodeName || '-' }}
                  </span>
                </td>
              </tr>
              <tr class="footer-tr-container">
                <td colspan="3">
                  <div class="content-title" style="margin-left: 12px">收货人信息</div>
                  <div class="flex_start _item-box">
                    <div class="_item-title">收货人：</div>
                    <div class="_item-value">{{ tradeData?.buyerName || '-' }}</div>
                  </div>
                  <div class="flex_start _item-box">
                    <div class="_item-title">联系电话：</div>
                    <div class="_item-value">{{ tradeData?.buyerMobile || '-' }}</div>
                  </div>
                  <div class="flex_start _item-box">
                    <div class="_item-title">收货地址：</div>
                    <div class="_item-value">{{ tradeData?.buyerAddress || '-' }}</div>
                  </div>
                </td>
                <td colspan="2">
                  <div class="trade-price-summary-container">
                    <div class="flex_start">
                      <div class="_item-title">商品总价：</div>
                      <div class="_item-value">
                        ￥{{ completingDecimalLength(tradeData?.totalFee) || '0.00' }}
                      </div>
                    </div>
                    <div class="flex_start">
                      <div class="_item-title">运费：</div>
                      <div class="_item-value">
                        ￥{{ completingDecimalLength(tradeData?.deliveryFee) || '0.00' }}
                      </div>
                    </div>
                    <div class="flex_start">
                      <div class="_item-title">优惠：</div>
                      <div class="_item-value">
                        <span v-if="tradeData?.discount"> - </span>
                        ￥{{ completingDecimalLength(tradeData?.discountFee) || '0.00' }}
                      </div>
                    </div>
                    <div class="flex_start total-prices-item">
                      <div class="_item-title">实收金额：</div>
                      <div class="_item-value">
                        ￥{{ completingDecimalLength(tradeData?.paidFee) || '0.00' }}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 结束：订单明细 -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, unref } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { getTradeDetail } from './tradesList.api';
  import { useRouter } from 'vue-router';
  import { dateUtil, formatToDateTime } from '/@/utils/dateUtil';
  import { OssUtils } from '/@/utils/ossUtils';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { hasPermission } = usePermission();
  const go = useGo();
  const { currentRoute } = useRouter();
  const { params } = unref(currentRoute);
  const { path } = params;

  const tradeData = ref({} as any);
  // 状态列表  process->已激活
  const tradeProgressBarList = ref([
    { code: 'TRADE_WAITING_PAY', status: 'wait', name: '买家下单', time: '', isShow: true },
    { code: 'TRADE_WAITING_DELIVERY', status: 'wait', name: '买家付款', time: '', isShow: true },
    { code: 'TRADE_WAITING_RECEIPT', status: 'wait', name: '商家发货', time: '', isShow: true },
    { code: 'TRADE_SUCCEEDED', status: 'wait', name: '交易成功', time: '', isShow: true },
    { code: 'TRADE_CANCELLED', status: 'wait', name: '交易关闭', time: '', isShow: false },
  ]);

  const current = computed(() => {
    let index = 0;
    for (let idx = 0; idx < tradeProgressBarList.value.length; idx++) {
      const item = tradeProgressBarList.value[idx];
      if (item.status == 'wait') {
        break;
      }
      index++;
    }

    return index;
  });

  const ossUtils = new OssUtils();
  function getFileUrl(fileUrl: string) {
    return ossUtils.getSignatureUrl(fileUrl);
  }

  const goDetail = (id, type: 'buyer' | 'shop' | 'product' | 'afterSale') => {
    if (type == 'buyer') {
      go(`/consumer/basic/consumerDetail/${id}`);
    } else if (type == 'product') {
      go(`/goods/basic/productDetail/${id}`);
    } else if (type == 'shop') {
      go(`/merchant/basic/shopDetail/${id}`);
    } else if (type == 'afterSale' && id) {
      go(`/order/trades/afterSalesDetail/${id}`);
    }
  };

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

  function processColor(selectIndex, resData, action?: string) {
    switch (tradeProgressBarList.value[selectIndex].code) {
      case 'TRADE_WAITING_PAY': // 买家下单
        if (action === 'title') {
          resData['statusName'] = '等待买家付款';
        }
        if (resData.createdDate) {
          tradeProgressBarList.value[selectIndex].time = String(resData.createdDate);
        }
        break;
      case 'TRADE_WAITING_DELIVERY': // 买家付款
        if (action === 'title') {
          resData['statusName'] = '等待商家发货';
        }
        if (resData.paidDate) {
          tradeProgressBarList.value[selectIndex].time = String(resData.paidDate);
        }
        break;
      case 'TRADE_WAITING_RECEIPT': // 商家发货
        if (action === 'title') {
          resData['statusName'] = '等待买家收货';
        }
        if (resData.deliveryDate) {
          tradeProgressBarList.value[selectIndex].time = String(resData.deliveryDate);
        }
        break;
      case 'TRADE_SUCCEEDED': // 交易成功
        if (action === 'title') {
          resData['statusName'] = '交易成功';
        }
        if (resData.completedDate) {
          tradeProgressBarList.value[selectIndex].time = String(resData.completedDate);
        }
        break;
      case 'TRADE_CANCELLED': // 交易关闭
        if (action === 'title') {
          resData['statusName'] = '交易关闭';
        }
        tradeProgressBarList.value.forEach((element) => {
          element.isShow = false;
          if (element.code === 'TRADE_WAITING_PAY' || element.code === 'TRADE_CANCELLED') {
            element.isShow = true;
          }
          if (element.code === 'TRADE_WAITING_DELIVERY' && resData.paidDate) {
            element.isShow = true;
          }
          if (element.code === 'TRADE_WAITING_RECEIPT' && resData.deliveryDate) {
            element.isShow = true;
          }
        });
        if (resData.completedDate) {
          tradeProgressBarList.value[selectIndex].time = String(resData.completedDate);
        }

        break;
    }
    return resData;
  }

  // 格式化时间为2位
  function formatTime(time: any) {
    if (time < 10) {
      return '0' + time;
    }
    return time;
  }

  /**
   * 剩余时间(毫秒)处理转换时间
   * @param millisecond 时间戳差值
   * @param obj 显示的时间结构
   */
  function transformRemainTime(
    millisecond: any,
    obj = { day: '', hour: '', minute: '', second: '' },
  ) {
    const countdownObj = obj;
    // 秒数
    const seconds = Math.floor(millisecond / 1000);
    // 天数
    countdownObj.day = formatTime(Math.floor(seconds / 3600 / 24));
    // 小时
    countdownObj.hour = formatTime(Math.floor((seconds / 3600) % 24));
    // 分钟
    countdownObj.minute = formatTime(Math.floor((seconds / 60) % 60));
    // 秒
    countdownObj.second = formatTime(Math.floor(seconds % 60));

    return countdownObj;
  }

  /**
   * 计算倒计时时间
   * @param createTime 创建时间
   * @param endTime 结束时间
   * @callback result 返回显示时间结构
   */
  function startCountdown(createTime: any, endTime: any) {
    let result = { day: '00', hour: '00', minute: '00', second: '00' };
    if (!createTime) {
      return result;
    } // 时间为空，返回空结构
    let currentTimesTamp = dateUtil().valueOf(); // 当前时间戳
    let createTimesTamp = dateUtil(createTime).valueOf(); // 创建时间戳
    let millisecond = createTimesTamp + endTime - currentTimesTamp;
    millisecond -= 1000;
    if (millisecond <= 0) {
      return result;
    }

    return transformRemainTime(millisecond, result);
  }

  // 计算已处理时间
  function processingTime(refundDate) {
    if (!refundDate) {
      return '';
    }

    let countdown = { day: '00', hour: '00', minute: '00', second: '00' };
    const currentDate = dateUtil().valueOf(); // 当前时间戳
    const createdTamp = dateUtil(refundDate).valueOf(); // 商家同意退款时间戳
    countdown = transformRemainTime(currentDate - createdTamp, countdown);

    return `已处理${countdown.day}天${countdown.hour}时${countdown.minute}分`;
  }

  // 售后状态/时间处理
  function initializePage(code, data?) {
    let result = { name: '', time: '' };
    if (data && data.createdDate) {
      let remainingTime = data.currentWaitBuyerForVendorRejectAfterSaleTimeLimitDay
        ? data.currentWaitBuyerForVendorRejectAfterSaleTimeLimitDay
        : 3;
      if (data.currentStatusCode === 'AFTER_SALE_WAITING_VENDOR_RECEIPT') {
        remainingTime = data.currentWaitVendorConfirmAfterSaleDoneTimeLimitDay
          ? data.currentWaitVendorConfirmAfterSaleDoneTimeLimitDay
          : 3;
      }
      const endTime = remainingTime * 24 * 60 * 60 * 1000; // 3天的时间戳
      const countdown = startCountdown(data.createdDate, endTime); // 剩余时间
      result.time = `还剩${countdown.day}天${countdown.hour}时${countdown.minute}分`;
    }

    switch (code) {
      case 'AFTER_SALE_WAITING_VENDOR_HANDLE':
        result.name = '待商家处理';
        break;
      case 'AFTER_SALE_WAITING_VENDOR_RECEIPT':
        result.name = '待商家收货';
        break;
      case 'AFTER_SALE_WAITING_BUYER_HANDLE':
        result.name = '待买家处理';
        break;
      case 'AFTER_SALE_VENDOR_REJECTED':
        result.name = '商家已拒绝';
        break;
      case 'AFTER_SALE_MAMA_INTERVENED':
        result.name = '平台客服介入中';
        if (data && data.updatedDate) {
          data.updatedDate = dateUtil(data.updatedDate).format('YYYY-MM-DD HH:mm:ss');
          result.time = processingTime(data.updatedDate); // 显示平台处理时间
        }
        break;
      case 'AFTER_SALE_REFUND_SUCCEEDED': // 售后成功
        result.name = '售后成功';
        if (data && data.tradeAfterSaleRefund && data.tradeAfterSaleRefund.succeedDate) {
          result.time = dateUtil(data.tradeAfterSaleRefund.succeedDate).format(
            'YYYY-MM-DD HH:mm:ss',
          );
        }
        break;
      case 'AFTER_SALE_REFUND_CANCELLED': // 售后关闭
        result.name = '售后关闭';
        if (data && data.updatedDate) {
          result.time = dateUtil(data.updatedDate).format('YYYY-MM-DD HH:mm:ss'); // 退款关闭时间
        }
        break;
      case 'AFTER_SALE_REFUNDING': // 退款中
      case 'AFTER_SALE_ABNORMAL': // 退款异常
        result.name = '售后中';
        if (data && data.tradeAfterSaleRefund && data.tradeAfterSaleRefund.createdDate) {
          data.tradeAfterSaleRefund.createdDate = dateUtil(
            data.tradeAfterSaleRefund.createdDate,
          ).format('YYYY-MM-DD HH:mm:ss');
          result.time = processingTime(data.tradeAfterSaleRefund.createdDate); // 商家同意退款后，处理时间
        }
        break;
      case 'AFTER_SALE_MAMA_AGREED': // 平台同意申请
        result.name = '平台同意申请';
        break;
      case 'AFTER_SALE_MAMA_REJECTED': // 平台驳回申请
        result.name = '平台驳回申请';
        break;
    }

    return result;
  }

  onMounted(async () => {
    let result = await getTradeDetail(path as string).then((resData) => {
      let selectIndex = -1;
      for (let index = 0; index < tradeProgressBarList.value.length; index++) {
        const element = tradeProgressBarList.value[index];
        if (element.code === resData.statusCode) {
          selectIndex = index;
          break;
        }
      }
      resData['statusName'] = processColor(selectIndex, resData, 'title').statusName;

      if (selectIndex !== -1) {
        for (; selectIndex >= 0; selectIndex--) {
          tradeProgressBarList.value[selectIndex].status = 'process';
          processColor(selectIndex, resData);
        }
      }

      resData.tradeProducts.forEach((element) => {
        switch (element.typeCode) {
          case 'FIXED_PRICE':
            resData['typeName'] = '一口价';
            break;
          case 'AUCTION':
            resData['typeName'] = '拍卖品';
            break;
          case 'EXHIBITION':
            resData['typeName'] = '藏品';
            break;
        }
        let statusData = initializePage(element.tradeAfterSaleStatusCode);
        // 售后状态
        element['statusCodeName'] = statusData.name;
      });
      // 是否优惠
      if (resData.totalFee) {
        resData['discount'] =
          resData.tradeProducts[0].price * resData.tradeProducts[0].quantity >
          resData.paidFee - resData.deliveryFee;
      }

      return resData;
    });

    tradeData.value = result;
  });
</script>

<style lang="less" scoped>
  .flex_start_top {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
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

  // 页面table
  .table-container {
    border-radius: 5px 5px 5px 5px;
    overflow: hidden;
    height: 100%;
    background-color: #fff;
    position: relative;

    table {
      width: 100%;
      // height: 100%;
      text-align: left;
      border-radius: 5px;
      // overflow: hidden;

      &._has-tab {
        border-radius: 0 5px 5px 5px;
      }

      thead > tr {
        height: 51px;
        background-color: #f8f8f8;

        th {
          padding: 0 12px;
          color: #83868e;
          font-size: 14px;
          line-height: 45px;
          user-select: none;
          position: relative;

          // &:first-child {
          //     padding-left: 20px;
          // }
          // &[appDynamicColumnWidth]::after {
          //     top: 25%;
          //     right: 7px;
          //     position: absolute;
          //     content: " ";
          //     width: 2px;
          //     height: 50%;
          //     background-color: #F8F8F8;
          // }

          &:hover[appDynamicColumnWidth]::after {
            top: 25%;
            right: 20px;
            position: absolute;
            content: ' ';
            width: 2px;
            height: 50%;
            background-color: #f8f8f8;
            background-color: #22242f !important;
          }
        }
      }

      tbody {
        // min-height: 600px;
        tr {
          height: 45px;
          // background-color: #fff;
          border-bottom: 1px solid #f2f2f2;

          td {
            padding: 12px;
            // line-height: 37px;
            font-size: 14px;
            color: #4f4f4f;
            height: 45px;

            div.tdValue {
              // height: 100%;
              width: 100%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }

            .tag-box {
              display: inline-block;
              padding: 2px 4px;
              line-height: 16px;
              font-size: 12px;
              color: #fff;
              background: #ff4700 !important;
              border-radius: 2px;
              margin-right: 5px;
            }

            // &:first-child {
            //     padding-left: 20px;
            // }

            ._hide-action {
              display: none;
              font-size: 20px;
              color: #a7a7a7;
            }

            ._active {
              display: block !important;
            }
          }

          // &:nth-child(2n) {
          //     background: #F8F8F8;
          // }

          &:hover {
            background-color: #f5f7f9 !important;

            .menu-container .action_icon {
              color: #0070cc !important;
            }

            td ._show-action {
              display: block !important;
            }
          }

          &.active_bg {
            background-color: #f5f7f9 !important;
          }
        }
      }

      tfoot tr {
        background-color: #fff;

        td {
          padding: 30px 0;

          // line-height: 80px;
          .footer-total-container,
          .footer-pagination-container {
            padding: 0 30px;
          }
        }
      }

      // table 操作按钮
      .action-container {
        .action-item {
          font-size: 14px;
          padding: 0 8px;
          cursor: pointer;
          color: #007bff !important;

          &._disable {
            color: #d1d3d7 !important;
            cursor: not-allowed;
          }

          &:first-child {
            padding-left: 0;
          }

          &:last-child {
            padding-right: 0;
          }
        }
      }
    }

    .action-text-hover {
      &:hover {
        cursor: pointer;
        color: #007bff !important;
      }
    }

    .table-foot-container {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 30px 0;
      background-color: #fff;

      .footer-total-container,
      .footer-pagination-container {
        padding: 0 30px;
      }

      .footer-total-container {
        color: #999;
      }
    }
  }

  .update-page-container {
    padding: 20px;
  }

  .breadcrumb-container {
    padding: 6px 0 15px 5px;
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

    ._item-img {
      margin-top: 12px;
      width: 300px;
      height: 175px;
      background: #f1f1f1;
      text-align: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
    }
  }

  // 头部状态栏
  .trade-header-status-container {
    padding: 40px 80px;
    text-align: center;
    flex-shrink: 0;
    border-right: solid 2px #f2f2f2;
    height: 172px;

    ._status-text {
      color: #c02235;
      font-weight: 700;
      font-size: 24px;

      ._status-subtitle {
        color: #4f4f4f;
        font-weight: 400;
        font-size: 14px;
      }
    }

    ._product-type-text {
      color: #4f4f4f;
    }
  }

  // 进度条
  .trade-header-progress-bar {
    width: 100%;
    height: 180px;
    padding: 0px 90px;
    display: flex;
    align-items: center;

    &._width {
      width: 50%;
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
  }

  table tr {
    td:first-child,
    th:first-child {
      padding-left: 20px;
    }

    td {
      padding-top: 20px;
      vertical-align: top;
    }

    td.product-item {
      padding-top: 12px;
      padding-bottom: 20px;

      .product-pic {
        width: 100px;
        height: 100px;
        background: #f1f1f1;
        text-align: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }

      .product-title {
        padding-left: 20px;
        padding-top: 8px;
      }
    }

    &.footer-tr-container {
      &:hover {
        background-color: #fff !important;
      }

      td {
        padding-top: 20px;
        padding-bottom: 22px;
      }
    }
  }

  // 订单详情价格汇总
  .trade-price-summary-container {
    margin: auto;
    text-align: center;
    padding-right: 50px;
    padding-left: 20px;
    height: 100%;

    .flex_start {
      padding-bottom: 10px;
    }

    ._item-title {
      width: 80px;
      text-align: end;
      flex-shrink: 0;
      color: #999999;
    }

    ._item-value {
      width: 100%;
      text-align: end;
      // padding-right: 10px;
    }

    .total-prices-item {
      border-top: 1px solid #f2f2f2;
      padding-top: 5px;

      ._item-value {
        color: #c02235;
        font-size: 18px;
        font-weight: 700;
      }
    }
  }
</style>
