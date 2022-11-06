<template>
  <div class="page-container">
    <div class="update-page-container">
      <div class="update-content-container" style="padding: 20px">
        <!--  订单信息 -->
        <div class="content-title">
          订单编号：
          <span
            :class="{ 'action-text': hasPermission('TRADE_DETAIL_GET') }"
            @click="
              hasPermission('TRADE_DETAIL_GET') ? goDetail(evaluateData?.tradeId, 'order') : ''
            "
          >
            {{ evaluateData?.tradeId || '-' }}
          </span>
        </div>
        <div class="flex_start product-content">
          <div class="_img">
            <img :src="getFileUrl(evaluateData?.productFileUrl)" />
          </div>
          <div
            class="_item-value"
            :class="{ 'action-text': hasPermission('PRODUCT_DETAIL_GET') }"
            @click="
              hasPermission('PRODUCT_DETAIL_GET')
                ? goDetail(evaluateData?.productId, 'product')
                : ''
            "
          >
            {{ evaluateData?.productName || '-' }}
          </div>
        </div>

        <!-- 评价信息 -->
        <div class="page-eval-content">
          <div class="page-eval-table-tr">
            <div class="table-first-td">
              <span>买家评价</span>
            </div>

            <div class="table-content">
              <!-- 买家信息/商家信息 -->
              <div class="flex_start buyer-info-content">
                <div class="_img">
                  <img
                    :src="
                      getFileUrl(
                        evaluateData?.buyerAvatarUrl
                          ? evaluateData?.buyerAvatarUrl
                          : evaluateData?.shopLogoUrl,
                      )
                    "
                  />
                </div>
                <div>
                  {{
                    evaluateData?.buyerNickName
                      ? evaluateData?.buyerNickName
                      : evaluateData?.shopName
                  }}
                </div>
              </div>

              <!-- 评价内容 -->
              <div class="flex_start_top">
                <div class="_item-left">
                  <div>
                    [{{ evaluateData?.tradeProductBuyerReviewSecond ? '初次评价' : '评价' }}]：
                  </div>
                  <!-- 评价等级 -->
                  <div
                    class="flex_start {{'font-color-'+ evaluateData?.grade}}"
                    style="padding-top: 10px"
                  >
                    <img
                      class="eval-icon-size"
                      :src="'resource/img/multicolor-icon/' + evaluateData?.grade + '.png'"
                    />
                    <span style="padding-left: 5px">{{ evaluateData?.gradeName || '-' }}</span>
                  </div>
                </div>
                <div>
                  <div v-html="evaluateData?.content || '-'"></div>
                  <div v-if="evaluateData?.tradeProductBuyerReviewAttachments" class="image-box">
                    <image-container :imageSrc="evaluateData?.tradeProductBuyerReviewAttachments" />
                  </div>
                  <div class="font-color-CCCCCC">
                    {{
                      evaluateData?.createdDate ? formatToDateTime(evaluateData?.createdDate) : '-'
                    }}
                  </div>
                </div>
              </div>

              <!-- 商家回复 -->
              <div class="flex_start_top" v-if="evaluateData?.replyContent">
                <div class="_item-left">[商家回复]：</div>
                <div>
                  <div class="font-color-AF874D">{{ evaluateData?.replyContent || '-' }} </div>
                  <div class="font-color-CCCCCC">
                    {{ evaluateData?.replyDate ? formatToDateTime(evaluateData?.replyDate) : '-' }}
                  </div>
                </div>
              </div>

              <!-- 买家追评 -->
              <div class="flex_start_top" v-if="evaluateData?.tradeProductBuyerReviewSecond">
                <div class="_item-left">[买家追评]：</div>
                <div>
                  <div v-html="evaluateData?.tradeProductBuyerReviewSecond?.content || '-'"></div>
                  <div
                    v-if="
                      evaluateData?.tradeProductBuyerReviewSecond
                        ?.tradeProductBuyerReviewSecondAttachments
                    "
                    class="image-box"
                  >
                    <image-container
                      :imageSrc="
                        evaluateData?.tradeProductBuyerReviewSecond
                          ?.tradeProductBuyerReviewSecondAttachments
                      "
                    />
                  </div>

                  <div class="font-color-CCCCCC">
                    {{
                      evaluateData?.tradeProductBuyerReviewSecond?.createdDate
                        ? formatToDateTime(evaluateData?.tradeProductBuyerReviewSecond?.createdDate)
                        : '-'
                    }}
                  </div>
                </div>
              </div>

              <!-- 商家回复追评 -->
              <div
                class="flex_start_top"
                v-if="evaluateData?.tradeProductBuyerReviewSecond?.replyContent"
              >
                <div class="_item-left">[商家回复追评]：</div>
                <div>
                  <div class="font-color-AF874D">
                    {{ evaluateData?.tradeProductBuyerReviewSecond?.replyContent || '-' }}
                  </div>
                  <div class="font-color-CCCCCC">
                    {{
                      evaluateData?.tradeProductBuyerReviewSecond?.replyDate
                        ? formatToDateTime(evaluateData?.tradeProductBuyerReviewSecond?.replyDate)
                        : '-'
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 结束：买家评价 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { getReviewsDetail } from './evaluate.api';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { OssUtils } from '/@/utils/ossUtils';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { checkValueOfEmpty } from '/@/utils/table';
  import { useGo } from '/@/hooks/web/usePage';
  import ImageContainer from '/@/views/chat/components/ImageContainer.vue';

  const { hasPermission } = usePermission();
  const { currentRoute } = useRouter();
  const { params } = unref(currentRoute);
  const { path } = params;

  const evaluateData = ref({} as any);

  const go = useGo();
  function goDetail(id, type: 'order' | 'product' | 'afterSale' | 'shop') {
    if (checkValueOfEmpty(id)) {
      return;
    }

    if (type == 'order') {
      go(`/order/trades/tradesListDetail/${id}`);
    } else if (type == 'product') {
      go(`/goods/basic/productDetail/${id}`);
    } else if (type == 'afterSale') {
      go(`/order/trades/afterSalesDetail/${id}`);
    } else if (type == 'shop') {
      go(`/merchant/basic/shopDetail/${id}`);
    }
  }

  // 等级处理
  function initializePage(code) {
    let result = '';
    switch (code) {
      case 'GOOD':
        result = '好评';
        break;
      case 'NORMAL':
        result = '中评';
        break;
      case 'BAD':
        result = '差评';
        break;
    }

    return result;
  }

  const ossUtils = new OssUtils();
  function getFileUrl(fileUrl: string) {
    return ossUtils.getSignatureUrl(fileUrl);
  }

  onMounted(async () => {
    let result = await getReviewsDetail(path as string).then((resData) => {
      console.log('resData =>', resData);

      resData['isShowChild'] = true;
      resData['gradeName'] = initializePage(resData.grade);
      if (resData.tradeProductVendorReview) {
        resData.tradeProductVendorReview['isShowChild'] = true;
        resData.tradeProductVendorReview['gradeName'] = initializePage(
          resData.tradeProductVendorReview.grade,
        );
      }

      return resData;
    });

    // 处理 tradeProductBuyerReviewAttachments 中的图片
    if (result.tradeProductBuyerReviewAttachments) {
      result.tradeProductBuyerReviewAttachments = result.tradeProductBuyerReviewAttachments.map(
        (item) => item.attachmentUrl,
      );
    }
    if (result.tradeProductBuyerReviewSecond?.tradeProductBuyerReviewSecondAttachments) {
      result.tradeProductBuyerReviewSecond.tradeProductBuyerReviewSecondAttachments =
        result.tradeProductBuyerReviewSecond.tradeProductBuyerReviewSecondAttachments.map(
          (item) => item.attachmentUrl,
        );
    }
    console.log('result =>', result);

    evaluateData.value = result;
  });
</script>

<style scoped lang="less">
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

  .update-page-container {
    padding: 20px;
  }

  .update-content-container {
    background-color: #fff;
    border-radius: 5px;
    margin-bottom: 15px;
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
    padding-left: 14px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      height: 21px;
      width: 4px;
      background-color: #c02235;
    }
  }

  .product-content {
    background: #f7f8fa;
    padding: 10px 30px;
    border-radius: 2px;
    cursor: pointer;

    ._img {
      width: 60px;
      height: 60px;
      margin-right: 20px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .buyer-info-content {
    padding-bottom: 10px;
    padding-right: 65px;

    ._img {
      width: 46px;
      height: 46px;
      margin-right: 20px;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }
  }

  .page-eval-content {
    padding-top: 20px;

    :nth-child(2) {
      border-top: 0;
    }
  }

  // table 显示动画
  .page-eval-table-tr {
    animation: faded 600ms;
    border: 1px solid #dcdcdc;
    border-bottom: 0;

    .table-first-td {
      padding: 10px 10px;
      background-color: #f8f8f8;
      border-bottom: 1px solid #dcdcdc;
      cursor: pointer;

      i {
        padding: 0 10px;
        color: rgba(#000000, 0.4);
      }

      // 翻转90度
      .icon-color._active {
        transform: rotate(-90deg);
      }

      ._font-color-b8b8b8 {
        padding-left: 10px;
        padding-right: 20px;
        color: #b8b8b8;
      }

      ._name {
        float: right;
      }
    }

    // 评价内容
    .table-content {
      padding: 10px 30px 30px 30px;
      border-bottom: 1px solid #dcdcdc;

      .flex_start_top {
        padding-top: 10px;
      }

      ._item-left {
        width: 130px;
        color: #cccccc;
        flex-shrink: 0;
      }

      .eval-icon-size {
        width: 18px;
        height: 18px;
      }

      .font-color-CCCCCC {
        color: #cccccc !important;
        padding-top: 10px;
      }

      .font-color-AF874D {
        color: #af874d !important;
      }

      .font-color-B48E58 {
        color: #b48e58 !important;
      }

      .font-color-GOOD {
        color: #ee4554 !important;
      }

      .font-color-NORMAL {
        color: #f69249 !important;
      }

      .image-box {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        :deep(.ant-image) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          border: 1px solid #e5e5e5;
          box-shadow: 0px 3px 6px rgba(91, 91, 91, 0.1);
          border-radius: 2px;
          margin-right: 20px;
          margin-top: 10px;

          .ant-image-img {
            // width: 100%;
            width: auto;
            height: 100%;
            // object-fit: cover !important;
            display: f;
          }
        }
      }
    }
  }
</style>
