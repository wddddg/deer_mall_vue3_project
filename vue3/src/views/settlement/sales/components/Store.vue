<template>
  <a-row :gutter="10" class="row">
    <a-button type="link" class="explain" @click="goHelp">
      <question-circle-filled /> 分账说明
    </a-button>
    <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
      <!-- 店铺信息 -->
      <div class="chak-content">
        <div class="content-body">
          <div class="content-title">订单信息</div>
          <div class="content">
            <div class="top">
              <div class="top-info">
                <div class="top-info-item">
                  <div>店铺名称：</div>
                  <div class="link" @click="goDetail(data, 'shop')">
                    {{ data?.shopName || '-' }}</div
                  >
                </div>
                <div class="top-info-item">
                  <div>平台订单号：</div>
                  <div class="link" @click="goDetail(data, 'order')">
                    {{ data?.tradeId || '-' }}</div
                  >
                  <a-tooltip placement="topLeft" :arrowPointAtCenter="true">
                    <template #title>
                      <span>对应微信支付服务商平台的商户订单号</span>
                    </template>
                    <span class="help-box"><exclamation-circle-filled /></span>
                  </a-tooltip>
                </div>
                <div class="top-info-item">
                  <div>创建时间：</div>
                  <div> {{ filterTime(data?.tradeCreatedDate) || '-' }}</div>
                </div>
                <div class="top-info-item">
                  <div>支付时间：</div>
                  <div> {{ filterTime(data?.tradePaidDate) || '-' }}</div>
                </div>
                <div class="top-info-item">
                  <div>微信订单号：</div>
                  <div> {{ data?.wxTradeId || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-body">
          <div class="content-title">分账信息</div>
          <div class="content">
            <div class="top">
              <div class="top-info">
                <div class="top-info-item">
                  <div>分账申请(确认收货)时间：</div>
                  <div> {{ filterTime(data?.createdDate) || '-' }}</div>
                </div>
                <div class="top-info-item">
                  <div>平台分账单号：</div>
                  <div> {{ data?.id || '-' }}</div>
                </div>
                <div class="top-info-item">
                  <div>微信支付分账单号：</div>
                  <div> {{ data?.wxTradeProfitSharingId || '-' }}</div>
                </div>
                <div class="top-info-item">
                  <div>分账状态：</div>
                  <!-- <div> {{ data?.status?.name || '-' }}</div> -->
                  <a-tag
                    class="statusTag"
                    :color="
                      data.statusCode === 'PENDING'
                        ? '#3582fb'
                        : data.statusCode === 'rgb(255, 85, 0)'
                        ? '处理中'
                        : '#a7a7a7'
                    "
                  >
                    {{
                      data.statusCode === 'PENDING'
                        ? '待分账'
                        : data.statusCode === 'PROCESSING'
                        ? '处理中'
                        : '处理完成'
                    }}
                  </a-tag>
                </div>
                <div class="top-info-item">
                  <div>分账金额：</div>
                  <div class="finish-fee">
                    {{ completingDecimalLength(data?.finishFee) || '0.00' }}</div
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-body">
          <div class="content-title">店铺信息</div>
          <div class="content">
            <div class="top">
              <div class="top-info">
                <div class="top-info-item">
                  <div>商品费率：</div>
                  <div>
                    {{ data?.productCategoryMamaPlatformCommissionRate * 100 + '%' || '-' }}</div
                  >
                </div>
                <div class="top-info-item">
                  <div>商品费率所属分类：</div>
                  <div> {{ data?.productCategoryName || '-' }}</div>
                </div>
                <div class="top-info-item">
                  <div>平台设置销售费率：</div>
                  <div> {{ data?.mamaSaleCommissionRate * 100 + '%' || '-' }}</div>
                </div>
                <div class="top-info-item">
                  <div>商家设置销售费率：</div>
                  <div> {{ data?.shopSaleCommissionRate * 100 + '%' || '-' }}</div>
                </div>
                <div class="top-info-item">
                  <div>微信手续费率：</div>
                  <div> {{ data?.wxCommissionRate * 100 + '%' || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-col>
    <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
      <BasicTable @register="registerTable" />
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { onMounted, ref, unref, reactive, watch } from 'vue';
import { salesInfo } from '../sales.api';
import { getBasicColumnsStore } from '../sales.data';
import { useRouter } from 'vue-router';
import { formatToDateTime } from '/@/utils/dateUtil';
import { BasicTable, useTable } from '/@/components/Table';
import { getFetchSetting, getBeforeFetch } from '/@/utils/table';
import { useGo } from '/@/hooks/web/usePage';
import { QuestionCircleFilled, ExclamationCircleFilled } from '@ant-design/icons-vue';
const go = useGo();
const { currentRoute } = useRouter();

const { params } = unref(currentRoute);
const { path } = params;
let data = ref({});
onMounted(() => {
  getStoreData();
});
const filterTime = (time) => {
  return formatToDateTime(time);
};
const getStoreData = async () => {
  let res = await salesInfo(path);
  data.value = res;
  reload();
};
const [registerTable, { reload }] = useTable({
  api: salesInfo,
  columns: getBasicColumnsStore(),
  useSearchForm: false,
  beforeFetch() {
    return path;
  },
  fetchSetting: getFetchSetting('tradeProfitSharingReceivers'),
  showTableSetting: false,
  tableSetting: { fullScreen: true },
  showIndexColumn: false,
  rowKey: 'createdDate',
});

const goDetail = (value, link) => {
  if (link == 'order') {
    go(`/order/trades/tradesListDetail/${value.tradeId}`);
  } else if (link == 'shop') {
    go(`/merchant/basic/shopDetail/${value.shopId}`);
  }
};

const goHelp = () => {
  go('/help');
};

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
</script>

<style lang="less" scoped>
.item-click {
  color: #007bff !important;
  cursor: pointer;
}

.explain {
  position: absolute;
  right: 29px;
  top: 10px;
  cursor: pointer;
  color: #007bff !important;
}

.chak-content {
  margin: 20px 0px;
  padding: 20px 34px 0 34px;
  background: #f7f8fa;
  border-radius: 2px;
  display: flex;
  justify-content: space-around;

  .content-body {
    flex: 1;

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
          justify-content: center;
          flex-direction: column;

          .top-info-item {
            height: 35px;
            line-height: 35px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-right: 50px;

            .link {
              cursor: pointer;
              color: #007bff;
            }

            .finish-fee {
              color: #c02235;
            }
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
  }
}
.help-box {
  color: #d1d1d1;
  margin-left: 10px;
}
</style>
