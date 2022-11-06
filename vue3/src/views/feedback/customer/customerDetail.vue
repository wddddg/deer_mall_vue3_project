<!--
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-24 22:44:00
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-26 12:36:20
-->
<template>
  <a-row :gutter="10">
    <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
      <!-- 最新处理进度 -->
      <div class="updata-content">
        <div class="content-title">最新处理进度</div>
        <div class="content">
          <a-row class="flex-1">
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">反馈编码：</div>
                <div class="item-value"> {{ ticketData?.id }} </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">反馈分类：</div>
                <div class="item-value">
                  {{ ticketData?.typeCode ? ticketData?.type?.name : '-' }}
                </div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">反馈状态：</div>
                <div class="item-value">{{
                  ticketData?.statusCode ? ticketData?.status?.name : '-'
                }}</div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="item-box">
                <div class="item-title">
                  <a-button
                    type="primary"
                    @click="openInclude()"
                    v-if="hasPermission('BUYER_FEEDBACK_UPDATE')"
                    >分类</a-button
                  >
                </div>
                <div class="item-value" style="margin-left: 24px">
                  <a-button
                    v-if="hasPermission('BUYER_FEEDBACK_UPDATE')"
                    :disabled="
                      ticketData?.status?.code === 'TICKET_STATUS_CLOSED' ||
                      ticketData?.status?.code === 'TICKET_STATUS_RESOLVED'
                    "
                    type="primary"
                    @click="openDeal()"
                    >处理</a-button
                  >
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="updata-content">
        <div class="content-title">基本信息</div>
        <div class="content">
          <a-row>
            <a-col :span="24">
              <div class="item-box">
                <div class="item-title">反馈人：</div>
                <div class="item-value"> {{ ticketData?.createdUserNickName }} </div>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="item-box">
                <div class="item-title">提交时间：</div>
                <div class="item-value">
                  {{ dateUtil(ticketData?.createdDate).format('YYYY-MM-DD HH:mm:ss') }}
                </div>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="item-box">
                <div class="item-title">反馈描述：</div>
                <div class="item-value">
                  {{ ticketData?.description }}
                </div>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="item-box">
                <div class="item-title"> 上传图片： </div>
                <div
                  class="item-value item-img"
                  v-for="(item, index) in ticketData?.ticketDocuments"
                  :key="index"
                >
                  <a-image :width="130" :src="getFileUrl(item?.documentUrl)" />
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="updata-content">
        <div class="content-title">处理记录</div>
        <div class="content-base" v-if="tickList.length > 0">
          <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel v-for="item in tickList" :key="item.id">
              <template #header>
                <div> {{ item.status?.name }}</div>
                <div class="grey">{{ filterTime(item.createdDate) }}</div>
              </template>
              <template #extra>
                <div class="grey">操作人：{{ item.createdUserNickName }} </div>
              </template>
              <div class="finish" v-if="item.handlerUserName">
                <div class="item">处理人：{{ item.createdUserNickName }}</div>
                <div class="item">
                  联系方式：{{ item.handlerMobile ? item.handlerMobile : '无' }}
                </div>
                <div class="item-desc">进度描述：{{ item.handlerDescription }}</div>
              </div>
              <div class="on-process" v-else>
                {{ item.handlerDescription }}
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
        <div class="content-base" v-else>
          <div>暂无处理记录</div>
        </div>
      </div>
      <BasicModal
        centered
        :destroyOnClose="true"
        :maskClosable="false"
        :useWrapper="false"
        @register="registerIncludeModal"
        title="反馈类型分类"
        @ok="includeSetting()"
        :bodyStyle="{ height: '100px' }"
      >
        <a-form
          :model="includeFrom"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
        >
          <a-form-item
            label="反馈分类"
            name="typeCode"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <a-radio-group v-model:value="includeFrom.typeCode">
              <a-radio value="OPTIMIZATION">产品优化</a-radio>
              <a-radio value="FAULT">故障</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </BasicModal>
      <BasicModal
        centered
        :destroyOnClose="true"
        :maskClosable="false"
        :useWrapper="false"
        @register="registerDealModal"
        title="反馈意见处理"
        @ok="dealSetting()"
      >
        <a-form
          ref="formRef"
          :model="dealForm"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
          autocomplete="off"
        >
          <a-form-item
            label="反馈进度"
            name="statusCode"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <a-radio-group v-model:value="dealForm.statusCode">
              <a-radio v-for="(item, index) in statusList" :key="index" :value="item.code">
                {{ item.name }}
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="处理人"
            name="handlerUserId"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <a-select v-model:value="dealForm.handlerUserId">
              <a-select-option v-for="(item, index) in personList" :key="index" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="联系方式" name="handlerMobile">
            <a-input v-model:value="dealForm.handlerMobile" />
          </a-form-item>
          <a-form-item
            label="进度描述"
            name="handlerDescription"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <a-textarea v-model:value="dealForm.handlerDescription" />
          </a-form-item>
        </a-form>
      </BasicModal>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { detailInfo, recordList, include, dealPersonList, dealFeedback } from './customer.api';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { BasicModal, useModal } from '/@/components/Modal';

  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { dateUtil } from '/@/utils/dateUtil';

  const { hasPermission } = usePermission();
  const { currentRoute } = useRouter();
  const { params } = unref(currentRoute);
  const { path } = params;
  import { OssUtils } from '/@/utils/ossUtils';

  console.log(path, 'path');
  const statusList = [
    {
      code: 'TICKET_STATUS_PROCESSING',
      name: '处理中',
    },
    {
      code: 'TICKET_STATUS_RESOLVED',
      name: '已解决',
    },
    {
      code: 'TICKET_STATUS_CLOSED',
      name: '已关闭',
    },
  ];
  let activeKey = ref();
  let personList = ref();

  let ticketData = ref();
  let tickList = ref([]);
  let includeFrom = ref({
    typeCode: 'FAULT',
  });
  let dealForm = ref({
    handlerDescription: '',
    handlerMobile: '',
    handlerUserId: '',
    statusCode: '',
    ticketId: path,
  });
  const formRef = ref();
  // imgs
  const ossUtils = new OssUtils();
  function getFileUrl(fileUrl: String) {
    return ossUtils.getSignatureUrl(fileUrl);
  }
  onMounted(() => {
    getFeedbackInfo();
    if(hasPermission("BUYER_FEEDBACK_UPDATE")){
      getDealPersonList();
    }
  });
  // 获取处理人list
  const getDealPersonList = async () => {
    // let params = {}
    let res = await dealPersonList();
    personList.value = res.mamas;
  };
  //反馈意见处理Modal
  const [registerDealModal, { openModal: openDealModal, closeModal: closeDealModal }] = useModal();
  const openDeal = () => {
    openDealModal(true);
  };
  // 处理反馈意见
  const dealSetting = async () => {
    const values = await formRef.value.validateFields();
    console.log(values);
    if (values) {
      let params = Object.assign({}, dealForm.value);
      console.log(params);
      await dealFeedback(params);
      getFeedbackInfo();
      closeDealModal();
      message.success('提交成功！');
    }
  };
  //反馈分类类型
  const [registerIncludeModal, { openModal: openIncludeModal, closeModal: closeIncludeModal }] =
    useModal();
  const openInclude = () => {
    openIncludeModal(true);
  };
  const includeSetting = () => {
    let params = {
      typeCode: includeFrom.value.typeCode,
      id: path,
    };
    if (includeFrom.value.typeCode) {
      include(path, params).then(() => {
        getFeedbackInfo();
        closeIncludeModal();
      });
    } else {
      message.error('请选择反馈分类！');
    }
  };
  // 获取反馈基本信息
  const getFeedbackInfo = async () => {
    ticketData.value = await detailInfo(path);
    tickList.value = await recordList(path);
    activeKey.value = tickList.value.map((item) => item.id);
  };
  const filterTime = (time) => {
    return formatToDateTime(time);
  };
</script>

<style lang="less" scoped>
  .updata-content {
    margin: 20px;
    padding: 20px 34px 20px 34px;
    background: #fff;
    border-radius: 2px;
    .ant-col {
      margin-right: 0 !important;
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
        .item-img {
          height: 170px;
          width: 300px;
          background-color: #f1f1f1;
          display: flex;
          flex-direction: row;
          justify-content: center;
          :deep(.ant-image) {
            overflow: hidden;
            .ant-image-img {
              height: 170px;
            }
          }
        }
      }
    }
    .content-base {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .grey {
        padding-left: 10px;
        padding-right: 20px;
        color: #b8b8b8;
      }
      .finish {
        margin-left: 30px;
        .item {
          height: 32px;
          line-height: 32px;
        }
      }
      .on-process {
        margin-left: 30px;
      }
    }
  }
  .item-desc {
    min-height: 32px;
    line-height: 32px;
  }
</style>
