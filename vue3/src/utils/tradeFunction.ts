import { dateUtil } from './dateUtil';

export class TradeFunction {
  constructor() {}

  // 售后状态/时间处理
  public initializePage(code, data?) {
    const result = { name: '', time: '' };

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
      const countdown = this.startCountdown(data.createdDate, endTime); // 剩余时间
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
          result.time = this.processingTime(data.updatedDate); // 显示平台处理时间
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
          result.time = this.processingTime(data.tradeAfterSaleRefund.createdDate); // 商家同意退款后，处理时间
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

  // 计算已处理时间
  public processingTime(refundDate) {
    if (!refundDate) {
      return '';
    }
    let countdown = { day: '00', hour: '00', minute: '00', second: '00' };
    const currentDate = dateUtil().valueOf(); // 当前时间戳
    const createdTamp = dateUtil(refundDate).valueOf(); // 商家同意退款时间戳
    countdown = this.transformRemainTime(currentDate - createdTamp, countdown);
    return `已处理${countdown.day}天${countdown.hour}时${countdown.minute}分`;
  }

  /**
   * 计算倒计时时间
   * @param createTime 创建时间
   * @param endTime 结束时间
   * @callback result 返回显示时间结构
   */
  public startCountdown(createTime: any, endTime: any) {
    const result = { day: '00', hour: '00', minute: '00', second: '00' };

    if (!createTime) {
      return result;
    } // 时间为空，返回空结构
    const currentTimesTamp = dateUtil().valueOf(); // 当前时间戳
    const createTimesTamp = dateUtil(createTime).valueOf(); // 创建时间戳
    let millisecond = createTimesTamp + endTime - currentTimesTamp;
    millisecond -= 1000;
    if (millisecond <= 0) {
      return result;
    }
    return this.transformRemainTime(millisecond, result);
  }

  /**
   * 剩余时间(毫秒)处理转换时间
   * @param millisecond 时间戳差值
   * @param obj 显示的时间结构
   */
  private transformRemainTime(
    millisecond: any,
    obj = { day: '', hour: '', minute: '', second: '' },
  ) {
    const countdownObj = obj;
    // 秒数
    const seconds = Math.floor(millisecond / 1000);
    // 天数
    countdownObj.day = this.formatTime(Math.floor(seconds / 3600 / 24));
    // 小时
    countdownObj.hour = this.formatTime(Math.floor((seconds / 3600) % 24));
    // 分钟
    countdownObj.minute = this.formatTime(Math.floor((seconds / 60) % 60));
    // 秒
    countdownObj.second = this.formatTime(Math.floor(seconds % 60));
    return countdownObj;
  }

  // 格式化时间为2位
  private formatTime(time: any) {
    if (time < 10) {
      return '0' + time;
    }
    return time;
  }
}
