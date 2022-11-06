<!--
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-24 22:44:00
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-25 18:25:03
-->
<template>
  <a-row :gutter="10">
    <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
      <!-- 店铺信息 -->
      <div class="updata-content">
        <div class="content-title">店铺信息</div>
        <div class="content">
          <div class="top">
            <div class="top-img">
              <img v-if="shopData?.logoUrl" :src="getFileUrl(shopData?.logoUrl)" />
              <!-- <img :src="imgData" alt="" /> -->
            </div>
            <div class="top-info">
              <div class="top-info-item">
                <div>店铺名称：</div>
                <div> {{ shopData?.name || '-' }}</div>
              </div>
              <div class="top-info-item">
                <div>开店时间：</div>
                <div> {{ filterTime(shopData?.startDate) || '-' }}</div>
              </div>
            </div>
          </div>
          <div class="item-box">
            <div class="item-title">店铺简介：</div>
            <div class="_item-value">{{ shopData?.intro || '-' }}</div>
          </div>
          <div class="item-box">
            <div class="item-title">店铺收藏量：</div>
            <div class="_item-value">{{ shopData?.favoriteTotalCount || '-' }}</div>
          </div>
        </div>
      </div>
      <!-- 其他信息 -->
      <div class="updata-content">
        <div class="content-title">其他信息</div>
        <div class="content-other">
          <a-row class="flex-1">
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">店铺编号：</div>
                <div class="item-value"> {{ shopData?.code }} </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">店铺状态：</div>
                <div class="item-value">
                  {{ shopData?.status?.name ? shopData?.status?.name : '-' }}
                  <span
                    v-if="
                      (shopData?.statusCode === 'SHOP_STATUS_PAUSE' ||
                        shopData?.statusCode === 'SHOP_STATUS_CLOSED') &&
                      shopData?.statusUpdateRemark
                    "
                    @click="openTextModal"
                    style="margin-left: 12px; cursor: pointer; color: #007bff"
                    >查看原因</span
                  >
                </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">测试店铺：</div>
                <div class="item-value">{{ shopData?.testOnly ? '是' : '否' }}</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">店铺销售费率：</div>
                <div class="item-value">
                  {{ shopData?.saleCommissionRate ? shopData?.saleCommissionRate * 100 : '-' }}
                  <span v-if="shopData?.saleCommissionRate">%</span>
                </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">运营方式：</div>
                <div class="item-value">{{
                  shopData?.mamaOwned ? '自营店铺' : shopData?.mamaOperated ? '代运营店铺' : '-'
                }}</div>
              </div>
            </a-col>
            <a-col :span="6" v-if="shopData?.mamaOperated">
              <div class="item-box">
                <div class="item-title">店铺代运营收取费率：</div>
                <div class="item-value">
                  {{
                    shopData?.mamaOperatedCommissionRate
                      ? Math.floor(shopData?.mamaOperatedCommissionRate * 100) + '%'
                      : '-'
                  }}
                </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">微信商户号：</div>
                <div class="item-value">{{ shopData?.wxPaySubMchId || '-' }}</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">微信商户申请状态：</div>
                <div class="item-value">{{ shopData?.wxPayApplymentStatus?.name }}</div>
              </div>
            </a-col>
            <a-col :span="6" v-if="shopData.organizationId">
              <div class="item-box">
                <div class="item-title">微信商户申请：</div>
                <div class="item-value item-click" @click="pdfAction('review', shopData)"
                  >商户申请凭证</div
                >
              </div>
            </a-col>
            <a-col :span="6" v-if="shopData.organizationId">
              <div class="item-box">
                <div class="item-title">主体信息：</div>
                <div :class="hasPermission('ORGANIZATION_GET')? 'item-value item-click':'no-drop'"
                 @click="hasPermission('ORGANIZATION_GET')? goOrganizationDetail() : ''">查看详情</div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <!-- 店主（负责人）信息 -->
      <div class="updata-content">
        <div class="content-title">店主（负责人）信息</div>
        <div class="content-other">
          <a-row class="flex-1">
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">负责人：</div>
                <div class="item-value"> {{ shopData?.vendor?.name || '-' }} </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">手机号：</div>
                <div class="item-value"> {{ shopData?.vendor?.mobile || '-' }} </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">邮箱：</div>
                <div class="item-value">{{
                  shopData?.vendor?.email ? shopData?.vendor?.email : '-'
                }}</div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <!-- 关联银行账户信息 -->
      <div class="updata-content">
        <div class="content-title">关联银行账户信息</div>
        <div class="content-other">
          <a-row class="flex-1">
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">银行账户类型：</div>
                <div class="item-value"> {{ bankData?.type?.name || '-' }} </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">开户银行：</div>
                <div class="item-value"> {{ bankData?.bankName || '-' }} </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">开户银行全称：</div>
                <div class="item-value">{{ bankData?.bankBranchName || '-' }}</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">开户名称：</div>
                <div class="item-value">{{ bankData?.accountName || '-' }}</div>
              </div> </a-col
            ><a-col :span="6">
              <div class="item-box">
                <div class="item-title">开户银行账号：</div>
                <div class="item-value">{{ bankData?.accountNumber || '-' }}</div>
              </div> </a-col
            ><a-col :span="6">
              <div class="item-box">
                <div class="item-title">银行卡开户省市：</div>
                <div class="item-value">{{
                  bankData?.wxSearchBankProvinceName + '-' + bankData?.wxSearchBankCityName
                }}</div>
              </div> </a-col
            ><a-col :span="6">
              <div class="item-box">
                <div class="item-title">开户银行省市编码：</div>
                <div class="item-value">{{ bankData?.wxBankCityCode || '-' }}</div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-col>
  </a-row>
  <a-modal
    v-model:visible="textVisible"
    title="更改原因"
    cancelText=""
    @ok="() => (textVisible = false)"
  >
    <div style="padding: 20px">{{ shopData?.statusUpdateRemark }}</div>
  </a-modal>
</template>

<script lang="ts" setup>
  import imgData from '/@/assets/images/demo.png';
  import { onMounted, ref, unref } from 'vue';
  import { shopInfo, bankInfo } from '../shop.api';
  import { useRouter } from 'vue-router';
  import { OssUtils } from '/@/utils/ossUtils';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const { currentRoute } = useRouter();
  const router = useRouter();

  const { params } = unref(currentRoute);
  const { path } = params;
  let shopData = ref({});
  let bankData = ref({});
  let textVisible = ref(false);
  onMounted(() => {
    getStoreData();
  });
  const filterTime = (time) => {
    return formatToDateTime(time);
  };
  const getStoreData = async () => {
    let res = await shopInfo(path);
    shopData.value = res;
    let resBank = await bankInfo(res.organizationId);
    bankData.value = resBank;
    console.log(res, resBank);
  };
  // 打开店铺状态原因
  const openTextModal = () => {
    textVisible.value = true;
  };
  // 查看主体信息
  const goOrganizationDetail = () => {
    router.push({ path: '/merchant/basic/operatorDetail/' + shopData.value.organizationId });
  };
  // imgs
  const ossUtils = new OssUtils();
  function getFileUrl(fileUrl: String) {
    return ossUtils.getSignatureUrl(fileUrl);
  }
  // PDF
  function pdfAction(action, listData) {
    ossUtils.pdfAction(action, listData.wxReviewDocUrl);
  }
</script>

<style lang="less" scoped>
  .item-click {
    color: #007bff !important;
    cursor: pointer;
  }
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
  .no-drop{
    &:hover{
      cursor: no-drop;
    }
    color: #007bff !important;
  }
</style>
