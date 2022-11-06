<template>
  <div class="px-10">
    <BasicModal
      :width="1200"
      centered
      :footer="null"
      :maskClosable="false"
      @register="registerStoreModal"
      v-bind="$attrs"
      title="Modal Title"
      :destroyOnClose="true"
    >
      <!-- 商家信息 -->
      <div class="updata-content">
        <div class="content-title">商家信息</div>
        <div class="content-other">
          <a-row class="flex-1">
            <a-col :span="7">
              <div class="item-box">
                <div class="item-title">企业名称：</div>
                <div class="item-value">
                  {{ moduleorganizationData?.organizationCompanyName || '-' }}
                </div>
              </div>
            </a-col>
            <a-col :span="7">
              <div class="item-box">
                <div class="item-title">法人姓名：</div>
                <div class="item-value">
                  {{ moduleorganizationData?.organizationLegalPersonName || '-' }}
                </div>
              </div>
            </a-col>
            <a-col :span="7">
              <div class="item-box">
                <div class="item-title">经营主体：</div>
                <div class="item-value">
                  {{ moduleorganizationData?.type?.name || '-' }}
                </div>
              </div>
            </a-col>
            <a-col :span="7">
              <div class="item-box">
                <div class="item-title">负责人姓名：</div>
                <div class="item-value">
                  {{ moduleorganizationData?.vendorName || '-' }}
                </div>
              </div>
            </a-col>
            <a-col :span="7">
              <div class="item-box">
                <div class="item-title">负责人联系电话：</div>
                <div class="item-value">
                  {{ moduleorganizationData?.vendorMobile || '-' }}
                </div>
              </div>
            </a-col>
            <a-col :span="7">
              <div class="item-box">
                <div class="item-title">负责人证件号码：</div>
                <div class="item-value">
                  {{ moduleorganizationData?.vendorCertNumber || '-' }}
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <!-- 店铺信息 -->
      <div class="updata-content">
        <div class="content-title">店铺信息</div>
        <div class="content-other">
          <BasicTable @register="registerStoreTable">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'id'">
                <a-tooltip title="二维码" color="#2db7f5">
                  <Icon
                    size="32"
                    color="#007bff"
                    icon="ant-design:qrcode-outlined"
                    @click="previewQrcode(record)"
                  />
                </a-tooltip>
                <a-tooltip title="查看店铺详情" color="#2db7f5" v-if="hasPermission('SHOP_DETAIL_GET')">
                  <Icon
                    size="32"
                    color="#007bff"
                    icon="ant-design:file-search-outlined"
                    @click="goShopDetail(record)"
                  />
                </a-tooltip>
              </template>
              <template v-if="column.key === 'logoUrl'">
                <!-- <TableImg :size="60" :simpleShow="true" :imgList="[record.logoUrl]" /> -->
                <div class="img-box">
                  <a-image :width="40" :src="getFileUrl(record.logoUrl)" />
                </div>
              </template>
            </template>
          </BasicTable>
        </div>
      </div>
      <a-modal
        :footer="null"
        v-model:visible="qrModalVisible"
        title="查看二维码"
        :bodyStyle="{ padding: '80px' }"
      >
        <a-image :width="300" :src="getFileUrl(qrUrl)" />
      </a-modal>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, TableImg } from '/@/components/Table';
  import Icon from '/@/components/Icon';
  import { OssUtils } from '/@/utils/ossUtils';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const go = useGo();
  let api = ref();
  let moduleorganizationData = ref({});
  let qrModalVisible = ref(false);
  let qrUrl = ref();
  const [registerStoreModal, { closeModal }] = useModalInner(async (data) => {
    console.log(data);
    setColumns(data.columns);
    api.value = data.api;
    moduleorganizationData.value = data.record;
  });
  const storeApi = () => defHttp.get({ url: api.value });
  const [registerStoreTable, { setColumns }] = useTable({
    api: storeApi,
    // columns: columns.value,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    rowKey: 'id',
  });
  const previewQrcode = (record) => {
    qrModalVisible.value = true;
    qrUrl.value = record.qrCodeUrl;
  };
  const goShopDetail = (record) => {
    go('/merchant/basic/shopDetail/' + record.id);
  };
  // imgs
  const ossUtils = new OssUtils();
  function getFileUrl(fileUrl: String) {
    return ossUtils.getSignatureUrl(fileUrl);
  }
</script>

<style lang="less" scoped>
  .updata-content {
    padding: 20px 34px 0 34px;
    background: #fff;
    border-bottom: 1px solid #d9d9d9;
    .ant-col {
      margin-right: 32px;
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
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .item-img {
          height: 175px;
          width: 300px;
          background-color: #f1f1f1;
        }
      }
    }
  }
  .img-box {
    height: 40px;
    width: 40px;
    :deep(.ant-image) {
      height: 40px;
      overflow: hidden;
      .ant-image-img {
        height: 40px;
      }
    }
  }
</style>
