<!--
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-24 22:44:00
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-25 19:34:14
-->
<template>
  <a-row :gutter="10">
    <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
      <!-- 店铺数据（当月） -->
      <div class="updata-content">
        <div class="content-title">店铺数据（当月）</div>
        <div class="content-other">
          <a-row class="flex-1">
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">订单数：</div>
                <div class="item-value"> {{ shopActionData?.tradeTotalCount }} </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">商品收藏数：</div>
                <div class="item-value"> {{ shopActionData?.productFavoriteTotalCount }} </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">商品浏览量：</div>
                <div class="item-value">{{ shopActionData?.productViewTotalCount }}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">成交额：</div>
                <div class="item-value">
                  {{ shopActionData?.tradeTotalPaidFee }}
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">店铺收藏数：</div>
                <div class="item-value"> {{ shopActionData?.shopFavoriteTotalCount }}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">店铺浏览量：</div>
                <div class="item-value">{{ shopActionData?.shopViewTotalCount }}</div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { shopBase } from '../shop.api';
  import { useRouter } from 'vue-router';
  const { currentRoute } = useRouter();
  const { params } = unref(currentRoute);
  const { path } = params;
  console.log(path, 'path');

  let shopActionData = ref({});

  onMounted(async () => {
    let data = {
      endDate: getLastDate(),
      shopId: path,
      startDate: getLastDate(1),
    };
    let res = await shopBase(data);
    shopActionData.value = res;
  });
  function getLastDate(type = 0) {
    let y = new Date().getFullYear();
    let m = new Date().getMonth() + 1;
    let d = new Date(y, m, type).getDate();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    let min = type ? ' 00:00:00' : ' 23:59:59';
    return [y, m, d].join('-') + min;
  }
</script>

<style lang="less">
  .updata-content {
    margin: 20px;
    padding: 20px 34px 0 34px;
    background: #f7f8fa;
    border-radius: 2px;

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
    .content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .top {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        .top-img {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          margin: 20px 20px 20px 8px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }
        .top-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .top-info-item {
            height: 35px;
            line-height: 35px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
          }
        }
      }
      .item-box {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding-bottom: 20px;
        .item-title {
          font-size: 14px;
          color: #4f4f4f;
          line-height: 22px;
          min-width: 40px;
          flex-shrink: 0;
        }

        .item-value {
          font-size: 14px;
          color: #4f4f4f;
          line-height: 22px;
        }
      }
    }
    .content-other {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      .flex-1 {
        flex: 1;
      }
      .item-box {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding-bottom: 20px;
        .item-title {
          font-size: 14px;
          color: #4f4f4f;
          line-height: 22px;
          min-width: 40px;
          flex-shrink: 0;
        }

        .item-value {
          font-size: 14px;
          color: #4f4f4f;
          line-height: 22px;
        }
      }
    }
  }
</style>
