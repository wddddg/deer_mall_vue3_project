<template>
  <a-row :gutter="10" class="row">
    <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
      <div class="updata-content">
        <div class="content-title">店铺信息</div>
        <div class="content">
          <div class="top">
            <div class="top-info">
              <div class="top-info-item">
                <div>店铺名称：</div>
                <div> {{ data?.nickName || '-' }}</div>
              </div>
              <div class="top-info-item">
                <div>到账时间：</div>
                <div> {{ filterTime(data?.createdDate) || '-' }}</div>
              </div>
              <div class="top-info-item">
                <a-button type="primary">导出</a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-col>
    <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
      <BasicTable @register="registerTable">
        <template #footer> 数据总数： </template>
      </BasicTable>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { settleInfo } from '../shopCoupon.api';
  import { getBasicColumnsStore } from '../shopCoupon.data';
  import { useRouter } from 'vue-router';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { BasicTable, useTable } from '/@/components/Table';
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
    let res = await settleInfo(path);
    data.value = res;
  };
  const [registerTable] = useTable({
    // api: getTradeLogisticsCompaniesList,
    columns: getBasicColumnsStore(),
    useSearchForm: false,
    // formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    // fetchSetting: getFetchSetting('buyers'),
    // // 请求之前对参数做处理
    // beforeFetch: getBeforeFetch,
    rowKey: 'id',
  });
</script>

<style lang="less" scoped>
  .item-click {
    color: #007bff !important;
    cursor: pointer;
  }
  .updata-content {
    margin: 20px 0px;
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
          justify-content: center;
          .top-info-item {
            height: 35px;
            line-height: 35px;
            display: flex;
            justify-content: flex-start;
            margin-right: 50px;
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
</style>
