<template>
  <div style="flex: 1; margin: 20px">
    <!-- 基本信息 -->
    <div class="updata-content" v-if="organizationsData?.organizationCompany">
      <div class="content-title">主体信息</div>
      <div class="content-other">
        <a-row>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">证件类型：</div>
              <div class="item-value">
                {{ organizationsData?.organizationCompany?.certType.name }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">企业名称：</div>
              <div class="item-value"> {{ organizationsData?.organizationCompany?.name }} </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">社会信用代码：</div>
              <div class="item-value">{{ organizationsData?.organizationCompany?.certNumber }}</div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">注册地址：</div>
              <div class="item-value">
                {{ organizationsData?.organizationCompany?.address }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">经营范围：</div>
              <div class="item-value"> {{ organizationsData?.organizationCompany?.scope }}</div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">营业期限：</div>
              <div class="item-value">{{
                organizationsData?.organizationCompany?.termEndDate || '长期'
              }}</div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">经营主体状态：</div>
              <div class="item-value">{{ organizationsData?.status?.name }}</div>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="item-box">
              <div class="item-title">营业执照照片：</div>
              <div class="item-value item-img">
                <a-image
                  :width="130"
                  :src="getFileUrl(organizationsData?.organizationCompany?.certImageUrl)"
                />
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- 法人信息 -->
    <div class="updata-content" v-if="organizationsData?.organizationLegalPerson">
      <div class="content-title">法人信息</div>
      <div class="content-other">
        <a-row class="flex-1" :gutter="20">
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">姓名：</div>
              <div class="item-value">
                {{ organizationsData?.organizationLegalPerson?.name }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">证件类型：</div>
              <div class="item-value">
                {{ organizationsData?.organizationLegalPerson?.certType.name }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">证件号码：</div>
              <div class="item-value">{{
                organizationsData?.organizationLegalPerson?.certNumber
              }}</div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">证件有效期：</div>
              <div class="item-value">
                {{ organizationsData?.organizationLegalPerson?.termEndDate }}
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="content-other">
        <a-row class="flex-1" :gutter="20">
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">证件照正面：</div>
              <div class="item-value item-img">
                <!--                {{ organizationsData?.organizationLegalPerson?.certFrontImageUrl }}-->
                <a-image
                  :width="300"
                  :src="getFileUrl(organizationsData?.organizationLegalPerson?.certFrontImageUrl)"
                />
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">证件照背面：</div>
              <div class="item-value item-img">
                <!--                {{  organizationsData?.organizationLegalPerson?.certRealImageUrl }}-->
                <a-image
                  :width="300"
                  :src="getFileUrl(organizationsData?.organizationLegalPerson?.certRealImageUrl)"
                />
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- 负责人信息 -->
    <div class="updata-content">
      <div class="content-title">负责人信息</div>
      <div class="content-other">
        <a-row class="flex-1">
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">姓名：</div>
              <div class="item-value">
                {{ organizationsData?.vendor?.name }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">证件类型：</div>
              <div class="item-value">
                {{ organizationsData?.vendor?.certType.name }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">证件号码：</div>
              <div class="item-value">
                {{ organizationsData?.vendor?.certNumber }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">联系电话：</div>
              <div class="item-value">
                {{ organizationsData?.vendor?.mobile }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">证件有效期：</div>
              <div class="item-value">
                {{ organizationsData?.vendor?.termEndDate }}
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="content-other">
        <a-row class="flex-1">
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">证件照正面：</div>
              <div class="item-value item-img">
                <!--                {{ organizationsData?.vendor?.certFrontImageUrl }}-->
                <a-image
                  :width="300"
                  :src="getFileUrl(organizationsData?.vendor?.certFrontImageUrl)"
                />
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">证件照背面：</div>
              <div class="item-value item-img">
                <!--                {{ organizationsData?.vendor?.certRealImageUrl }}-->
                <a-image
                  :width="300"
                  :src="getFileUrl(organizationsData?.vendor?.certRealImageUrl)"
                />
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- 其他信息 -->
    <div class="updata-content">
      <div class="content-title">其他信息</div>
      <div class="content-other">
        <a-row class="flex-1">
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">经营主体类型：</div>
              <div class="item-value">
                {{ organizationsData?.type?.name }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">经营主体状态：</div>
              <div class="item-value">
                {{ organizationsData?.status?.name }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">有效期：</div>
              <div class="item-value">
                {{ getFormatTime(organizationsData?.statusExpireDate) }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">审核状态：</div>
              <div class="item-value">
                {{ organizationsData?.reviewStatus?.name }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">审核提交时间：</div>
              <div class="item-value">
                {{ getFormatTime(organizationsData?.reviewSubmittedDate) }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">最新审核时间：</div>
              <div class="item-value">
                {{ getFormatTime(organizationsData?.reviewHandledDate) }}
              </div>
            </div>
          </a-col>
          <a-col :span="7">
            <div class="item-box">
              <div class="item-title">年检期：</div>
              <div class="item-value">
                {{ rangeDate }}
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
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <div :style="{color: hasPermission('SHOP_DETAIL_GET')? '#007bff' : '',cursor: hasPermission('SHOP_DETAIL_GET')? 'pointer':'no-drop'}" @click=" hasPermission('SHOP_DETAIL_GET') ? goShopDetail(record) : ''">
                {{ record.name }}
              </div>
            </template>
            <template v-if="column.key === 'wxReviewDocUrl'">
              <div
                style="color: #007bff; cursor: pointer"
                @click="pdfAction('review', record.wxReviewDocUrl)"
              >
                查看凭证
              </div>
            </template>
            <template v-if="column.key === 'wxPayApplymentStatus'">
              <a-tag :color="getStatusClass(record?.wxPayApplymentStatus?.code)">{{
                record?.wxPayApplymentStatus?.name
              }}</a-tag>
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <!-- 审核意见 -->
    <div class="updata-content" v-if="type === 'review'">
      <div class="content-title">审核意见</div>
      <div class="content-other">
        <a-row class="flex-1" style="margin-bottom: 40px">
          <a-col :span="24">
            <div class="item-box">
              <!-- <div class="item-title"></div> -->
              <div class="item-value">
                <!-- reviewStatusCode -->
                <a-radio-group v-model:value="reviewStatusCode">
                  <a-radio value="ORG_REVIEW_STATUS_APPROVED">通过</a-radio>
                  <a-radio value="ORG_REVIEW_STATUS_REJECTED">驳回</a-radio>
                </a-radio-group>
              </div>
            </div>
          </a-col>
          <a-col :span="24" v-if="reviewStatusCode === 'ORG_REVIEW_STATUS_REJECTED'">
            <div class="item-box">
              <div class="item-title">驳回原因：</div>
              <div class="item-value" style="width: 100%">
                <!-- reviewRejectReason -->
                <a-textarea
                  v-model:value="reviewRejectReason"
                  placeholder="微信审核驳回，平台若无驳回原因可忽略不填"
                  rows="6"
                />
              </div>
            </div>
          </a-col>
          <div class="review-bottom">
            <a-button @click="handleReview" type="primary" style="margin-right: 20px"
              >提交</a-button
            >
            <a-button @click="handleReviewCancle">取消</a-button>
          </div>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { defHttp } from '/@/utils/http/axios';
  import { onMounted, ref, computed, unref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  // import { useMerchantStore } from '/@/store/modules/merchant';
  // const merchantStore = useMerchantStore();
  import { operationInfo, shopListUrl, updateOperationInfo } from './operatorList.api';
  import { getShopListColumns } from './operatorList.data';
  import { getStatusClass } from '../merchant-apply/merchantApply.data';
  import { formatToDateTime } from '/@/utils/dateUtil';
  // import dayjs from 'dayjs';
  import { OssUtils } from '/@/utils/ossUtils';

  import { useGo } from '/@/hooks/web/usePage';
  import { message } from 'ant-design-vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const go = useGo();

  import { useRouter } from 'vue-router';
  const { currentRoute } = useRouter();
  const { params, query } = unref(currentRoute);
  const { path } = params;
  const type = query.type;
  console.log(path, 'path', type);
  let reviewStatusCode = ref('ORG_REVIEW_STATUS_APPROVED');
  let reviewRejectReason = ref();

  let organizationsData = ref();
  const rangeDate = computed(() => {
    let start = getFormatTime(organizationsData.value?.regularReviewBeforeExpireDate);
    let end = getFormatTime(organizationsData.value?.statusExpireDate);
    return start + '至' + end;
  });
  const getFormatTime = (time) => {
    return time ? formatToDateTime(time) : '-';
  };
  onMounted(async () => {
    organizationsData.value = await operationInfo(path);
    console.log(organizationsData.value);
  });
  const handleReview = async () => {
    let params = {
      id: path,
      reviewStatusCode: reviewStatusCode.value,
      reviewRejectReason:
        reviewStatusCode.value === 'ORG_REVIEW_STATUS_REJECTED' ? reviewRejectReason.value : '',
    };
    await updateOperationInfo(path, params)
      .then((res) => {
        message.success('审核成功');
        go('/merchant/basic/merchantApply');
      })
      .catch((error) => {
        message.error(error?.response?.data?.message || '操作失败，请重试');
      });
  };
  const handleReviewCancle = () => {
    go('/merchant/basic/merchantApply');
  };
  const shopList = () => defHttp.get({ url: shopListUrl + '/' + path });
  const [registerTable, { reload }] = useTable({
    // title: '开启搜索区域',
    api: shopList,
    columns: getShopListColumns(),
    useSearchForm: false,
    // formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    // 请求之前对参数做处理
    beforeFetch(params) {
      params.pageNo = params.pageNo - 1;
    },
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'pageNo',
      // 传给后台的每页显示多少条的字段
      sizeField: 'pageSize',
      // 接口返回表格数据的字段
      listField: 'organizations',
      // 接口返回表格总数的字段
      totalField: 'totalCount',
    },
    rowKey: 'id',
  });
  const goShopDetail = (record) => {
    go('/merchant/basic/shopDetail/' + record.id);
  };
  // imgs
  const ossUtils = new OssUtils();
  function getFileUrl(fileUrl: String) {
    return ossUtils.getSignatureUrl(fileUrl);
  }
  // PDF
  function pdfAction(action, url) {
    ossUtils.pdfAction(action, url);
  }
</script>

<style lang="less" scoped>
  /* // 待提交 - 绿色 */
  .project-submit-item {
    background-color: #93c46b;
  }
  /* // 待审核 - 蓝色 */
  .project-review-item {
    background-color: #3582fb;
  }
  /* // 驳回 - 红色 */
  .project-rejected-item {
    background-color: #f85e5e;
  }
  /* //  通过 - 灰色 */
  .project-approved-item {
    background-color: #a7a7a7;
  }
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
          height: 170px;
          width: 300px;
          background-color: #f1f1f1;
          display: flex;
          flex-direction: row;
          justify-content: center;
          .ant-image {
            overflow: hidden;
            .ant-image-img {
              height: 170px;
            }
          }
        }
      }
      .review-bottom {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding-right: 40px;
      }
    }
  }
</style>
