<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="1000"
    :min-height="200"
    :title="'钱款去向'"
    :destroy-on-close="true"
    :can-fullscreen="false"
    :show-cancel-btn="false"
    :show-ok-btn="false"
  >
    <div class="page-container">
      <div class="update-page-container">
        <div class="model-body" style="padding: 25px 0 50px">
          <div style="padding: 0 25px 25px">
            <div class="content-title"> 退款信息</div>
            <div class="flex_start_top">
              <div class="flex_start _item-box" style="width: 400px">
                <div class="_item-title">退款金额：</div>
                <div class="_item-value font-color-FF5050">
                  {{ completingDecimalLength(tradeAfterSalesData?.refund) || '0.00' }}
                </div>
              </div>

              <!-- @click="goDetail(tradeAfterSalesData.tradeId, 'order')" -->
              <!-- action-text -->
              <div class="flex_start _item-box">
                <div class="_item-title">订单编号：</div>
                <div class="_item-value">
                  {{ tradeAfterSalesData.tradeId || '' }}
                </div>
              </div>
            </div>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width: 24px; max-width: 24px"></th>
                  <th>退款流水号</th>
                  <th>申请时间</th>
                  <th>退款方式</th>
                  <th>状态</th>
                  <th>退款原因</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td>{{ tradeAfterSalesData?.tradeAfterSaleRefund?.id || '' }}</td>
                  <td>
                    {{
                      tradeAfterSalesData?.tradeAfterSaleRefund?.createdDate
                        ? formatToDateTime(tradeAfterSalesData?.tradeAfterSaleRefund?.createdDate)
                        : '-'
                    }}
                  </td>
                  <td>
                    {{ tradeAfterSalesData?.tradeAfterSaleRefund?.receivedAccount || '' }}
                  </td>
                  <td>
                    <span class="refund-schedule-process-text" @click="handleOpen">
                      {{ tradeAfterSalesData?.currentStatusName || '' }}
                    </span>
                  </td>
                  <td>{{ tradeAfterSalesData?.reason || '' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </BasicModal>

  <!-- 了解退款进度 -->
  <MoneyProcessModal @register="registerProcessModal" />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { useModal } from '/@/components/Modal';
  import MoneyProcessModal from './MoneyProcessModal.vue';

  // const go = useGo();

  const tradeAfterSalesData = ref({} as any);

  // 表单赋值
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    console.log('data =>', data);

    tradeAfterSalesData.value = data;

    // 重置表单
    setModalProps({ confirmLoading: false });
  });

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

  const handleOpen = () => {
    openModal(true, {
      refundScheduleProgressBarList: tradeAfterSalesData.value.refundScheduleProgressBarList,
    });
  };

  // 了解退款进度
  const [registerProcessModal, { openModal }] = useModal();
</script>

<style lang="less" scoped>
  .refund-schedule-process-text {
    color: #007bff;
    cursor: pointer;
    user-select: none;
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
          @extend .action-text;

          &._disable {
            @extend .font-color-D1D3D7;
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

  .action-text {
    cursor: pointer;
    color: #007bff !important;
    &._disable {
      cursor: not-allowed;
      color: #d1d3d7 !important;
    }
  }

  .font-color-FF5050 {
    color: #ff5050 !important;
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

  .model-body {
    width: 100%;
    padding: 0px;
    background-color: #fff !important;

    .ant-select-selection,
    .ant-select-selection:focus {
      border: none;
      outline: none;
      background: none;
      box-shadow: none;
    }

    // input
    .input-container {
      margin-bottom: 15px;
      line-height: 35px;

      .title {
        padding-right: 6px;
        flex-shrink: 0; // flex 布局下 不会因为宽度不够而被压缩该元素宽度
      }

      input,
      .ant-select-selection {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        width: 100%;
        height: 35px;
        padding-left: 4px;

        > .ant-select-selection__rendered {
          height: 35px;
        }

        input {
          border: none;
          outline: none;
          background: none;
          box-shadow: none;
        }
      }
    }

    .model-del-item {
      padding: 10px 15px 20px;
      color: #ff5050;
    }
  }
</style>
