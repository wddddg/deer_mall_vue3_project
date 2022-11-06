<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :width="660"
    :min-height="200"
    :title="'了解退款进度'"
    :destroy-on-close="true"
    :can-fullscreen="false"
    :show-cancel-btn="false"
    :show-ok-btn="false"
  >
    <div class="page-container" style="padding: 30px 40px">
      <a-steps :current="current">
        <a-step
          v-for="(stepItem, index) in refundScheduleProgressBarList"
          :key="index"
          :title="stepItem?.name"
          :description="stepItem?.time"
        />
      </a-steps>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  const refundScheduleProgressBarList = ref([
    { code: 'AFTER_SALE_REFUNDING', status: 'wait', name: '商家退款', time: '' },
    { code: 'AFTER_SALE_REFUND_SUCCEEDED', status: 'wait', name: '退款成功', time: '' },
  ]);

  const current = computed(() => {
    let index = 0;
    for (let idx = 0; idx < refundScheduleProgressBarList.value.length; idx++) {
      const item = refundScheduleProgressBarList.value[idx];
      if (item.status == 'wait') {
        break;
      }
      index++;
    }

    return index;
  });

  // 表单赋值
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    console.log('data =>', data);

    // 初始化数据
    refundScheduleProgressBarList.value = data.refundScheduleProgressBarList;

    // 重置表单
    setModalProps({ confirmLoading: false });
  });
</script>

<style lang="less" scoped>
  // 页面table
  .table-container {
    border-radius: 5px 5px 5px 5px;
    overflow: hidden;
    height: 100%;
    background-color: #fff;
    position: relative;
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
