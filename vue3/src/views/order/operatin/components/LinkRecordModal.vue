<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="760"
    :min-height="200"
    title="所有关联记录"
    :can-fullscreen="false"
    :destroy-on-close="true"
    :show-cancel-btn="false"
    :show-ok-btn="false"
  >
    <div class="model-body" style="padding: 25px 25px 30px">
      <div class="table-container">
        <table style="position: relative">
          <thead>
            <tr>
              <th style="width: 20%; padding-left: 15px">类型</th>
              <th style="width: 30%">微信支付流水号</th>
              <th style="width: 25%">金额(元)</th>
              <th style="width: 25%">入账时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding-left: 15px">订单入账</td>
              <td>WX22210202111544444444</td>
              <td>11511.00</td>
              <td>2021-03-04 17:01:01</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';

  // 表单赋值
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: true });
    console.log('data =>', data);

    // 重置表单
    setModalProps({ confirmLoading: false });
  });
</script>

<style scoped lang="less">
  .model-header {
    width: 100%;
    padding: 18px 24px !important;
    font-weight: 400;
    font-size: 16px;
    color: #222222;
    box-shadow: 0px 12px 48px rgba(0, 0, 0, 0.03);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
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
</style>
