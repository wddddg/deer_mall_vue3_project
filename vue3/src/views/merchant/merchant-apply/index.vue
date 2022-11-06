<template>
  <BasicTable @register="registerTable">
    <template #action="{ record }">
      <a-dropdown>
        <a class="ant-dropdown-link">更多 <Icon icon="ant-design:down-outlined" /> </a>
        <template #overlay>
          <a-menu class="antd-more">
            <a-menu-item
              v-if="
                record.wxPayApplymentStatusCode !== 'NOT_SUBMIT' &&
                hasPermission('SHOP_APPLYMENT_RECORD_GET')
              "
            >
              <a @click="handleHistory(record)">操作记录</a>
            </a-menu-item>
            <a-menu-item
              v-if="
                record.organizationReviewStatusCode == 'ORG_REVIEW_STATUS_WAIT_REVIEW' &&
                hasPermission('ORGANIZATION_REVIEW')
              "
            >
              <a @click="handleReview(record)">审核主体信息</a>
            </a-menu-item>
            <a-menu-item
              v-if="
                record.wxPayApplymentStatusCode === 'NEED_SIGN' &&
                record.organizationReviewStatusCode === 'ORG_REVIEW_STATUS_APPROVED' &&
                hasPermission('SHOP_APPLYMENT_SEND_SIGN_URL')
              "
            >
              <Popconfirm placement="leftTop" @confirm="() => handleSendApply(record.id)">
                <template #title>
                  <div class="pooTitle">发送签约通知</div>
                  <div class="popContent"
                    >微信商户申请已通过，等待用户签约。是否发送签约通知给用户？</div
                  >
                </template>
                <a>发送签约通知</a>
              </Popconfirm>
            </a-menu-item>
            <a-menu-item
              v-if="
                record.wxPayApplymentStatusCode === 'ACCOUNT_NEED_VERIFY' &&
                hasPermission('SHOP_APPLYMENT_SEND_LEGAL_PERSON_VERIFICATION_URL')
              "
            >
              <Popconfirm placement="leftTop" @confirm="() => handleSendVerify(record.id)">
                <template #title>
                  <div class="pooTitle">发送验证通知</div>
                  <div class="popContent"
                    >该微信商户正在等待法人进行账户验证。是否发送验证通知给商户？</div
                  >
                </template>
                <a>发送验证通知</a>
              </Popconfirm>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
    <template #wxPayApplymentId="{ record }">
      <div>
        <div class="link" @click="pdfAction('review', record.wxReviewDocUrl)">{{
          record.wxPayApplymentId ? record.wxPayApplymentId : '-'
        }}</div>
      </div>
    </template>
    <template #shopName="{ record }">
      <div :class="hasPermission('SHOP_DETAIL_GET')? 'link' : 'no-drop'" @click="hasPermission('SHOP_DETAIL_GET')? goShopDetail(record):''">{{ record.name ? record.name : '-' }}</div>
    </template>

    <template #organizationType="{ record }">
      <div :class="hasPermission('SHOP_APPLYMENT_GET')? 'link' : 'no-drop'" @click="hasPermission('SHOP_APPLYMENT_GET')? goOrganizationDetail(record):''">{{
        record?.organizationType?.name
      }}</div>
    </template>
    <template #wxPayApplymentStatus="{ record }">
      <a-tag
        class="statusTag"
        :color="getStatusClass(record.wxPayApplymentStatus?.code)"
        v-if="record.wxPayApplymentStatus?.name"
      >
        {{ record.wxPayApplymentStatus?.name }}
      </a-tag>
    </template>
    <template #organizationReviewStatusType="{ record }">
      <a-tag class="statusTag" :color="getStatusClass(record.organizationReviewStatusType?.code)">
        {{ record.organizationReviewStatusType?.name }}
      </a-tag>
    </template>
  </BasicTable>
  <a-modal
    v-if="modalVisible"
    v-model:visible="modalVisible"
    :footer="null"
    title="历史操作记录"
    id="historyModal"
  >
    <BasicTable @register="registerModalTable">
      <template #wxReviewStatus="{ record }">
        <a-tag
          class="statusTag"
          :color="getStatusClass(record.wxReviewStatus?.code)"
          v-if="record.wxReviewStatus?.name"
        >
          {{ record.wxReviewStatus?.name }}
        </a-tag>
      </template>
      <template #action="{ record }">
        <div
          v-if="record.wxReviewStatusCode === 'REJECTED'"
          class="bColor"
          @click="showReject(record)"
          >驳回原因</div
        >
        <div v-else class="bColor" @click="pdfAction('review', record.wxReviewDocUrl)"
          >商户申请凭证</div
        >
      </template>
    </BasicTable>
    <a-modal
      v-model:visible="rejectVisible"
      title="驳回原因"
      :footer="null"
      :bodyStyle="{ height: '100px' }"
    >
      <div style="margin: 20px 0 20px 40px">
        {{ rejectInfo }}
      </div>
    </a-modal>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import Icon from '/@/components/Icon';
  import { BasicTable, useTable } from '/@/components/Table';
  import {
    getBasicColumns,
    getModalColumns,
    getFormConfig,
    getStatusClass,
  } from './merchantApply.data';
  import { OssUtils } from '/@/utils/ossUtils';
  import { applyList, historyListUrl, sendSign } from './merchantApply.api';
  import { Popconfirm } from 'ant-design-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { defHttp } from '/@/utils/http/axios';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const go = useGo();
  const route = useRoute();
  const router = useRouter();
  let modalVisible = ref(false);
  let rejectVisible = ref(false);
  let rejectInfo = ref('');
  let id = ref('');
  const historyList = () => defHttp.get({ url: historyListUrl + '/' + id.value });

  const [registerModalTable] = useTable({
    api: historyList,
    columns: getModalColumns(),
    useSearchForm: false,
    formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    pagination: false,
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
      params.offset = params.offset - 1;
    },
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'offset',
      // 传给后台的每页显示多少条的字段
      sizeField: 'limit',
      // 接口返回表格数据的字段
      listField: 'shops',
      // 接口返回表格总数的字段
      totalField: 'totalCount',
    },
    rowKey: 'id',
  });
  const [registerTable, { getForm }] = useTable({
    api: applyList,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
    },
    // 请求之前对参数做处理
    beforeFetch(params) {
      params.offset = params.offset > 1 ? params.offset - 1 : 0;
      params.subGroupPermissionCode =
        'MAMA_PERMISSION_MODULE_VENDOR_GROUP_VENDOR_SUB_SHOP_APPLYMENT';
    },
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'offset',
      // 传给后台的每页显示多少条的字段
      sizeField: 'limit',
      // 接口返回表格数据的字段
      listField: 'shops',
      // 接口返回表格总数的字段
      totalField: 'totalCount',
    },
    rowKey: 'id',
  });
  onMounted(async () => {
    console.log(route.query);
    if (route.query?.origin === '1') {
      await getForm().setFieldsValue({
        wxPayApplymentStatusCode: 'NEED_SIGN',
        organizationReviewStatusCode: 'ORG_REVIEW_STATUS_APPROVED',
      });
    } else if (route.query?.origin === '2') {
      await getForm().setFieldsValue({
        wxPayApplymentStatusCode: 'ACCOUNT_NEED_VERIFY',
        // organizationReviewStatusCode: 'ORG_REVIEW_STATUS_APPROVED',
      });
    }
  });
  const goShopDetail = (record) => {
    go('/merchant/basic/shopDetail/' + record.id);
  };
  const goOrganizationDetail = (record) => {
    go('/merchant/basic/operatorDetail/' + record.organizationId);
  };
  const handleHistory = (record) => {
    id.value = record.id;
    modalVisible.value = true;
  };
  // 审核主体信息
  const handleReview = (record) => {
    router.push({
      path: '/merchant/basic/operatorDetail/' + record.organizationId,
      query: { type: 'review' },
    });
  };
  const handleSendApply = async (id) => {
    await sendSign({ id, mamaSentSignUrl: true });
    message.success('发送签约通知成功！');
  };
  const handleSendVerify = async (id) => {
    await sendSign({ id, mamaSentLegalPersonValidationUrl: true });
    message.success('发送验证通知成功！');
  };
  const showReject = (record) => {
    rejectInfo.value = record.remark ? record.remark : '无';
    rejectVisible.value = true;
  };

  // PDF
  const ossUtils = new OssUtils();
  function pdfAction(action, url) {
    ossUtils.pdfAction(action, url);
  }
</script>
<style lang="less" scoped>
  :deep(.ant-table-title) {
    padding: 0 !important;
  }
  :deep(.ant-tabs > .ant-tabs-nav) {
    margin: 0 !important;
  }
  :deep(.vben-basic-table-header__toolbar) {
    display: none !important;
  }
  :deep(.ant-table-title) {
    display: none;
  }
  .link {
    cursor: pointer;
    &:hover {
      color: #007bff;
    }
  }
  .bColor {
    color: #007bff;
  }
  .statusTag {
    min-width: 40px;
  }
  .popTitle {
    font-size: 14px;
    font-weight: bold;
  }
  .popContent {
    text-align: center;
  }
  .no-drop{
    &:hover{
      cursor: no-drop;
    }
  }
</style>
