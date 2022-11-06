<template>
  <div class="page-container">
    <div class="update-page-container">
      <div class="update-content-container">
        <div class="table-container">
          <table style="position: relative; width: 100%">
            <thead>
              <tr>
                <th appDynamicColumnWidth style="min-width: 100px; padding-left: 35px">商品名称</th>
                <th appDynamicColumnWidth style="min-width: 150px">交易所属店铺名称</th>
                <th appDynamicColumnWidth style="min-width: 100px">订单编号</th>
                <th appDynamicColumnWidth style="min-width: 100px">金额 (元)</th>
                <th appDynamicColumnWidth style="min-width: 100px">买家</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding-left: 35px">缅甸冰种料</td>
                <td>珠海市思捷先行信息技术有限公司</td>
                <td>562657959315954593</td>
                <td>18122.00</td>
                <td>cocoyuan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!--  订单信息 -->
      <div class="update-content-container flex_between-top" style="padding: 20px 35px">
        <div>
          <div class="content-title">支付信息</div>
          <div class="flex_start _item-box">
            <div class="_item-title">微信流水号：</div>
            <div class="_item-value">WX22212020110512452</div>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">退回账号：</div>
            <div class="_item-value">XX银行（0056）</div>
          </div>
        </div>

        <div>
          <div class="content-title">支付进度</div>

          <div class="flex_start _item-box">
            <div class="_item-title">发起时间：</div>
            <div class="_item-value">2021-03-04 14:30:00</div>
          </div>
          <div class="flex_start _item-box">
            <div class="_item-title">入账时间：</div>
            <div class="_item-value">2021-03-04 15:31:10</div>
          </div>
        </div>

        <!-- 占位 -->
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
  .flex_between-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .flex_start {
    display: flex;
    justify-content: flex-start;
    align-items: center;
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
          padding: 0 3px;
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
            padding: 0 3px;
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
    padding: 25px 30px 0;

    .buyer-detail-box {
      .buyer-avatar-content {
        width: 65px;
        height: 65px;
        flex-shrink: 0;

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

        img {
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }

      ._content_box {
        ._title {
          color: #7c7c7c;
          line-height: 22px;
          margin-bottom: 2px;
        }

        ._value {
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
</style>
